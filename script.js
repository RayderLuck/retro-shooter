const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const menu = document.getElementById("menu");

let ship = { x: 50, y: 250, width: 40, height: 20 };
let bullets = [];
let gameRunning = false;

// Pontuação e Ranking
let score = 0;
let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

// 🚀 Desenha nave
function drawShip() {
  ctx.fillStyle = "lime";
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

// 🔫 Disparo automático
function shoot() {
  bullets.push({ x: ship.x + ship.width, y: ship.y + ship.height / 2, speed: 5 });
}

// 🎮 Atualiza tela
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShip();

  bullets.forEach(b => {
    b.x += b.speed;
    ctx.fillStyle = "yellow";
    ctx.fillRect(b.x, b.y, 5, 2);
  });

  drawHUD();
}

// 🖥️ HUD com Score e High Score
function drawHUD() {
  ctx.fillStyle = "white";
  ctx.font = "16px 'Press Start 2P'";
  ctx.fillText("Score: " + score, 20, 30);
  ctx.fillText("High Score: " + (ranking[0] || 0), 20, 60);
}

// 🏆 Quando inimigo é destruído (exemplo)
function enemyDestroyed() {
  score += 100; // cada inimigo vale 100 pontos
}

// 🔚 Fim de jogo → salva ranking
function endGame() {
  gameRunning = false;
  ranking.push(score);
  ranking.sort((a, b) => b - a); // ordena do maior pro menor
  ranking = ranking.slice(0, 5); // mantém só os 5 melhores
  localStorage.setItem("ranking", JSON.stringify(ranking));
  showRanking();
}

// 📊 Exibe ranking local
function showRanking() {
  let rankingText = "TOP 5 SCORES:\n";
  ranking.forEach((s, i) => {
    rankingText += (i + 1) + "º - " + s + "\n";
  });
  alert(rankingText);
}

// 🖱️ Nave segue o mouse
canvas.addEventListener("mousemove", (event) => {
  if (!gameRunning) return;
  const rect = canvas.getBoundingClientRect();
  const mouseY = event.clientY - rect.top;
  ship.y = Math.max(0, Math.min(mouseY - ship.height / 2, canvas.height - ship.height));
});

// 🚀 Função para iniciar o jogo
function startGame() {
  menu.style.display = "none";
  canvas.style.display = "block";
  gameRunning = true;
  score = 0; // zera pontuação ao iniciar

  setInterval(() => {
    if (gameRunning) {
      shoot();
      update();
    }
  }, 100);
}

// 🎯 Clique no botão
startBtn.addEventListener("click", startGame);

// 🎯 Pressionar Enter
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !gameRunning) {
    startGame();
  }
});
