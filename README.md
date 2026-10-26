# Humanizer em português brasileiro

Skill para revisar prosa em português brasileiro, preservar a voz do autor e criar variações de escrita conforme o gênero e o leitor.

A versão 1.3.0 parte da [Humanizer 3.1.0, de Siqi Chen](https://github.com/blader/humanizer), e incorpora 23 referências de redação, linguagem simples, literatura e estudos do texto. A adaptação é mantida por [Geovani Ariel](https://github.com/geovani-ariel).

## O que ela faz

- Revê clichês, linguagem inflada, redundâncias e resíduos de chatbot.
- Preserva fatos, condições, grau de certeza e elementos técnicos.
- Mantém travessões, gerúndios, repetições e fragmentos quando cumprem uma função no texto.
- Orienta escolhas de perspectiva, ritmo, composição e relação com o leitor.
- Distingue revisão, variação de voz e criação a partir de um briefing.

A skill não determina se um texto foi escrito por IA. As listas de expressões são heurísticas editoriais, sem poder diagnóstico demonstrado. A literatura amplia as possibilidades de escrita; não define um estilo único a ser aplicado a todos os textos.

## Instalação

Clone este repositório:

```sh
git clone https://github.com/geovani-ariel/humanizer-pt-br.git
```

Coloque a pasta `humanizer-pt-br` no diretório de skills aceito pelo seu agente. Mantenha `SKILL.md` e a pasta `references` juntos: as instruções apontam para os arquivos de referência por caminhos relativos.

Se o agente permitir indicar uma skill por arquivo, você também pode apontar diretamente para `humanizer-pt-br/SKILL.md`.

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
| [LICENSE](LICENSE) | Licença MIT e avisos de autoria. |

## Validação e limites

O [protocolo 1.3.0](tests/README.md) compara cinco execuções por condição em três pedidos neutros: sem a skill, com a 1.2.0 e com a 1.3.0. Oito pedidos adicionais verificam a integração. As saídas e os limites da avaliação ficam no diretório de testes.

Para conferir a integridade do pacote, execute:

```sh
python3 tests/check_package.py
```

Essa verificação mecânica não julga a qualidade dos textos. Não houve pesquisa com leitores nem medição de preferência estética. Algumas referências têm acesso parcial, registrado na fundamentação. Os testes com modelos não comprovam superioridade literária.

## Contribuições

Sugestões e correções são bem-vindas em issues e pull requests. Para alterar uma regra, descreva o problema e inclua um exemplo com o resultado esperado. Ao acrescentar uma referência, informe o que ela sustenta e seus limites. Não inclua dados pessoais ou confidenciais nos exemplos.

## Origem e licença

Adaptação independente da [Humanizer](https://github.com/blader/humanizer), sob [licença MIT](LICENSE). O aviso de copyright de Siqi Chen foi preservado, com um aviso adicional para a adaptação em português brasileiro.

A Humanizer original atribui sua base à página [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), da Wikipédia. As fontes brasileiras foram usadas para fundamentar, corrigir ou ampliar orientações específicas.

Os textos e estudos citados conservam seus próprios direitos e licenças. Suas obras não são distribuídas neste repositório; os links e comentários de leitura não implicam endosso dos autores à skill.
