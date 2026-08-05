# 🚀 Retro Shooter Arcade

Pequeno jogo retrô em pixel art inspirado nos clássicos de arcade, desenvolvido em HTML5 + JavaScript. O jogador controla uma nave espacial que dispara automaticamente contra ondas de inimigos. O projeto foi pensado para rodar liso em notebooks e PCs modestos e roda direto no navegador.

---

## 🎮 Características
* Nave em estilo 8-bit retrô.
* Sistema de tiros com níveis de upgrade.
* Tipos diferentes de disparo (Básico, Duplo, Triplo e Power-ups).
* Ondas progressivas de inimigos.
* Fundo estrelado dinâmico e animado integrado na renderização do Canvas.
* Ranking de pontuação salvo no navegador (localStorage).
* Tela de Game Over estilizada.
* Efeitos sonoros arcade (tiro, explosão, power-up, game over).
* Controles para Computador e Celular: mouse, teclado e joystick virtual otimizado para touch.

---

## 🛠️ Tecnologias
* **HTML5 (Canvas API)** — Renderização gráfica do jogo e fundo dinâmico.
* **CSS3** — Animações e estilo retrô arcade, responsividade e layout refinado para mobile.
* **JavaScript (Modular)** — Lógica da engine do jogo, gerenciadores de toque/joystick e movimentação.

---

## ▶️ Como jogar
1. Abra `index.html` no navegador ou visite a demo hospedada (ver seção GitHub Pages).
2. Digite seu nome no menu inicial (opcional).
3. Clique em **START** para começar.
4. **No PC:** Use o mouse para mover a nave ou as setas do teclado.
5. **No Celular:** Use o joystick virtual na parte inferior da tela para controlar a nave.
6. A nave dispara automaticamente — alinhe os tiros com os inimigos.
7. Colete power-ups para mudar o tipo de tiro ou aumentar a velocidade.
8. Sobreviva às ondas e chegue ao topo do ranking!

---

## 📌 Objetivo
Destruir todas as ondas de inimigos, desviar dos perigos e alcançar a maior pontuação possível. Mostre seu nome no TOP 5 do ranking local!

---

## 🚧 Status do Projeto
O projeto está em **constante evolução**. Novas melhorias de gameplay, inimigos, chefes e ajustes visuais podem ser adicionados a qualquer momento.

---

## 📦 Execução local
1. Clone o repositório:
   ```bash
   git clone https://github.com/RayderLuck/retro-shooter.git
   ```
2. Abra `index.html` no navegador (ou use um servidor local simples, ex.: `npx http-server` ou `python -m http.server 8000`).

---

## 🌐 Publicação (GitHub Pages)
Para publicar a demo no GitHub Pages:
1. Vá em Settings → Pages no repositório.
2. Selecione a branch (ex.: `main`) e a pasta `/ (root)` ou `/docs` conforme preferir.
3. Salve; o site ficará disponível em `https://RayderLuck.github.io/retro-shooter` se o repositório for público.

Observação: adicionei também um workflow de Actions (`.github/workflows/pages.yml`) com `workflow_dispatch` para que você possa publicar manualmente pela aba Actions sem precisar alterar as configurações do repositório.

---

## 🔧 Otimizações implementadas / recomendadas
* Renderização via canvas 2D para menor overhead.
* Uso de spritesheets para reduzir requests.
* Atualizar apenas o que mudou no loop de jogo (dirty rectangles / draw minimal).
* Evitar operações pesadas por frame (leituras do DOM; preferir canvas e dados em memória).
* Minificar JS/CSS e habilitar compressão (gzip / brotli) no servidor.
* Oferecer opção de qualidade baixa: menos inimigos, partículas desligadas e menor resolução interna do canvas.
* Usar object pooling para reduzir GC e alocações por frame.

---

## ✅ Checklist (sugestões para PRs e melhorias)
* Adicionar badge de licença e de GitHub Pages.
* Incluir GIF curto do gameplay no README.
* Criar arquivo LICENSE (ex.: MIT).
* Adicionar CONTRIBUTING.md e CODE_OF_CONDUCT.md se aceitar colaboradores.
* Testar em navegadores e em máquinas modestas (usar CPU throttling) e medir FPS.

---

## 🎵 Créditos
* Sons retrô de explosão, tiro e power-up.
* Fonte [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) (Google Fonts).

Feito com ❤️ por [RayderLuck](https://github.com/RayderLuck)

---

## Licença
(Adicione aqui a licença desejada, ex.: MIT)
