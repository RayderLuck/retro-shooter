// 🎮 Retro Shooter Refatorado

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const menu = document.getElementById("menu");
const volumeSlider = document.getElementById("volumeSlider");

// 🚀 Estado do jogo centralizado
let gameState = {
  ship: { x: 100, y: 250, width: 80, height: 40, speed: 5 },
  bullets: [],
  enemies: [],
  powerUps: [],
  stars: [],
  running: false,
  score: 0,
  lives: 3,
  weaponLevel: 1,
  shieldActive: false,
  speedBoost: false,
  currentPhase: 0,
  ranking: JSON.parse(localStorage.getItem("ranking")) || []
};

// 🚀 Sprite da nave
let shipImg = new Image();
shipImg.src = "ship.png";

// 🎶 Músicas
let menuMusic = new Audio("menu.mp3");
let fase1Music = new Audio("fase1.mp3");
let fase2Music = new Audio("fase2.mp3");
let fase3Music = new Audio("fase3.mp3");
let fase4Music = new Audio("fase4.mp3");
[menuMusic, fase1Music, fase2Music, fase3Music, fase4Music].forEach(m => {
  m.loop = true;
  m.volume = 0.5;
});

// 🔫 Som do tiro
let shootSound = new Audio("laser1.wav");
shootSound.volume = 0.7;

// 🌌 Fundo animado
function initStars() {
  gameState.stars = [];
  for (let i = 0; i < 100; i++) {
    gameState.stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speed: Math.random() * 1.5 + 0.5
    });
  }
}

function drawBackground() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  gameState.stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    star.x -= star.speed;
    if (star.x < 0) {
      star.x = canvas.width;
      star.y = Math.random() * canvas.height;
    }
  });
}

// 🚀 Nave
function drawShip() {
  if (shipImg.complete) {
    ctx.drawImage(shipImg, gameState.ship.x, gameState.ship.y, gameState.ship.width, gameState.ship.height);
  } else {
    ctx.fillStyle = gameState.shieldActive ? "cyan" : "lime";
    ctx.fillRect(gameState.ship.x, gameState.ship.y, gameState.ship.width, gameState.ship.height);
  }
}

// 🔫 Disparo
function shoot() {
  let s = gameState.ship;
  if (gameState.weaponLevel === 1) {
    gameState.bullets.push({ x: s.x + s.width, y: s.y + s.height / 2, width: 5, height: 2, speed: 7 });
  } else if (gameState.weaponLevel === 2) {
    gameState.bullets.push({ x: s.x + s.width, y: s.y + 5, width: 5, height: 2, speed: 7 });
    gameState.bullets.push({ x: s.x + s.width, y: s.y + s.height - 5, width: 5, height: 2, speed: 7 });
  } else if (gameState.weaponLevel === 3) {
    gameState.bullets.push({ x: s.x + s.width, y: s.y, width: 5, height: 2, speed: 7 });
    gameState.bullets.push({ x: s.x + s.width, y: s.y + s.height / 2, width: 5, height: 2, speed: 7 });
    gameState.bullets.push({ x: s.x + s.width, y: s.y + s.height, width: 5, height: 2, speed: 7 });
  }
  shootSound.currentTime = 0;
  shootSound.play();
}

// 👾 Inimigos
function spawnEnemy() {
  let y = Math.random() * (canvas.height - 20);
  gameState.enemies.push({ x: canvas.width, y, width: 30, height: 30, speed: 3 });
}

// 🎁 Power-ups
function spawnPowerUp() {
  let y = Math.random() * (canvas.height - 20);
  let type = Math.floor(Math.random() * 3);
  let color = type === 0 ? "blue" : type === 1 ? "green" : "yellow";
  gameState.powerUps.push({ x: canvas.width, y, width: 20, height: 20, speed: 2, type, color });
}

// 💥 Explosão
function drawExplosion(x, y) {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();
}

// 🔍 Colisão genérica
function isColliding(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

// 🎮 Atualização
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawShip();

  // Balas
  gameState.bullets.forEach((b, bi) => {
    b.x += b.speed;
    ctx.fillStyle = "yellow";
    ctx.fillRect(b.x, b.y, b.width, b.height);
    gameState.enemies.forEach((e, ei) => {
      if (isColliding(b, e)) {
        drawExplosion(e.x, e.y);
        gameState.enemies.splice(ei, 1);
        gameState.bullets.splice(bi, 1);
        enemyDestroyed();
      }
    });
  });

  // Inimigos
  gameState.enemies.forEach((e, ei) => {
    e.x -= e.speed;
    ctx.fillStyle = "red";
    ctx.fillRect(e.x, e.y, e.width, e.height);
    if (!gameState.shieldActive && isColliding(gameState.ship, e)) {
      drawExplosion(gameState.ship.x + gameState.ship.width / 2, gameState.ship.y + gameState.ship.height / 2);
      gameState.enemies.splice(ei, 1);
      gameState.lives--;
      if (gameState.lives <= 0) endGame();
    }
    if (e.x + e.width < 0) gameState.enemies.splice(ei, 1);
  });

  // Power-ups
  gameState.powerUps.forEach((p, pi) => {
    p.x -= p.speed;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.width, p.height);
    if (isColliding(gameState.ship, p)) {
      if (p.type === 0) {
        gameState.weaponLevel = Math.min(3, gameState.weaponLevel + 1);
      } else if (p.type === 1) {
        gameState.shieldActive = true;
        setTimeout(() => gameState.shieldActive = false, 5000);
      } else if (p.type === 2) {
        gameState.speedBoost = true;
        gameState.ship.speed = 10;
        setTimeout(() => { gameState.speedBoost = false; gameState.ship.speed = 5; }, 5000);
      }
      gameState.powerUps.splice(pi, 1);
    }
    if (p.x + p.width < 0) gameState.powerUps.splice(pi, 1);
  });

  drawHUD();
}

// 🖥️ HUD
function drawHUD() {
  ctx.fillStyle = "white";
  ctx.font = "16px 'Press Start 2P'";
  ctx.fillText("Score: " + gameState.score, 20, 30);
  ctx.fillText("High Score: " + (gameState.ranking[0]?.score || 0), 20, 60);
  ctx.fillText("Lives: " + gameState.lives, 20, 90);
  ctx.fillText("Weapon Lvl: " + gameState.weaponLevel, 20, 120);
  ctx.fillText("Phase: " + gameState.currentPhase, 20, 150);
}
// 🏆 Pontuação
function enemyDestroyed() {
  gameState.score += 100;
  if (gameState.score >= 2000 && gameState.currentPhase === 1) playMusicForPhase(2);
  if (gameState.score >= 4000 && gameState.currentPhase === 2) playMusicForPhase(3);
  if (gameState.score >= 6000 && gameState.currentPhase === 3) playMusicForPhase(4);
}

// 🔚 Fim de jogo
function endGame() {
  gameState.running = false;
  stopAllMusic();
  menuMusic.play();
  let playerName = "Player";
  if (gameState.score > (gameState.ranking[0]?.score || 0)) {
    playerName = prompt("Novo recorde! Digite seu nome:");
  }
  gameState.ranking.push({ name: playerName, score: gameState.score });
  gameState.ranking.sort((a, b) => b.score - a.score);
  gameState.ranking = gameState.ranking.slice(0, 5);
  localStorage.setItem("ranking", JSON.stringify(gameState.ranking));

  // reset
  gameState.score = 0;
  gameState.lives = 3;
  gameState.weaponLevel = 1;
  showRanking();
}

// 📊 Ranking
function showRanking() {
  let rankingText = "TOP 5 SCORES:\n";
  gameState.ranking.forEach((entry, i) => {
    rankingText += (i + 1) + "º - " + entry.name + " : " + entry.score + "\n";
  });
  alert(rankingText);
}

// 🎵 Funções de música
function stopAllMusic() {
  [menuMusic, fase1Music, fase2Music, fase3Music, fase4Music].forEach(m => {
    m.pause();
    m.currentTime = 0;
  });
}

function playMusicForPhase(phase) {
  stopAllMusic();
  gameState.currentPhase = phase;
  if (phase === 0) menuMusic.play();
  if (phase === 1) fase1Music.play();
  if (phase === 2) fase2Music.play();
  if (phase === 3) fase3Music.play();
  if (phase === 4) fase4Music.play();
}

// 🔊 Controle de volume
volumeSlider.addEventListener("input", () => {
  let vol = volumeSlider.value / 100;
  [menuMusic, fase1Music, fase2Music, fase3Music, fase4Music].forEach(m => m.volume = vol);
  shootSound.volume = vol;
});

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Retro Shooter</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Menu principal -->
  <div id="menu">
    <h1>🚀 Retro Shooter</h1>
    <button id="startBtn">START</button>
    <button id="optionsBtn">OPÇÕES</button>
    <button id="aboutBtn">SOBRE</button>
    <!-- Controle de volume que o script.js espera -->
    <label for="volumeSlider">Volume:</label>
    <input type="range" id="volumeSlider" min="0" max="100" value="50">
  </div>

  <!-- Canvas do jogo -->
  <canvas id="gameCanvas" width="800" height="600" style="display:none;"></canvas>

  <!-- Script principal -->
  <script src="script.js"></script>
</body>
</html>
