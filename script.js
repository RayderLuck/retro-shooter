// 🎮 Retro Shooter v5.1 — Exploder Enemies + Animated Explosion

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const menu = document.getElementById("menu");
const volumeSlider = document.getElementById("volumeSlider");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const rankingBox = document.getElementById("ranking");

let gameState = {
  ship: { x: 100, y: 250, w: 80, h: 40, speed: 5 },
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

// 🚀 Nave (carregando ship.png)
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
  sounds.shoot.currentTime = 0; sounds.shoot.play();
}

// 👾 Inimigos e PowerUps
function spawnEnemy() {
  gameState.enemies.push({
    x: canvas.width,
    y: Math.random() * (canvas.height - 20),
    w: 30, h: 30, speed: 3,
    type: Math.random() < 0.3 ? "exploder" : "normal"
  });
}
function spawnPowerUp() {
  let type = Math.floor(Math.random()*3), colors=["blue","green","yellow"];
  gameState.powerUps.push({
    x: canvas.width,
    y: Math.random()*(canvas.height-20),
    w:20, h:20, speed:2,
    type: type,
    color: colors[type]
  });
}

// 💥 Explosão animada
function explode(x, y) {
  gameState.explosions.push({ x: x+15, y: y+15, r: 5, maxR: 30, alpha: 1 });
  sounds.boom.currentTime = 0; sounds.boom.play();
}
function drawExplosions() {
  gameState.explosions.forEach((ex, i) => {
    ctx.fillStyle = `rgba(255,165,0,${ex.alpha})`;
    ctx.beginPath();
    ctx.arc(ex.x, ex.y, ex.r, 0, Math.PI*2);
    ctx.fill();
    ex.r += 2; ex.alpha -= 0.05;
    if (ex.r >= ex.maxR || ex.alpha <= 0) gameState.explosions.splice(i,1);
  });
}

// 🔍 Colisão
const isColliding = (a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;

// 🎮 Atualização
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
        if (e.type === "exploder") explode(e.x, e.y);
        gameState.enemies.splice(j, 1); 
        gameState.bullets.splice(i, 1); 
        gameState.score += 100;
      }
    });
  }); 

  // Inimigos
  gameState.enemies.forEach((e, i) => { 
    e.x -= e.speed; 
    ctx.fillStyle = e.type === "exploder" ? "orange" : "red"; 
    ctx.fillRect(e.x, e.y, e.w, e.h);
    
    if (!gameState.shield && isColliding(gameState.ship, e)) {
      if (e.type === "exploder") explode(e.x, e.y);
      gameState.enemies.splice(i, 1); 
      gameState.lives--; 
      if (gameState.lives <= 0) { endGame(); }
    }
    if (e.x + e.w < 0) gameState.enemies.splice(i, 1); 
  });

  // PowerUps
  gameState.powerUps.forEach((p, i) => { 
    p.x -= p.speed; 
    ctx.fillStyle = p.color; 
    ctx.fillRect(p.x, p.y, p.w, p.h);
    
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
  ctx.font = "16px 'Press Start 2P'";
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

// 🔚 Game Over
function endGame(){
  gameState.running = false; 
  stopMusic(); 
  stopAutoShoot(); 
  saveScore();
  
  if (finalScore) finalScore.innerText = "Pontos: " + gameState.score;
  if (rankingBox) rankingBox.innerText = gameState.ranking.map((e,i)=>`${i+1}º - ${e.name}: ${e.score}`).join("\n");
  
  fade(menu, false); 
  fade(canvas, false); 
  fade(gameOverScreen, true);
  
  gameState.score = 0; 
  gameState.lives = 3; 
  gameState.weaponLevel = 1;
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
    fade(menu, false); 
    fade(canvas, true);
    canvas.focus(); 
    gameState.running = true; 
    initStars(); 
    playMusic();
    setInterval(spawnEnemy, 2000); 
    setInterval(spawnPowerUp, 10000);
    startAutoShoot(); 
    loop();
  });
}

updateRankingMenu();

// 🎵 Música
function stopMusic(){ Object.values(sounds).forEach(m=>{m.pause();m.currentTime=0;}); }
function playMusic(){ stopMusic(); sounds.fase1.play(); }

// 🔊 Volume
if (volumeSlider) {
  volumeSlider.addEventListener("input",()=>{ 
    let v = volumeSlider.value / 100; 
    Object.values(sounds).forEach(m => m.volume = v); 
  });
}

// 🖱️ Nave segue o mouse
document.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  gameState.ship.x = e.clientX - rect.left - gameState.ship.w/2;
  gameState.ship.y = e.clientY - rect.top - gameState.ship.h/2;
});

// ⏸️ Pausa com tecla P
document.addEventListener("keydown", e => { 
  if(e.key === "p"){ 
    gameState.running = !gameState.running; 
    if(gameState.running) loop(); 
  }
});

// 🔫 Auto Shoot
let autoShoot;
function startAutoShoot(){ autoShoot = setInterval(()=>{ if(gameState.running) shoot(); }, 500); }
function stopAutoShoot(){ clearInterval(autoShoot); }

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
  el.style.display = "block"; 
  el.style.opacity = show ? 0 : 1;
  let op = show ? 0 : 1, step = show ? 0.05 : -0.05;
  
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
