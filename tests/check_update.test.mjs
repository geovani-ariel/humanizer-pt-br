import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, symlink, utimes, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { checkForUpdate, parseVersion } from '../scripts/check-update.mjs';

const day = 24 * 60 * 60 * 1000;
const skill = (version) => `---\nname: humanizer-pt-br\nmetadata:\n  version: "${version}"\n---\n`;

async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), 'humanizer-update-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  return { cacheFile: join(dir, 'state.json'), now: 10 * day, localVersion: '1.4.0' };
}

test('lê a versão somente nos metadados do frontmatter', () => {
  assert.equal(parseVersion(skill('1.4.0') + 'version: "99.0.0"'), '1.4.0');
  assert.throws(() => parseVersion('Texto com version: "1.4.0"'));
  assert.throws(() => parseVersion(skill('$(echo invalido)')));
});

test('versão igual ou anterior não produz aviso', async (t) => {
  const options = await fixture(t);
  const equal = await checkForUpdate({ ...options, fetchVersion: async () => '1.4.0' });
  assert.equal(equal.status, 'up_to_date');
  assert.equal(equal.notify, false);
  const older = await checkForUpdate({ ...options, force: true, fetchVersion: async () => '1.3.9' });
  assert.equal(older.notify, false);
});

test('versão maior gera aviso e comando restrito à skill', async (t) => {
  const result = await checkForUpdate({ ...await fixture(t), fetchVersion: async () => '1.10.0' });
  assert.equal(result.status, 'update_available');
  assert.equal(result.notify, true);
  assert.equal(result.latestVersion, '1.10.0');
  assert.equal(result.updateCommand, 'npx skills update humanizer-pt-br');
});

test('cache evita nova consulta por 24 horas e aviso repetido', async (t) => {
  const options = await fixture(t);
  let calls = 0;
  const fetchVersion = async () => { calls++; return '1.4.1'; };
  await checkForUpdate({ ...options, fetchVersion });
  const cached = await checkForUpdate({ ...options, now: options.now + day - 1, fetchVersion });
  assert.equal(calls, 1);
  assert.equal(cached.cached, true);
  assert.equal(cached.notify, false);
  const refreshed = await checkForUpdate({ ...options, now: options.now + day, fetchVersion });
  assert.equal(calls, 2);
  assert.equal(refreshed.notify, false);
});

test('uma nova versão pode gerar novo aviso', async (t) => {
  const options = await fixture(t);
  await checkForUpdate({ ...options, fetchVersion: async () => '1.4.1' });
  const newer = await checkForUpdate({ ...options, now: options.now + day, fetchVersion: async () => '1.4.2' });
  assert.equal(newer.notify, true);
});

test('desativado não consulta a rede nem grava cache', async (t) => {
  const options = await fixture(t);
  const result = await checkForUpdate({ ...options, disabled: true, fetchVersion: async () => assert.fail('consultou a rede') });
  assert.equal(result.status, 'disabled');
  assert.equal(result.notify, false);
  await assert.rejects(readFile(options.cacheFile));
});

test('falha de rede é indisponibilidade, sem aviso ou repetição imediata', async (t) => {
  const options = await fixture(t);
  const result = await checkForUpdate({ ...options, fetchVersion: async () => { throw Error('offline'); } });
  assert.equal(result.status, 'unavailable');
  assert.equal(result.notify, false);
  const cached = await checkForUpdate({ ...options, fetchVersion: async () => assert.fail('repetiu após falha') });
  assert.equal(cached.status, 'unavailable');
});

test('checagem explícita ignora cache e pode repetir aviso', async (t) => {
  const options = await fixture(t);
  await checkForUpdate({ ...options, fetchVersion: async () => '1.4.1' });
  const result = await checkForUpdate({ ...options, force: true, fetchVersion: async () => '1.4.1' });
  assert.equal(result.cached, false);
  assert.equal(result.notify, true);
});

test('mudança da versão instalada invalida o cache anterior', async (t) => {
  const options = await fixture(t);
  await checkForUpdate({ ...options, fetchVersion: async () => '1.4.1' });
  const result = await checkForUpdate({ ...options, localVersion: '1.4.1', fetchVersion: async () => '1.4.1' });
  assert.equal(result.cached, false);
  assert.equal(result.notify, false);
});

test('cache corrompido é recuperado; versão remota inválida não vira atualização', async (t) => {
  const options = await fixture(t);
  await writeFile(options.cacheFile, '{');
  const result = await checkForUpdate({ ...options, fetchVersion: async () => 'invalida' });
  assert.equal(result.status, 'unavailable');
  assert.equal(result.notify, false);
  const state = JSON.parse(await readFile(options.cacheFile, 'utf8'));
  assert.equal(state.status, 'unavailable');
});

test('checagens concorrentes emitem no máximo um aviso', async (t) => {
  const options = await fixture(t);
  let calls = 0;
  const fetchVersion = async () => {
    calls++;
    await new Promise((resolve) => setTimeout(resolve, calls === 1 ? 80 : 5));
    return '1.4.1';
  };
  const results = await Promise.all([
    checkForUpdate({ ...options, fetchVersion }),
    checkForUpdate({ ...options, fetchVersion }),
  ]);
  assert.equal(calls, 1);
  assert.equal(results.filter((result) => result.notify).length, 1);
});

test('CLI também funciona quando a pasta instalada é um link simbólico', async (t) => {
  const options = await fixture(t);
  const root = fileURLToPath(new URL('../', import.meta.url));
  const link = join(dirname(options.cacheFile), 'linked-skill');
  await symlink(root, link, 'dir');
  const output = execFileSync(process.execPath, [join(link, 'scripts/check-update.mjs')], {
    encoding: 'utf8',
    env: { ...process.env, HUMANIZER_PT_BR_UPDATE_CHECK: '0', HUMANIZER_PT_BR_CACHE_DIR: dirname(options.cacheFile) },
  });
  const result = JSON.parse(output);
  assert.equal(result.status, 'disabled');
  assert.equal(result.notify, false);
});

test('uma checagem interrompida não deixa bloqueio permanente', async (t) => {
  const options = await fixture(t);
  const lockFile = `${options.cacheFile}.lock`;
  await writeFile(lockFile, '');
  const past = new Date(Date.now() - 120_000);
  await utimes(lockFile, past, past);
  const result = await checkForUpdate({ ...options, fetchVersion: async () => '1.4.1' });
  assert.equal(result.notify, true);
  await assert.rejects(readFile(lockFile));
});

test('cache sem escrita não interrompe a revisão nem consulta a rede', async (t) => {
  const options = await fixture(t);
  await writeFile(options.cacheFile, 'arquivo, não diretório');
  const result = await checkForUpdate({
    ...options, cacheFile: join(options.cacheFile, 'state.json'),
    fetchVersion: async () => assert.fail('consultou sem poder manter o cache'),
  });
  assert.equal(result.status, 'unavailable');
  assert.equal(result.notify, false);
});
