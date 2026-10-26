# Verificação da correção 1.3.1

## Escopo e protocolo

A correção trata da autorreferência do modelo em “até minha última atualização” e expressões próximas. Não muda a política de preservar alegações recebidas nem autoriza checagem factual implícita.

Os oito pedidos de `cases.json` são neutros: não dizem quais palavras preservar ou remover. Cinco agentes receberam a versão candidata e os oito pedidos, sem critérios ou resultados anteriores. Cada agente respondeu ao conjunto no mesmo contexto; os agentes eram separados. A inspeção das saídas conhece a versão utilizada e não representa avaliação cega ou teste com leitores.

## Critérios de conferência

| Caso | Conteúdo a preservar e comportamento esperado |
|---|---|
| misto | Retirar a autorreferência; manter os 11%, a atribuição, a investigação pendente, poucos registros, tempo passado e hipótese de origem familiar. |
| data | Manter março de 2023 como limite, 42 entidades e a impossibilidade de distinguir ativas de inativas. |
| explicito | Retirar a moldura de modelo; manter boletim de 2022, 58 atendimentos e possível duplicidade. |
| autora | Preservar a atualização real da pesquisadora, data, autoria, nove caixas e duas salas pendentes. |
| citacao | Preservar citação literal, nome de arquivo e URL. |
| ressalva | Manter possível desatualização, incerteza, limite causal, julho de 2021 e oito unidades. |
| presente | Retirar a autorreferência sem apresentar atendimento e taxa como confirmação atual; manter R$ 25 e a falta de confirmação com seu alcance. |
| json | Preservar esquema, comando, URL, limite de 2020, seis registros e hipótese de autoria coletiva. |

Os números de execução descrevem observações nestes casos e não uma taxa geral de sucesso. Verifique sentido e atribuições, sem exigir uma redação única.

## Observações e resultados em 26 de outubro de 2026

O caso misto já havia mantido a expressão na versão 1.3.0 em duas execuções da comparação com a Humanizer original. Esses registros foram preservados em `results/baseline-ptbr-1.json` e `results/baseline-ptbr-2.json`.

Uma primeira rodada da correção removeu a expressão nos cinco casos mistos, mas mostrou a necessidade de explicitar o alcance de “até” nas datas e separar avisos do modelo de ressalvas dos dados. Depois desse refinamento, `results/run-1.json` a `run-5.json` registram cinco execuções dos oito casos, com estes resultados:

| Caso ou grupo | Resultado observado |
|---|---|
| misto | 5/5 retiraram a autorreferência e mantiveram percentual, atribuição, investigação pendente, passado e hipótese. |
| data e json | 5/5 preservaram os limites de março de 2023 e de 2020 com “até”, além dos números e ressalvas. |
| explicito | 5/5 retiraram o aviso de modelo e mantiveram os dados do boletim e a possibilidade de duplicidades. |
| autora, citacao e ressalva | 5/5 preservaram os conteúdos legítimos, a voz humana, a citação, os literais e as limitações dos dados. |
| presente, antes do ajuste final de escopo | As cinco saídas evitaram afirmar validade atual; três ampliaram “não tenho confirmação” para “não há confirmação”. A revisão independente identificou esse problema de alcance. |

A regra recebeu então uma distinção explícita: a falta de confirmação fica restrita à pessoa ou às informações mencionadas. Cinco agentes novos receberam somente o caso `presente`. Os arquivos `results/presente-1.json` a `presente-5.json` registram o novo teste: 5/5 mantiveram o recorte passado e a taxa, limitando a falta de confirmação às informações disponíveis.

O ajuste final foi seguido apenas desse teste dirigido, não da repetição dos outros sete casos. As respostas anteriores foram preservadas; não se apagou o resultado que motivou a correção de escopo. A variação entre formulações neutras como “à época” e “até então” foi aceita quando não inventava data ou validade atual.

A bateria registrada contém 40 respostas de oito casos e cinco respostas do teste dirigido, além dos dois registros anteriores. A primeira rodada exploratória é descrita acima; seus arquivos de trabalho não fazem parte deste pacote. Os JSONs externos e os valores JSON internos foram lidos e conferidos. As referências de data dos exemplos da skill diferem das entradas de teste.

## Limites

A conferência editorial soube qual versão produziu as respostas. Cada agente recebeu seu conjunto de pedidos no mesmo contexto. As cinco execuções não representam leitores humanos, nem demonstram uma taxa geral de confiabilidade. O teste dirigido reduz a incerteza sobre a falha observada, sem provar todos os contextos de autorreferência ou recorte temporal.
