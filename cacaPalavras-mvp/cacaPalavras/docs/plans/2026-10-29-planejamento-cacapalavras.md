# Plano de projeto — cacaPalavras

**Data:** 2026-10-29  
**Objetivo:** transformar as decisões do PRD em um MVP web funcional e documentado.

## Decisões confirmadas

- Mecânica híbrida: adivinhar palavra + caça-palavras.
- Idiomas: português brasileiro e inglês.
- Modo: desafio diário.
- Público: jogadores casuais.
- Funcionalidades: estatísticas, compartilhamento, offline/PWA e acessibilidade.
- Identidade visual: divertida e colorida.
- Stack: HTML, CSS e JavaScript nativos.

## Fases

### 1. Definição do produto
- [x] Registrar objetivos, escopo, regras, riscos e critérios de aceite em `PRD.md`.
- [x] Registrar arquitetura, estado, persistência e testes em `SPECS.md`.

### 2. Exploração de interface
- [x] Criar três protótipos HTML navegáveis com propostas visuais diferentes.
- [ ] Fazer avaliação com usuários reais e escolher direção visual final.

### 3. Implementação do MVP
- [x] Criar interface responsiva.
- [x] Implementar modo adivinhar e feedback por letra.
- [x] Implementar grade de caça-palavras.
- [x] Implementar alternância pt-BR/inglês.
- [x] Implementar estatísticas e compartilhamento.
- [x] Adicionar manifesto e service worker.
- [x] Documentar teste manual.

### 4. Validação
- [ ] Executar checklist manual em navegador desktop e móvel.
- [ ] Validar teclado, leitor de tela e contraste em ferramenta especializada.
- [ ] Testar instalação/offline em HTTPS ou `localhost`.
- [ ] Revisar vocabulário com falantes nativos.
- [ ] Realizar code review independente antes de produção.

## Riscos e mitigação

- **Vocabulário limitado:** o catálogo é deliberadamente pequeno no MVP; aumentar antes de lançamento.
- **Persistência local:** dados são específicos do navegador/dispositivo e podem ser apagados.
- **Offline:** não é ativado em `file://`; usar servidor local ou HTTPS.
- **Acessibilidade:** o código inclui bases semânticas, mas ainda precisa de teste real com tecnologias assistivas.
- **Repositório remoto:** os arquivos são preparados localmente; nenhum repositório GitHub remoto foi criado nesta entrega.

## Entregáveis

- `AGENTS.md`
- `PRD.md`
- `SPECS.md`
- três protótipos em `prototypes/`
- aplicação em HTML/CSS/JS
- manifesto e service worker
- `tests/TEST-PLAN.md`
