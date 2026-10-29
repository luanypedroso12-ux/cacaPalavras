# SPECS — Especificação técnica do cacaPalavras

**Versão:** 1.0 · **Data:** 2026-10-29

## 1. Arquitetura

Aplicação estática sem build step: `index.html`, `styles.css`, `app.js`, `manifest.webmanifest` e `sw.js`. Não há servidor de aplicação, banco de dados, conta ou dependência de terceiros. O navegador executa toda a lógica.

```text
Browser
 ├── index.html (estrutura semântica)
 ├── styles.css (tema responsivo e acessibilidade)
 ├── app.js (estado, puzzles, regras, estatísticas, i18n)
 ├── manifest.webmanifest (metadados PWA)
 └── sw.js (cache dos recursos estáticos)
```

## 2. Organização de diretórios

- `index.html`: entrada da aplicação.
- `styles.css`: design system, layout, estados do tabuleiro e responsividade.
- `app.js`: estado e regras dos dois modos.
- `manifest.webmanifest`: nome, cores e modo de exibição.
- `sw.js`: cache de shell.
- `prototypes/prototype-a.html`: conceito “Candy Pop”.
- `prototypes/prototype-b.html`: conceito “Arcade Cards”.
- `prototypes/prototype-c.html`: conceito “Sunny Notebook”.
- `docs/plans/2026-10-29-planejamento-cacapalavras.md`: plano de execução.
- `tests/`: checklist manual de regressão.

## 3. Modelo de dados

### Estado de sessão
`currentMode`, `language`, `guess`, `attempts`, `selectedStart`, `foundWords`, `selectedCells`, `gameStatus`.

### Persistência local
- `cp_language`: `pt` ou `en`.
- `cp_stats`: objeto JSON com `played`, `won`, `currentStreak`, `maxStreak`, `lastPlayed`, `guessWins`.
- `cp_daily_<date>_<language>_<mode>`: estado resumido do puzzle diário concluído.

A persistência é best-effort. Se `localStorage` falhar, o jogo continua na sessão.

## 4. Lógica de puzzles

### Adivinhar
- Palavras de cinco letras são armazenadas por idioma em um catálogo local.
- Escolha determinística por índice derivado do dia do ano, para que o mesmo dia/idioma produza o mesmo puzzle no catálogo.
- O comparador devolve `correct`, `present` ou `absent`, respeitando letras repetidas: primeiro marca correspondências exatas, depois consome apenas as ocorrências restantes.
- Máximo de seis tentativas.
- A entrada aceita letras A–Z e caracteres acentuados do alfabeto do idioma; normalização para comparação remove diacríticos, mantendo a exibição original.

### Caça-palavras
- Palavras são posicionadas numa grade 10×10, em oito direções.
- O gerador tenta posicionar cada palavra sem sobrescrever letras conflitantes; células vazias são preenchidas com letras do alfabeto do idioma.
- A seleção de células determina vetor direção e valida se a sequência forma uma palavra-alvo. A seleção invertida também é aceita.
- Uma palavra encontrada não pode ser pontuada novamente.
- A grade do dia é determinística no MVP.

## 5. Internacionalização

Dicionário de strings em `app.js` com `pt` e `en`. O idioma controla navegação, instruções, feedback e conteúdo do puzzle. A escolha fica persistida localmente.

## 6. Acessibilidade

- Botões nativos com nome acessível.
- Região `aria-live="polite"` para mensagens.
- Foco visível e estados de tabuleiro identificados textualmente.
- A cor não é o único indicador: tiles de adivinhação mostram `✓`, `•` e `×`, com `aria-label`.
- A interface suporta redução de movimento.
- Revisão manual com teclado e leitor de tela continua necessária antes de publicação.

## 7. PWA e cache

O service worker pré-cacheia a página, CSS, JS e manifesto. A estratégia é cache-first para recursos locais e fallback de navegação para `index.html`. Service workers exigem `localhost` ou HTTPS; abrir diretamente por `file://` não ativa offline/PWA.

## 8. Segurança e privacidade

- Nenhuma requisição externa.
- Nenhum dado pessoal solicitado.
- Estatísticas somente no armazenamento local do navegador.
- Texto compartilhado contém apenas resultado e metadados, nunca a resposta.
- O conteúdo do `localStorage` pode ser apagado pelo usuário.

## 9. Testes

Consulte `tests/TEST-PLAN.md`. O MVP deve ser validado em Chrome/Firefox/Safari atuais, em viewport móvel e desktop. Não há pipeline automatizado configurado nesta entrega.

## 10. Melhorias recomendadas antes de produção

1. Aumentar e revisar o catálogo de palavras com validação editorial nativa.
2. Implementar seleção completa do caça-palavras por teclado (início/fim de célula).
3. Criar testes unitários para comparação de letras repetidas, gerador da grade, datas e estatísticas.
4. Verificar acessibilidade com leitor de tela e ferramentas automatizadas.
5. Adicionar ícones PWA em tamanhos exigidos pelos navegadores.
6. Definir política de fuso horário e calendário do desafio diário.
7. Separar catálogo de puzzles do código para facilitar manutenção e tradução.
