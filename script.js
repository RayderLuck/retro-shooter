const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const menu = document.getElementById("menu");

let ship = { x: 100, y: 250, width: 80, height: 40, speed: 5 };
let bullets = [];
let enemies = [];
let powerUps = [];
let gameRunning = false;

// Pontuação, Ranking e Vidas
let score = 0;
let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
let lives = 3;
let weaponLevel = 1;
let shieldActive = false;
let speedBoost = false;

// 🚀 Sprite da nave
let shipImg = new Image();
shipImg.src = "https://raw.githubusercontent.com/RayderLuck/retro-shooter/main/ship.png";

// 🎶 Música de fundo
let bgMusic = new Audio("https://raw.githubusercontent.com/RayderLuck/retro-shooter/main/fase1.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.5;

// 🔫 Som do tiro
let shootSound = new Audio("https://raw.githubusercontent.com/RayderLuck/retro-shooter/main/laser1.wav");
shootSound.volume = 0.7;

// 🚀 Nave
function drawShip() {
  if (shipImg.complete) {
    ctx.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
  } else {
    ctx.fillStyle = shieldActive ? "cyan" : "lime";
    ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
  }
}

// 🔫 Disparo com níveis
function shoot() {
  if (weaponLevel === 1) {
    bullets.push({ x: ship.x + ship.width, y: ship.y + ship.height / 2, speed: 7 });
  } else if (weaponLevel === 2) {
    bullets.push({ x: ship.x + ship.width, y: ship.y + 5, speed: 7 });
    bullets.push({ x: ship.x + ship.width, y: ship.y + ship.height - 5, speed: 7 });
  } else if (weaponLevel === 3) {
    bullets.push({ x: ship.x + ship.width, y: ship.y, speed: 7 });
    bullets.push({ x: ship.x + ship.width, y: ship.y + ship.height / 2, speed: 7 });
    bullets.push({ x: ship.x + ship.width, y: ship.y + ship.height, speed: 7 });
  }

  // 🔊 toca som do tiro sincronizado
  shootSound.currentTime = 0;
  shootSound.play();
}

// 👾 Inimigos
function spawnEnemy() {
  let y = Math.random() * (canvas.height - 20);
  enemies.push({ x: canvas.width, y: y, width: 30, height: 30, speed: 3 });
}

// 🎁 Power-ups
function spawnPowerUp() {
  let y = Math.random() * (canvas.height - 20);
  let type = Math.floor(Math.random() * 3);
  let color = type === 0 ? "blue" : type === 1 ? "green" : "yellow";
  powerUps.push({ x: canvas.width, y: y, width: 20, height: 20, speed: 2, type, color });
}

// 💥 Explosão
function drawExplosion(x, y) {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();
}

// 🎮 Atualização
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShip();

  // Balas
  bullets.forEach((b, bi) => {
    b.x += b.speed;
    ctx.fillStyle = "yellow";
    ctx.fillRect(b.x, b.y, 5, 2);

    enemies.forEach((e, ei) => {
      if (b.x < e.x + e.width && b.x + 5 > e.x && b.y < e.y + e.height && b.y + 2 > e.y) {
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

    if (!shieldActive &&
        ship.x < e.x + e.width &&
        ship.x + ship.width > e.x &&
        ship.y < e.y + e.height &&
        ship.y + ship.height > e.y) {
      drawExplosion(ship.x + ship.width / 2, ship.y + ship.height / 2);
      enemies.splice(ei, 1);
      lives--;
      if (lives <= 0) endGame();
    }

    if (e.x + e.width < 0) enemies.splice(ei, 1);
  });

  // Power-ups
  powerUps.forEach((p, pi) => {
    p.x -= p.speed;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.width, p.height);

    if (ship.x < p.x + p.width && ship.x + ship.width > p.x &&
        ship.y < p.y + p.height && ship.y + ship.height > p.y) {
      if (p.type === 0) {
        weaponLevel = Math.min(3, weaponLevel + 1);
      } else if (p.type === 1) {
        shieldActive = true;
        setTimeout(() => shieldActive = false, 5000);
      } else if (p.type === 2) {
        speedBoost = true;
        ship.speed = 10;
        setTimeout(() => { speedBoost = false; ship.speed = 5; }, 5000);
      }
      powerUps.splice(pi, 1);
    }

    if (p.x + p.width < 0) powerUps.splice(pi, 1);
  });

  drawHUD();
}

// 🖥️ HUD
function drawHUD() {
  ctx.fillStyle = "white";
  ctx.font = "16px 'Press Start 2P'";
  ctx.fillText("Score: " + score, 20, 30);
  ctx.fillText("High Score: " + (ranking[0]?.score || 0), 20, 60);
  ctx.fillText("Lives: " + lives, 20, 90);
  ctx.fillText("Weapon Lvl: " + weaponLevel, 20, 120);
}

// 🏆 Pontuação
function enemyDestroyed() {
  score += 100;
}

// 🔚 Fim de jogo
function endGame() {
  gameRunning = false;
  bgMusic.pause();
  bgMusic.currentTime = 0;

  let playerName = "Player";
  if (score > (ranking[0]?.score || 0)) {
    playerName = prompt("Novo recorde! Digite seu nome:");
  }
  ranking.push({ name: playerName, score: score });
  ranking.sort((a, b) => b.score - a.score);
  ranking = ranking.slice(0, 5);
  localStorage.setItem("ranking", JSON.stringify(ranking));
  score = 0;
  lives = 3;
  weaponLevel = 1;
  showRanking();
}

// 📊 Ranking
function showRanking() {
  let rankingText = "TOP 5 SCORES:\n";
  ranking.forEach((entry, i) => {
    rankingText += (i + 1) + "º - " + entry.name + " : " + entry.score + "\n";
  });
  alert(rankingText);
}

// 🖱️ Nave segue mouse
canvas.addEventListener("mousemove", (event) => {
  if (!gameRunning) return;
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  ship.x = Math.max(0, Math.min(mouseX - ship.width / 2, canvas.width - ship.width));
  ship.y = Math.max(0, Math.min(mouseY - ship.height / 2, canvas.height - ship.height));
});

// 🚀 Início do jogo
function startGame() {
  menu.style.display = "none";
  canvas.style.display = "block";
  gameRunning = true;
  score = 0;
  lives = 3;
  weaponLevel = 1;
  enemies = [];
  bullets = [];
  powerUps = [];

  // 🎶 toca música da fase
  bgMusic.play();

  setInterval(() => {
    if (gameRunning) {
      shoot();
      update();
    }
  }, 100);

  setInterval(() => {
    if (gameRunning) spawnEnemy();
  }, 1500);

  setInterval(() => {
    if (gameRunning) spawnPowerUp();
  }, 7000);
}

// 🎯 Botões
startBtn.addEventListener("click", startGame);

