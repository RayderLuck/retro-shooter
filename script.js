// 🎮 Retro Shooter v5.3.2 — Correção de Inimigos e Power-Ups

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const menu = document.getElementById("menu");
const volumeSlider = document.getElementById("volumeSlider");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const rankingBox = document.getElementById("ranking");

let gameState = {
  ship: { x: 100, y: 250, w: 60, h: 30, speed: 5 },
  bullets: [], enemies: [], powerUps: [], stars: [], explosions: [],
  running: false, score: 0, lives: 3,
  weaponLevel: 1, shield: false, boost: false,
  ranking: []
};

// 🎶 Sons
const sounds = { fase1: new Audio("fase1.wav"), shoot: new Audio("laser1.wav"), boom: new Audio("explosion.wav") };
Object.values(sounds).forEach(m => { m.loop = true; m.volume = 0.5; });
sounds.shoot.loop = false; sounds.shoot.volume = 0.7;
sounds.boom.loop = false; sounds.boom.volume = 0.8;

// 📱 Ajustar o tamanho do Canvas
function resizeCanvas() {
  const maxWidth = window.innerWidth * 0.95;
  const maxHeight = window.innerHeight * 0.85;
  let w = maxWidth;
  let h = w * (500 / 800);
  if (h > maxHeight) {
    h = maxHeight;
    w = h * (800 / 500);
  }
  canvas.width = 800;
  canvas.height = 500;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);
resizeCanvas();

// 🌌 Fundo estrelado
function initStars() {
  gameState.stars = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    size: Math.random() * 2, speed: Math.random() * 2
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
const shipImg = new Image(); 
shipImg.src = "ship.png";

function drawShip() {
  if (shipImg.complete && shipImg.naturalWidth > 0) {
    ctx.drawImage(shipImg, gameState.ship.x, gameState.ship.y, gameState.ship.w, gameState.ship.h);
  } else { 
    ctx.fillStyle = gameState.shield ? "cyan" : "lime"; 
    ctx.fillRect(gameState.ship.x, gameState.ship.y, gameState.ship.w, gameState.ship.h); 
  }
}

// 🔫 Disparo
function shoot() {
  let s = gameState.ship, y = [s.h/2];
  if (gameState.weaponLevel > 1) y = [5, s.h-5];
  if (gameState.weaponLevel > 2) y = [0, s.h/2, s.h];
  y.forEach(pos => gameState.bullets.push({ x: s.x+s.w, y: s.y+pos, w:5, h:2, speed:7 }));
  sounds.shoot.currentTime = 0; sounds.shoot.play().catch(() => {});
}

// 👾 Inimigos (Agora TODOS explodem ao morrer)
function spawnEnemy() {
  if (!gameState.running) return;
  gameState.enemies.push({
    x: canvas.width,
    y: Math.random() * (canvas.height - 30),
    w: 30, h: 30, speed: 3,
    color: Math.random() < 0.5 ? "red" : "orange" // Inimigos vermelhos ou laranjas
  });
}

// 🪙 PowerUps (Visíveis e brilhantes como moedas/itens)
function spawnPowerUp() {
  if (!gameState.running) return;
  let type = Math.floor(Math.random() * 3);
  // Cores mais chamativas: Azul (Arma), Verde (Escudo), Dourado/Amarelo (Boost)
  let colors = ["#00ffff", "#00ff00", "#ffd700"]; 
  gameState.powerUps.push({
    x: canvas.width,
    y: Math.random() * (canvas.height - 25),
    w: 25, h: 25, speed: 2,
    type: type,
    color: colors[type]
  });
}

// 💥 Explosão animada
function explode(x, y) {
  gameState.explosions.push({ x: x + 15, y: y + 15, r: 5, maxR: 35, alpha: 1 });
  sounds.boom.currentTime = 0; sounds.boom.play().catch(() => {});
}
function drawExplosions() {
  gameState.explosions.forEach((ex, i) => {
    ctx.fillStyle = `rgba(255, 140, 0, ${ex.alpha})`;
    ctx.beginPath();
    ctx.arc(ex.x, ex.y, ex.r, 0, Math.PI * 2);
    ctx.fill();
    ex.r += 2; ex.alpha -= 0.05;
    if (ex.r >= ex.maxR || ex.alpha <= 0) gameState.explosions.splice(i, 1);
  });
}

// 🔍 Colisão
const isColliding = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

// 🎮 Atualização principal do Jogo
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(); 
  drawShip();

  // Balas
  gameState.bullets.forEach((b, i) => { 
    b.x += b.speed; 
    ctx.fillStyle = "yellow"; 
    ctx.fillRect(b.x, b.y, b.w, b.h);
    
    gameState.enemies.forEach((e, j) => { 
      if (isColliding(b, e)) {
        explode(e.x, e.y); // Todos explodem ao levar tiro!
        gameState.enemies.splice(j, 1); 
        gameState.bullets.splice(i, 1); 
        gameState.score += 100;
      }
    });
  }); 

  // Inimigos
  gameState.enemies.forEach((e, i) => { 
    e.x -= e.speed; 
    ctx.fillStyle = e.color; 
    ctx.fillRect(e.x, e.y, e.w, e.h);
    
    if (!gameState.shield && isColliding(gameState.ship, e)) {
      explode(e.x, e.y);
      gameState.enemies.splice(i, 1); 
      gameState.lives--; 
      if (gameState.lives <= 0) { endGame(); }
    }
    if (e.x + e.w < 0) gameState.enemies.splice(i, 1); 
  });

  // PowerUps (Desenhados com destaque)
  gameState.powerUps.forEach((p, i) => { 
    p.x -= p.speed; 
    ctx.fillStyle = p.color; 
    ctx.fillRect(p.x, p.y, p.w, p.h);
    
    // Borda brilhante no item para facilitar a visualização
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(p.x, p.y, p.w, p.h);
    
    if (isColliding(gameState.ship, p)) { 
      if (p.type === 0) gameState.weaponLevel = Math.min(3, gameState.weaponLevel + 1);
      if (p.type === 1) { gameState.shield = true; setTimeout(() => gameState.shield = false, 5000); }
      if (p.type === 2) { gameState.boost = true; gameState.ship.speed = 10; setTimeout(() => { gameState.boost = false; gameState.ship.speed = 5; }, 5000); }
      gameState.powerUps.splice(i, 1); 
    }
    if (p.x + p.w < 0) gameState.powerUps.splice(i, 1); 
  });

  drawExplosions();
  drawHUD();
}

// 🖥️ HUD
function drawHUD() {
  ctx.fillStyle = "white"; 
  ctx.font = "16px sans-serif";
  ctx.fillText(`Pontos: ${gameState.score}`, 20, 30);
  ctx.fillText(`Vidas: ${gameState.lives}`, 20, 60);
  ctx.fillText(`Arma: ${gameState.weaponLevel}`, 20, 90);
}

// 🏆 Score e Ranking
function saveScore(){
  let ranking = JSON.parse(localStorage.getItem("ranking"));
  if(!Array.isArray(ranking)) ranking = [];
  let nameField = document.getElementById("playerName");
  let name = nameField && nameField.value.trim() !== "" ? nameField.value.trim() : "Jogador";
  ranking.push({ name: String(name), score: Number(gameState.score) });
  ranking.sort((a,b)=>b.score-a.score);
  ranking = ranking.slice(0,5);
  localStorage.setItem("ranking", JSON.stringify(ranking));
  gameState.ranking = ranking;
}

function updateRankingMenu(){
  let ranking = JSON.parse(localStorage.getItem("ranking"));
  if(!Array.isArray(ranking)) ranking = [];
  let rankingList = document.getElementById("rankingList");
  if (rankingList) {
    rankingList.innerText = ranking.length ? ranking.map((e,i)=>`${i+1}º - ${e.name}: ${e.score}`).join("\n") : "Nenhum placar salvo ainda";
  }
}

let enemyInterval, powerUpInterval, autoShootInterval;

// 🔚 Game Over
function endGame(){
  gameState.running = false; 
  stopMusic(); 
  stopIntervals();
  saveScore();
  
  if (finalScore) finalScore.innerText = "Pontos: " + gameState.score;
  if (rankingBox) rankingBox.innerText = gameState.ranking.map((e,i)=>`${i+1}º - ${e.name}: ${e.score}`).join("\n");
  
  fade(menu, false); 
  fade(canvas, false); 
  fade(gameOverScreen, true);
}

function restartGame(){ 
  fade(gameOverScreen, false); 
  fade(menu, true); 
  updateRankingMenu(); 
}

// 🚀 Iniciar jogo
if (startBtn) {
  startBtn.addEventListener("click", () => {
    let nameField = document.getElementById("playerName");
    if(!nameField || !nameField.value.trim()){ 
      alert("Digite seu nome antes de começar!"); 
      return; 
    }
    
    gameState.score = 0; 
    gameState.lives = 3; 
    gameState.weaponLevel = 1;
    gameState.enemies = [];
    gameState.bullets = [];
    gameState.powerUps = [];
    gameState.explosions = [];

    fade(menu, false); 
    fade(canvas, true);
    canvas.focus(); 
    
    gameState.running = true; 
    initStars(); 
    playMusic();
    
    enemyInterval = setInterval(spawnEnemy, 2000); 
    powerUpInterval = setInterval(spawnPowerUp, 10000);
    startAutoShoot(); 
    
    loop();
  });
}

updateRankingMenu();

// 🎵 Música
function stopMusic(){ Object.values(sounds).forEach(m=>{m.pause();m.currentTime=0;}); }
function playMusic(){ stopMusic(); sounds.fase1.play().catch(() => {}); }

// 🔊 Volume
if (volumeSlider) {
  volumeSlider.addEventListener("input",()=>{ 
    let v = volumeSlider.value / 100; 
    Object.values(sounds).forEach(m => m.volume = v); 
  });
}

// 🖱️ Controles por Mouse
document.addEventListener("mousemove", e => {
  if (!gameState.running) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  gameState.ship.x = (e.clientX - rect.left) * scaleX - gameState.ship.w/2;
  gameState.ship.y = (e.clientY - rect.top) * scaleY - gameState.ship.h/2;
});

// 📱 Controles por Touch
function handleTouch(e) {
  if (!gameState.running) return;
  e.preventDefault(); 
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0]; 
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  gameState.ship.x = (touch.clientX - rect.left) * scaleX - gameState.ship.w/2;
  gameState.ship.y = (touch.clientY - rect.top) * scaleY - gameState.ship.h/2;
}

canvas.addEventListener("touchstart", handleTouch, { passive: false });
canvas.addEventListener("touchmove", handleTouch, { passive: false });

// ⏸️ Pausa com tecla P
document.addEventListener("keydown", e => { 
  if(e.key.toLowerCase() === "p" && canvas.style.display !== "none"){ 
    gameState.running = !gameState.running; 
    if(gameState.running) loop(); 
  }
});

// 🔫 Auto Shoot
function startAutoShoot(){ 
  autoShootInterval = setInterval(()=>{ if(gameState.running) shoot(); }, 500); 
}
function stopIntervals(){ 
  clearInterval(enemyInterval);
  clearInterval(powerUpInterval);
  clearInterval(autoShootInterval);
}

// 🎮 Loop
function loop(){ 
  if(gameState.running){ 
    update(); 
    requestAnimationFrame(loop); 
  }
}

// ✨ Fade-in/Fade-out
function fade(el, show){
  if(!el) return;
  if(show) el.style.display = "block";
  
  let op = show ? 0 : 1;
  el.style.opacity = op;
  let step = show ? 0.05 : -0.05;
  
  function anim(){
    op += step; 
    el.style.opacity = op;
    if((show && op >= 1) || (!show && op <= 0)){
      if(!show) el.style.display = "none"; 
      return;
    }
    requestAnimationFrame(anim);
  }
  anim();
}
