const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const menu = document.getElementById("menu");

let ship = { x: 50, y: 250, width: 40, height: 20 };
let bullets = [];
let enemies = [];
let gameRunning = false;

// Pontuação, Ranking e Vidas
let score = 0;
let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
let lives = 3;

// 🚀 Desenha nave
function drawShip() {
  ctx.fillStyle = "lime";
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

// 🔫 Disparo automático
function shoot() {
  bullets.push({ x: ship.x + ship.width, y: ship.y + ship.height / 2, speed: 5 });
}

// 👾 Cria inimigos vindo da direita
function spawnEnemy() {
  let y = Math.random() * (canvas.height - 20);
  enemies.push({ x: canvas.width, y: y, width: 20, height: 20, speed: 3 });
}

// 💥 Explosão visual
function drawExplosion(x, y) {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();
}

// 🎮 Atualiza tela
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Nave
  drawShip();

  // Balas
  bullets.forEach((b, bi) => {
    b.x += b.speed;
    ctx.fillStyle = "yellow";
    ctx.fillRect(b.x, b.y, 5, 2);

    // Colisão com inimigos
    enemies.forEach((e, ei) => {
      if (b.x < e.x + e.width &&
          b.x + 5 > e.x &&
          b.y < e.y + e.height &&
          b.y + 2 > e.y) {
        drawExplosion(e.x, e.y);
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        enemyDestroyed();
      }
    });
  });

  // Inimigos
  enemies.forEach((e, ei) => {
    e.x -= e.speed;
    ctx.fillStyle = "red";
    ctx.fillRect(e.x, e.y, e.width, e.height);

    // Colisão com nave
    if (ship.x < e.x + e.width &&
        ship.x + ship.width > e.x &&
        ship.y < e.y + e.height &&
        ship.y + ship.height > e.y) {
      drawExplosion(ship.x + ship.width / 2, ship.y + ship.height / 2);
      enemies.splice(ei, 1);
      lives--;
      if (lives <= 0) {
        endGame(); // nave explode e fim de jogo
      }
    }

    // Remove inimigos fora da tela
    if (e.x + e.width < 0) {
      enemies.splice(ei, 1);
    }
  });

  drawHUD();
}

// 🖥️ HUD com Score, High Score e Vidas
function drawHUD() {
  ctx.fillStyle = "white";
  ctx.font = "16px 'Press Start 2P'";
  ctx.fillText("Score: " + score, 20, 30);
  ctx.fillText("High Score: " + (ranking[0] || 0), 20, 60);
  ctx.fillText("Lives: " + lives, 20, 90);
}

// 🏆 Quando inimigo é destruído
function enemyDestroyed() {
  score += 100;
}

// 🔚 Fim de jogo → salva ranking
function endGame() {
  gameRunning = false;
  ranking.push(score);
  ranking.sort((a, b) => b - a);
  ranking = ranking.slice(0, 5);
  localStorage.setItem("ranking", JSON.stringify(ranking));
  score = 0; // reinicia pontuação
  lives = 3; // reseta vidas
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
  score = 0;
  lives = 3;
  enemies = [];
  bullets = [];

  setInterval(() => {
    if (gameRunning) {
      shoot();
      update();
    }
  }, 100);

  setInterval(() => {
    if (gameRunning) {
      spawnEnemy();
    }
  }, 1500); // cria inimigo a cada 1,5s
}

// 🎯 Clique no botão
startBtn.addEventListener("click", startGame);

// 🎯 Pressionar Enter
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !gameRunning) {
    startGame();
  }
});
