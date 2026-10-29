# PRD — cacaPalavras

**Status:** MVP planejado e implementado localmente  
**Versão:** 1.0  
**Data:** 2026-10-29  
**Plataforma:** Web responsiva, com suporte a instalação/offline como PWA  
**Público principal:** jogadores casuais  
**Idiomas de interface e conteúdo:** português brasileiro (pt-BR) e inglês (en)

## 1. Visão do produto

cacaPalavras é um jogo casual diário de palavras que combina duas mecânicas familiares: adivinhar uma palavra secreta com tentativas limitadas e encontrar palavras escondidas em uma grade. A experiência é curta, colorida, acessível e fácil de retomar, com um desafio diário, estatísticas locais e compartilhamento de resultados sem revelar respostas.

## 2. Problema e oportunidade

Jogos de palavras podem oferecer uma pausa curta e satisfatória, mas interfaces excessivamente complexas, dependência de conexão ou feedback que depende apenas de cores podem excluir jogadores. O produto reúne duas formas de jogar em uma única experiência, mantendo regras simples, instruções visíveis e suporte a teclado, leitores de tela e preferências de idioma.

## 3. Objetivos

- Oferecer uma experiência diária rápida, clara e divertida.
- Permitir que o jogador alterne entre adivinhação e caça-palavras no desafio do dia.
- Dar suporte a pt-BR e inglês.
- Guardar estatísticas no dispositivo, sem exigir cadastro.
- Permitir compartilhar um resumo que não exponha a solução.
- Continuar funcionando offline após a primeira visita bem-sucedida.
- Evitar que informação importante seja comunicada somente por cor.

## 4. Não objetivos do MVP

- Contas, autenticação, sincronização em nuvem ou ranking global.
- Monetização, anúncios ou compras.
- Editor de puzzles ou criação de desafios por usuários.
- Multiplayer, chat, torneios ou sistema social interno.
- Garantia de que todos os dispositivos terão o mesmo desafio se o relógio local estiver incorreto.
- Banco editorial extenso, geração automática de dificuldade ou análise comportamental.

## 5. Público e contexto de uso

Jogadores casuais, em computador, tablet ou celular, que desejam jogar por alguns minutos. A interface deve ser compreensível na primeira visita, sem tutorial obrigatório. A linguagem deve ser leve e acolhedora, sem penalizar erros.

## 6. Escopo funcional

### F-01 — Desafio diário
O produto apresenta o desafio associado à data local do dispositivo. A data e o estado do jogo são usados para que o jogador possa acompanhar sua sequência diária. O MVP inclui uma palavra-alvo por idioma e uma grade de caça-palavras determinística por dia.

### F-02 — Modo adivinhar
- Palavra de cinco letras, com até seis tentativas.
- Teclado na tela e entrada pelo teclado físico.
- Feedback por letra: posição correta, letra presente em outra posição e letra ausente.
- Feedback não depende exclusivamente de cor; cada estado tem símbolo/legenda acessível.
- Uma tentativa só é aceita se tiver cinco letras.
- A solução aparece após vitória ou esgotamento das tentativas.

### F-03 — Modo caça-palavras
- Grade de letras com palavras-alvo listadas ao lado/abaixo.
- O MVP permite selecionar a primeira e a última célula de uma palavra em linha reta, horizontal, vertical ou diagonal.
- Palavras encontradas são marcadas na grade e na lista.
- Há suporte a toque/clique; a experiência de seleção por teclado é uma melhoria planejada, não requisito bloqueante para o MVP.
- O jogo é concluído quando todas as palavras da lista são encontradas.

### F-04 — Idioma
Alternância entre pt-BR e inglês. Textos da interface, palavras-alvo, palavras da grade e lista de caça-palavras devem corresponder ao idioma selecionado. A preferência fica salva no dispositivo.

### F-05 — Estatísticas
Guardar localmente partidas concluídas, vitórias, taxa de vitória e sequência atual/máxima. Dados ficam no navegador via `localStorage`; limpar dados do navegador os remove.

### F-06 — Compartilhamento
Gerar um resumo textual com data, modo e resultado, sem a palavra secreta. Usar a API nativa de compartilhamento quando disponível; caso contrário, copiar para a área de transferência e exibir confirmação.

### F-07 — Offline / instalação
Manifesto e service worker permitem cache dos recursos essenciais depois da primeira visita online. A interface deve continuar carregando sem rede quando os recursos já estiverem em cache. Instalação depende do suporte do navegador/servidor.

### F-08 — Acessibilidade
- Estrutura semântica e regiões identificadas.
- Controles com rótulos claros, foco visível e navegação por teclado.
- Texto e instruções em linguagem simples.
- `aria-live` para feedback do jogo.
- Estados indicados por texto/símbolos além de cor.
- Respeitar `prefers-reduced-motion`.
- Alvo de contraste WCAG 2.2 AA (4,5:1 para texto normal, 3:1 para texto grande e componentes gráficos relevantes).

## 7. Regras e experiência

1. A tela inicial explica as duas mecânicas em uma frase.
2. O jogador escolhe “Adivinhar” ou “Caça-palavras”.
3. A data diária é apresentada sem exigir conta.
4. Cada modo mantém seu próprio estado de conclusão para o dia.
5. O jogador pode trocar o idioma; o puzzle reinicia no novo idioma, pois o vocabulário muda.
6. A conclusão mostra mensagem positiva, estatísticas relevantes e ação de compartilhar.
7. Em caso de armazenamento indisponível, o jogo ainda deve funcionar em memória durante a sessão.

## 8. Métricas de sucesso do MVP

- Um jogador novo consegue iniciar qualquer modo sem ajuda externa.
- O modo adivinhar valida palavras com cinco letras e encerra corretamente em vitória/derrota.
- O caça-palavras aceita seleção válida em oito direções e não conta palavras repetidas.
- Troca de idioma atualiza a interface e o conteúdo do jogo.
- Estatísticas sobrevivem a recarregamento no mesmo navegador.
- Compartilhamento nunca inclui a palavra secreta.
- Os arquivos essenciais são servidos pelo service worker após instalação do cache.

## 9. Requisitos não funcionais

- Sem framework ou dependência externa no MVP.
- Layout responsivo a partir de telas estreitas.
- Carregamento leve, sem fontes ou imagens remotas obrigatórias.
- Lógica de puzzle determinística por data, com catálogo local pequeno no MVP.
- Código separado em HTML, CSS e JavaScript legíveis.
- Sem coleta de dados pessoais ou telemetria.

## 10. Riscos e decisões

| Risco | Mitigação |
|---|---|
| Catálogo de palavras pequeno | Declarar claramente que é um MVP; ampliar e revisar vocabulário antes de produção. |
| Datas/relógio local alterados | Usar data local e documentar que não há validação de servidor. |
| Service worker não funciona em `file://` | Executar via `localhost` ou HTTPS. |
| Compatibilidade de compartilhamento varia | Fallback para cópia de texto. |
| Seleção por toque pode ser difícil | Alvos amplos, instruções claras e evolução futura para seleção acessível por teclado. |

## 11. Critérios de aceite

- [ ] A página apresenta os dois modos diários.
- [ ] É possível jogar e concluir o modo adivinhar.
- [ ] É possível encontrar todas as palavras no modo caça-palavras.
- [ ] pt-BR e inglês funcionam no conteúdo e na interface.
- [ ] Estatísticas e preferência de idioma são salvas localmente.
- [ ] O compartilhamento não revela a resposta.
- [ ] Manifesto e service worker estão presentes.
- [ ] Três protótipos navegáveis distintos estão em `prototypes/`.
- [ ] Documentação de produto e técnica está presente.
