// 🎮 Retro Shooter Simplificado

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const menu = document.getElementById("menu");
const volumeSlider = document.getElementById("volumeSlider");

// 🚀 Estado do jogo
let gameState = {
  ship: { x: 100, y: 250, w: 80, h: 40, speed: 5 },
  bullets: [], enemies: [], stars: [],
  running: false, score: 0, lives: 3,
  weaponLevel: 1, phase: 0
};

// 🎶 Sons (só fase1 + tiro)
const sounds = {
  fase1: new Audio("fase1.wav"),
  shoot: new Audio("laser1.wav")
};
Object.values(sounds).forEach(m => { m.loop = true; m.volume = 0.5; });
sounds.shoot.loop = false; sounds.shoot.volume = 0.7;

// 🌌 Fundo estrelado
function initStars() {
  gameState.stars = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 2
  }));
}
function drawBackground() {
  ctx.fillStyle = "black"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  gameState.stars.forEach(s => {
    ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill();
    s.x -= s.speed; if (s.x < 0) { s.x = canvas.width; s.y = Math.random() * canvas.height; }
  });
}

// 🚀 Nave
const shipImg = new Image(); shipImg.src = "ship.png";
function drawShip() {
  if (shipImg.complete) ctx.drawImage(shipImg, gameState.ship.x, gameState.ship.y, gameState.ship.w, gameState.ship.h);
  else { ctx.fillStyle = "lime"; ctx.fillRect(gameState.ship.x, gameState.ship.y, gameState.ship.w, gameState.ship.h); }
}

// 🔫 Disparo
function shoot() {
  let s = gameState.ship;
  gameState.bullets.push({ x: s.x+s.w, y: s.y+s.h/2, w:5, h:2, speed:7 });
  sounds.shoot.currentTime = 0; sounds.shoot.play();
}

// 👾 Inimigos
function spawnEnemy() { gameState.enemies.push({ x: canvas.width, y: Math.random()*(canvas.height-20), w:30, h:30, speed:3 }); }

// 🔍 Colisão
const isColliding = (a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;

// 🎮 Atualização
function update() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBackground(); drawShip();

  // Balas
  gameState.bullets.forEach((b,i)=>{ b.x+=b.speed; ctx.fillStyle="yellow"; ctx.fillRect(b.x,b.y,b.w,b.h);
    gameState.enemies.forEach((e,j)=>{ if(isColliding(b,e)){ gameState.enemies.splice(j,1); gameState.bullets.splice(i,1); gameState.score+=100; }});
  });

  // Inimigos
  gameState.enemies.forEach((e,i)=>{ e.x-=e.speed; ctx.fillStyle="red"; ctx.fillRect(e.x,e.y,e.w,e.h);
    if(isColliding(gameState.ship,e)){ gameState.enemies.splice(i,1); gameState.lives--; }
    if(e.x+e.w<0) gameState.enemies.splice(i,1);
  });

  drawHUD();
}

// 🖥️ HUD
function drawHUD() {
  ctx.fillStyle="white"; ctx.font="16px 'Press Start 2P'";
  ctx.fillText(`Score: ${gameState.score}`,20,30);
  ctx.fillText(`Lives: ${gameState.lives}`,20,60);
}

// 🎵 Música
function stopMusic(){ Object.values(sounds).forEach(m=>{m.pause();m.currentTime=0;}); }
function playMusic(){ stopMusic(); sounds.fase1.play(); }

// 🚀 Iniciar jogo
startBtn.addEventListener("click", () => {
  menu.style.display = "none";
  canvas.style.display = "block";
  canvas.focus();
  gameState.running = true;
  gameState.phase = 1;
  initStars();
  playMusic();
  setInterval(spawnEnemy, 2000);
  startAutoShoot();
  loop();
});

// 🖱️ Nave segue o mouse
document.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  gameState.ship.x = mouseX - gameState.ship.w / 2;
  gameState.ship.y = mouseY - gameState.ship.h / 2;
});

// 🔫 Auto Shoot
let autoShoot;
function startAutoShoot() {
  autoShoot = setInterval(() => {
    if (gameState.running) shoot();
  }, 500);
}
function stopAutoShoot() { clearInterval(autoShoot); }

// 🎮 Loop
function loop() {
  if(gameState.running){ update(); requestAnimationFrame(loop); }
}
