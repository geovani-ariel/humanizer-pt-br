# Humanizer em português brasileiro

Skill para revisar prosa em português brasileiro, preservar a voz do autor e criar variações de escrita conforme o gênero e o leitor.

A versão 1.4.0 parte da [Humanizer 3.1.0, de Siqi Chen](https://github.com/blader/humanizer), e incorpora 23 referências de redação, linguagem simples, literatura e estudos do texto. A adaptação é mantida por [Geovani Ariel](https://github.com/geovani-ariel).

## O que ela faz

- Revê clichês, linguagem inflada, redundâncias e resíduos de chatbot.
- Preserva fatos, condições, grau de certeza e elementos técnicos.
- Mantém travessões, gerúndios, repetições e fragmentos quando cumprem uma função no texto.
- Orienta escolhas de perspectiva, ritmo, composição e relação com o leitor.
- Distingue revisão, variação de voz e criação a partir de um briefing.

A skill não determina se um texto foi escrito por IA. As listas de expressões são heurísticas editoriais, sem poder diagnóstico demonstrado. A literatura amplia as possibilidades de escrita; não define um estilo único a ser aplicado a todos os textos.

## Correção 1.3.1

A revisão remove a voz do modelo em “até minha última atualização” e conserva o conteúdo introduzido, incluindo hipóteses, datas de referência e ressalvas. Um limite datado continua com seu alcance de “até”. Informação antiga não vira confirmação atual.

Quando a expressão se refere a uma atualização feita pelo autor humano, ou aparece em citação literal, ela mantém sua função. Os [casos e resultados da correção](tests/atualizacao/README.md) documentam essa distinção.

## Instalação por npx skills

Requer Node.js compatível com a versão do CLI instalada. A versão 1.7.4, usada na verificação deste repositório, exige Node.js 22.20 ou posterior.

No projeto em que deseja usar a skill:

```sh
npx skills add geovani-ariel/humanizer-pt-br --skill humanizer-pt-br
```

O CLI permite escolher os agentes. Para instalar somente para Codex no projeto:

```sh
npx skills add geovani-ariel/humanizer-pt-br --skill humanizer-pt-br --agent codex
```

Para instalação global, disponível em outros projetos:

```sh
npx skills add geovani-ariel/humanizer-pt-br --skill humanizer-pt-br -g
```

Para listar a skill sem instalá-la:

```sh
npx skills add geovani-ariel/humanizer-pt-br --list
```

A descoberta usa `SKILL.md` na raiz. As referências e o script de atualização acompanham a pasta instalada. Como alternativa manual, clone o repositório e coloque a pasta no diretório de skills do seu agente, mantendo os arquivos juntos.

## Aviso e instalação de atualizações

Quando o agente dispõe de execução local, rede permitida e canal de comentário separado, a skill faz uma checagem na primeira utilização de cada chat. O script compara `metadata.version` local com a versão estável publicada no GitHub; só avisa quando encontra uma versão maior. Usa cache de 24 horas, evita repetir um aviso já registrado para a mesma versão e não reinstala arquivos.

O aviso aparece separado do texto solicitado. Em interfaces sem canal de comentário, a checagem automática é adiada. Falta de rede, cache sem permissão ou erro de consulta não interrompem a revisão e não são apresentados como confirmação de que a versão está atualizada.

Para conferir manualmente, a partir da pasta da skill:

```sh
node scripts/check-update.mjs --force
```

O resultado é JSON com `status`, `localVersion`, `latestVersion` e `notify`. O script usa apenas módulos nativos do Node.js e consulta uma URL pública fixa do repositório; não envia textos, credenciais ou arquivos de trabalho. A versão recebida é tratada como dado, sem executar conteúdo remoto. O cache padrão fica em `~/.cache/humanizer-pt-br/update.json`, respeitando `XDG_CACHE_HOME`. Para escolher outro diretório, use `HUMANIZER_PT_BR_CACHE_DIR`.

Para desativar, configure `HUMANIZER_PT_BR_UPDATE_CHECK=0` no ambiente do agente. A checagem compara apenas versões estáveis no formato `major.minor.patch` em `metadata.version`; alterações sem aumento de versão não geram aviso. Ela acompanha `main`, portanto instalações deliberadamente fixadas em outra referência devem desativar o aviso se não quiserem acompanhar essa linha.

Depois de decidir atualizar, use o comando correspondente à instalação:

```sh
# Instalação no projeto
npx skills update humanizer-pt-br -p

# Instalação global
npx skills update humanizer-pt-br -g
```

O aviso não executa esses comandos. Quem instalou manualmente pode reinstalar usando `npx skills add` ou atualizar seu clone.

A descoberta e os comandos foram conferidos na [referência oficial do CLI](https://github.com/vercel-labs/skills/blob/main/docs/commands.md) e no código do pacote `skills@1.7.4`. Nesse pacote, `check` e `update` usam o mesmo fluxo; por isso, o aviso não usa `npx skills check` como operação só de leitura. O comportamento foi verificado no [encaminhamento de comandos](https://github.com/vercel-labs/skills/blob/main/src/cli.ts) e no [fluxo de atualização](https://github.com/vercel-labs/skills/blob/main/src/update.ts), apesar de a documentação consultada descrever `check` de outra maneira.

## Comportamento padrão

Na revisão, a intervenção é conservadora e a entrega contém somente o texto final. Um texto já adequado pode permanecer intacto. Diagnóstico, antes/depois e justificativas aparecem quando solicitados.

Afirmações e atribuições do original são preservadas mesmo quando a fonte não foi enviada. Uma revisão de estilo não confirma, remove ou corrige silenciosamente dados. A checagem factual depende do pedido; uma pendência indispensável pode ser registrada separadamente, respeitando o formato de saída.

Amostras do autor orientam escolhas recorrentes de voz. Uma gíria isolada ou uma única frase não se torna regra. Os 26 padrões estão em um catálogo separado, consultado conforme a tarefa.

## Exemplos de uso

```text
Use a skill humanizer-pt-br para revisar este texto. Preserve os fatos e minha
voz. Entregue somente a versão final:

[texto]
```

```text
Use a skill humanizer-pt-br para criar duas versões deste aviso: uma informativa
e outra como convite. Use somente os dados do briefing:

[briefing]
```

```text
Use a skill humanizer-pt-br para revisar esta crônica. Preserve as repetições
deliberadas, o registro do narrador e o final aberto:

[crônica]
```

Ao pedir criação factual, forneça os dados disponíveis. Ao pedir ficção, indique as restrições da cena e o que pode ser inventado. Uma amostra de escrita ajuda a preservar a voz pretendida.

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| [SKILL.md](SKILL.md) | Núcleo de decisões, fidelidade, voz e entrega. |
| [Catálogo de revisão](references/padroes-de-revisao.md) | Os 26 padrões, com exemplos e limites de aplicação. |
| [Fundamentação](references/fundamentacao.md) | Treze referências brasileiras de redação e linguagem, com aplicações e limites. |
| [Literatura e estilo](references/literatura-e-estilo.md) | Dez referências complementares de literatura, gêneros e estudos do texto. |
| [Repertório de escrita](references/repertorio-de-escrita.md) | Escolhas para criar textos ou variar a voz e a composição. |
| [Casos históricos](references/casos-de-revisao.md) | Registros das versões 1.1.0 e 1.2.0. |
| [Avaliação 1.3.0](tests/README.md) | Pedidos neutros, critérios, controle e saídas completas. |
| [Verificador de atualização](scripts/check-update.mjs) | Consulta de versão, cache e aviso sem reinstalação. |
| [Testes do verificador](tests/check_update.test.mjs) | Casos de atualização, cache, indisponibilidade e desativação. |
| [LICENSE](LICENSE) | Licença MIT e avisos de autoria. |

## Validação e limites

O [protocolo 1.3.0](tests/README.md) compara cinco execuções por condição em três pedidos neutros: sem a skill, com a 1.2.0 e com a 1.3.0. Oito pedidos adicionais verificam a integração. As saídas e os limites da avaliação ficam no diretório de testes.

Para conferir a integridade do pacote, execute:

```sh
python3 tests/check_package.py
node --test tests/check_update.test.mjs
```

Essa verificação mecânica não julga a qualidade dos textos. Não houve pesquisa com leitores nem medição de preferência estética. Algumas referências têm acesso parcial, registrado na fundamentação. Os testes com modelos não comprovam superioridade literária.

## Contribuições

Sugestões e correções são bem-vindas em issues e pull requests. Para alterar uma regra, descreva o problema e inclua um exemplo com o resultado esperado. Ao acrescentar uma referência, informe o que ela sustenta e seus limites. Não inclua dados pessoais ou confidenciais nos exemplos.

## Origem e licença

Adaptação independente da [Humanizer](https://github.com/blader/humanizer), sob [licença MIT](LICENSE). O aviso de copyright de Siqi Chen foi preservado, com um aviso adicional para a adaptação em português brasileiro.

A Humanizer original atribui sua base à página [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), da Wikipédia. As fontes brasileiras foram usadas para fundamentar, corrigir ou ampliar orientações específicas.

Os textos e estudos citados conservam seus próprios direitos e licenças. Suas obras não são distribuídas neste repositório; os links e comentários de leitura não implicam endosso dos autores à skill.
