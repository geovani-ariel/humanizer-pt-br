import { mkdir, open, readFile, realpath, rename, stat, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const day = 24 * 60 * 60 * 1000;
const source = 'https://raw.githubusercontent.com/geovani-ariel/humanizer-pt-br/main/SKILL.md';
const updateCommand = 'npx skills update humanizer-pt-br';

function versionParts(version) {
  if (typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error('Versão estável inválida');
  }
  const parts = version.split('.').map(Number);
  if (!parts.every(Number.isSafeInteger)) throw new Error('Versão fora do intervalo');
  return parts;
}

export function parseVersion(text) {
  const front = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const metadata = front?.[1].match(/^metadata:[ \t]*\r?\n((?:[ \t]+[^\r\n]*(?:\r?\n|$))*)/m);
  const version = metadata?.[1].match(/^ {2}version:[ \t]*["']?(\d+\.\d+\.\d+)["']?[ \t]*$/m)?.[1];
  versionParts(version);
  return version;
}

function isNewer(remote, local) {
  const a = versionParts(remote);
  const b = versionParts(local);
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] > b[i];
  }
  return false;
}

async function readCache(cacheFile) {
  try {
    const value = JSON.parse(await readFile(cacheFile, 'utf8'));
    return value && typeof value === 'object' ? value : null;
  } catch {
    return null;
  }
}

async function saveCache(cacheFile, state) {
  await mkdir(dirname(cacheFile), { recursive: true, mode: 0o700 });
  const temporary = `${cacheFile}.${process.pid}.tmp`;
  await writeFile(temporary, JSON.stringify(state) + '\n', { mode: 0o600 });
  await rename(temporary, cacheFile);
}

async function fetchPublishedVersion() {
  const response = await fetch(source, {
    headers: { Accept: 'text/plain' },
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error('Consulta indisponível');
  const text = await response.text();
  if (text.length > 64 * 1024) throw new Error('Resposta excede o limite');
  return parseVersion(text);
}

async function lockCache(cacheFile) {
  await mkdir(dirname(cacheFile), { recursive: true, mode: 0o700 });
  const lockFile = `${cacheFile}.lock`;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return { handle: await open(lockFile, 'wx', 0o600), path: lockFile };
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      const info = await stat(lockFile).catch(() => null);
      if (attempt === 0 && info && Date.now() - info.mtimeMs > 60_000) {
        await unlink(lockFile).catch(() => {});
        continue;
      }
      return null;
    }
  }
  return null;
}

export async function checkForUpdate({
  localVersion, cacheFile, fetchVersion = fetchPublishedVersion,
  now = Date.now(), force = false, disabled = false,
}) {
  versionParts(localVersion);
  const base = { localVersion, latestVersion: null, notify: false, cached: false };
  if (disabled) return { ...base, status: 'disabled' };

  let lock;
  try {
    lock = await lockCache(cacheFile);
  } catch {
    return { ...base, status: 'unavailable', reason: 'cache_unwritable' };
  }
  if (!lock) return { ...base, status: 'busy' };
  try {
    return await checkLocked({ localVersion, cacheFile, fetchVersion, now, force });
  } finally {
    await lock.handle.close().catch(() => {});
    await unlink(lock.path).catch(() => {});
  }
}

async function checkLocked({ localVersion, cacheFile, fetchVersion, now, force }) {
  const base = { localVersion, latestVersion: null, notify: false, cached: false };

  const previous = await readCache(cacheFile);
  const fresh = previous?.localVersion === localVersion
    && Number.isFinite(previous.checkedAt)
    && now >= previous.checkedAt && now - previous.checkedAt < day;
  const usable = fresh && ['up_to_date', 'update_available', 'unavailable'].includes(previous.status);
  let latestVersion = null;
  let cached = false;
  try {
    if (usable && !force) {
      cached = true;
      if (previous.status !== 'unavailable') {
        versionParts(previous.latestVersion);
        latestVersion = previous.latestVersion;
      }
    } else {
      latestVersion = await fetchVersion();
      versionParts(latestVersion);
    }
  } catch {
    latestVersion = null;
  }

  const status = latestVersion === null ? 'unavailable'
    : isNewer(latestVersion, localVersion) ? 'update_available' : 'up_to_date';
  const notify = status === 'update_available'
    && (force || previous?.lastNotifiedVersion !== latestVersion);
  const state = {
    localVersion, latestVersion, status,
    checkedAt: cached ? previous.checkedAt : now,
    lastNotifiedVersion: notify ? latestVersion : previous?.lastNotifiedVersion ?? null,
  };
  try {
    await saveCache(cacheFile, state);
  } catch {
    return { ...base, status: 'unavailable', reason: 'cache_unwritable' };
  }
  return {
    ...base, status, latestVersion, notify, cached,
    ...(status === 'update_available' ? {
      updateCommand,
      message: `Humanizer pt-BR ${latestVersion} disponível; versão local ${localVersion}.`,
    } : {}),
  };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== '--force')) throw new Error('Use apenas --force, se necessário');
  const localVersion = parseVersion(await readFile(new URL('../SKILL.md', import.meta.url), 'utf8'));
  const cacheRoot = process.env.HUMANIZER_PT_BR_CACHE_DIR
    || join(process.env.XDG_CACHE_HOME || join(homedir(), '.cache'), 'humanizer-pt-br');
  const result = await checkForUpdate({
    localVersion, cacheFile: join(cacheRoot, 'update.json'),
    force: args.includes('--force'),
    disabled: process.env.HUMANIZER_PT_BR_UPDATE_CHECK === '0',
  });
  process.stdout.write(JSON.stringify(result) + '\n');
}

const invokedPath = process.argv[1] ? await realpath(process.argv[1]).catch(() => null) : null;
const ownPath = await realpath(fileURLToPath(import.meta.url));
if (invokedPath === ownPath) {
  main().catch(() => {
    process.stdout.write(JSON.stringify({ status: 'unavailable', notify: false }) + '\n');
    process.exitCode = 1;
  });
}
