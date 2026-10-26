# Avaliação da versão 1.3.0

A correção 1.3.1 tem [casos e resultados próprios](atualizacao/README.md); este arquivo conserva o registro da 1.3.0.

## Protocolo

Use os pedidos de `cases.json` sem acrescentar dicas sobre o resultado esperado. Para cada execução, forneça o pedido, o texto e as amostras, quando existirem. Cada pedido deve ser tratado como uma tarefa de edição própria. Em cada repetição do microteste, os três pedidos compartilham o contexto de um agente; as cinco repetições e as condições usam agentes separados.

O microteste usa os casos `atribuicao`, `pronto` e `cronica`, com cinco execuções independentes por condição: sem a skill, com a versão 1.2.0 e com a versão 1.3.0. O controle sem a skill não recebe suas instruções. Os avaliadores de geração não recebem os critérios ou resultados de terceiros. Os demais oito casos são uma verificação de integração da nova versão.

As execuções são de agentes do mesmo ambiente, não de leitores independentes. Os três casos de microteste são curtos; a repetição observa consistência nesses casos e não estabelece significância estatística ou preferência estética. A interpretação dos resultados é editorial, com inspeção das saídas completas.

## Critérios

- Atribuição: manter alegação, percentual de 18%, atribuição e apuração pendente; não afirmar verificação.
- Aviso pronto: preservar data e valor, sem intervenção ou diagnóstico desnecessários. Uma pequena mudança equivalente não é falha de fidelidade.
- Crônica: manter a repetição e a percepção do narrador, sem explicar a ausência ou inventar ação.
- Hipótese: manter a existência de poucos registros, a autoria da hipótese e sua incerteza; não alegar inexistência documental ou pesquisa própria.
- Condição: preservar o alcance da autorização e a alternativa sem autorização; remover apenas a redundância da ressalva.
- Elementos protegidos: manter comando, URL e mensagem literal.
- Voz: manter os dados do comunicado, usar escolhas recorrentes pertinentes ao gênero e não copiar conteúdo das amostras ou inventar uma intimidade.
- Contraste: manter a distinção emocional e a perspectiva do conto.
- Criação: dados preservados no aviso; invenção limitada à ficção.
- Comentada: atender ao pedido de explicação, sem obrigar a entrega em três etapas.
- JSON: esquema e valores protegidos mantidos; revisão restrita ao valor autorizado.

Em cada caso, avalie também a entrega direta quando não houver pedido de comentário. Compare conteúdo e função, não correspondência com uma redação única. Os resultados completos estão em `results/`; veja a análise abaixo.

## Resultados em 26 de outubro de 2026

Foram inspecionadas todas as saídas do microteste: três pedidos, três condições e cinco repetições por condição, totalizando 45 respostas. Os arquivos `control-1.json` a `control-5.json`, `old-1.json` a `old-5.json` e `new-1.json` a `new-5.json` conservam as saídas literais.

| Observação nos cinco registros de cada condição | Sem a skill | 1.2.0 | 1.3.0 |
|---|---|---|---|
| Alegação de redução de 18%, atribuição e apuração pendente preservadas | 5/5 | 0/5 | 5/5 |
| Aviso entregue uma vez, sem diagnóstico ou versões duplicadas | 5/5 | 0/5 | 5/5 |
| Repetição e fragmentos da crônica preservados no texto revisado | 5/5 | 5/5 | 5/5 |

A versão 1.2.0 removeu a alegação numérica nos cinco registros, seguindo sua regra de exclusão por falta de fonte. Na versão 1.3.0, os três textos ficaram intactos e foram entregues diretamente nos cinco registros. No controle, quatro respostas acrescentaram uma observação sobre a fonte no caso de atribuição; isso está visível nos arquivos e não foi confundido com perda da alegação. Pequenas variações equivalentes de redação no controle não foram contadas como falhas de fidelidade.

### Integração e ajuste de amostras

O arquivo `integration.json` contém os oito casos adicionais. Sete atenderam aos critérios. No caso de voz, os dados foram preservados, mas a saída transferiu para o comunicado um pedido de contato que pertencia à amostra. A regra de amostras foi então refinada: o briefing autoriza conteúdo e ações; a amostra orienta a forma.

Um novo agente recebeu apenas esse caso e a skill atualizada. Em `voice-retest.json`, a saída manteve horário e sala sem importar o pedido de contato. Foi uma nova execução desse caso, não uma repetição de toda a integração. Depois desse ajuste, o microteste foi executado novamente com cinco agentes novos. A tabela e os arquivos `new-*.json` registram essa execução final. Os textos do microteste não aparecem como exemplos de resposta no catálogo.

### Alcance da avaliação

Os resultados registram consistência nos exemplos apresentados, não uma taxa geral de sucesso. O autor da alteração inspecionou as saídas sabendo a condição; não houve avaliação cega, randomização ou leitores humanos. Os agentes compartilham o mesmo ambiente. Os casos foram escritos antes da alteração e não incluem instruções como “preserve a repetição”; os geradores não receberam os critérios.

Houve também uma revisão independente do diff, sem problemas acionáveis encontrados, e verificações mecânicas de pacote e de frontmatter. Isso não substitui uma avaliação futura de voz e clareza com leitores.

O núcleo passou de 4097 para 1012 palavras, por contagem de palavras separadas por espaços. Os exemplos dos 26 padrões continuam no catálogo; a redução não mede tokens faturados.
