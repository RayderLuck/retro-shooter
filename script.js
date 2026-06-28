// 🎮 Retro Shooter Completo com Mouse + Auto Shoot

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const menu = document.getElementById("menu");
const volumeSlider = document.getElementById("volumeSlider");

// 🚀 Estado do jogo
let gameState = {
  ship: { x: 100, y: 250, w: 80, h: 40, speed: 5 },
  bullets: [], enemies: [], powerUps: [], stars: [],
  running: false, score: 0, lives: 3,
  weaponLevel: 1, shield: false, boost: false,
  phase: 0, ranking: JSON.parse(localStorage.getItem("ranking")) || []
};

// 🎶 Sons
const sounds = {
  menu: new Audio("menu.wav"),
  fase1: new Audio("fase1.wav"),
  fase2: new Audio("fase2.wav"),
  fase3: new Audio("fase3.wav"),
  fase4: new Audio("fase4.wav"),
  ending: new Audio("Ending.wav"),
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
  else { ctx.fillStyle = gameState.shield ? "cyan" : "lime"; ctx.fillRect(gameState.ship.x, gameState.ship.y, gameState.ship.w, gameState.ship.h); }
}

// 🔫 Disparo
function shoot() {
  let s = gameState.ship, b = gameState.bullets;
  let y = [s.h/2]; if (gameState.weaponLevel > 1) y = [5, s.h-5]; if (gameState.weaponLevel > 2) y = [0, s.h/2, s.h];
  y.forEach(pos => b.push({ x: s.x+s.w, y: s.y+pos, w:5, h:2, speed:7 }));
  sounds.shoot.currentTime = 0; sounds.shoot.play();
}

// 👾 Inimigos e PowerUps
function spawnEnemy() { gameState.enemies.push({ x: canvas.width, y: Math.random()*(canvas.height-20), w:30, h:30, speed:3 }); }
function spawnPowerUp() {
  let type = Math.floor(Math.random()*3), colors=["blue","green","yellow"];
  gameState.powerUps.push({ x: canvas.width, y: Math.random()*(canvas.height-20), w:20, h:20, speed:2, type, color:colors[type] });
}

// 🔍 Colisão
const isColliding = (a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;

// 🎮 Atualização
function update() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBackground(); drawShip();

  // Balas
  gameState.bullets.forEach((b,i)=>{ b.x+=b.speed; ctx.fillStyle="yellow"; ctx.fillRect(b.x,b.y,b.w,b.h);
    gameState.enemies.forEach((e,j)=>{ if(isColliding(b,e)){ gameState.enemies.splice(j,1); gameState.bullets.splice(i,1); enemyDestroyed(); }});
  });

  // Inimigos
  gameState.enemies.forEach((e,i)=>{ e.x-=e.speed; ctx.fillStyle="red"; ctx.fillRect(e.x,e.y,e.w,e.h);
    if(!gameState.shield && isColliding(gameState.ship,e)){ gameState.enemies.splice(i,1); gameState.lives--; if(gameState.lives<=0) endGame(); }
    if(e.x+e.w<0) gameState.enemies.splice(i,1);
  });

  // PowerUps
  gameState.powerUps.forEach((p,i)=>{ p.x-=p.speed; ctx.fillStyle=p.color; ctx.fillRect(p.x,p.y,p.w,p.h);
    if(isColliding(gameState.ship,p)){ if(p.type===0) gameState.weaponLevel=Math.min(3,gameState.weaponLevel+1);
      if(p.type===1){ gameState.shield=true; setTimeout(()=>gameState.shield=false,5000); }
      if(p.type===2){ gameState.boost=true; gameState.ship.speed=10; setTimeout(()=>{gameState.boost=false; gameState.ship.speed=5;},5000); }
      gameState.powerUps.splice(i,1); }
    if(p.x+p.w<0) gameState.powerUps.splice(i,1);
  });

  drawHUD();
}

// 🖥️ HUD
function drawHUD() {
  ctx.fillStyle="white"; ctx.font="16px 'Press Start 2P'";
  ctx.fillText(`Score: ${gameState.score}`,20,30);
  ctx.fillText(`High: ${gameState.ranking[0]?.score||0}`,20,60);
  ctx.fillText(`Lives: ${gameState.lives}`,20,90);
  ctx.fillText(`Weapon: ${gameState.weaponLevel}`,20,120);
  ctx.fillText(`Phase: ${gameState.phase}`,20,150);
}

// 🏆 Pontuação
function enemyDestroyed(){ gameState.score+=100; }

// 🔚 Fim de jogo
function endGame(){
  gameState.running=false; stopMusic(); sounds.menu.play();
  stopAutoShoot();
  let name="Player"; if(gameState.score>(gameState.ranking[0]?.score||0)) name=prompt("Novo recorde! Nome:");
  gameState.ranking.push({name,score:gameState.score}); gameState.ranking.sort((a,b)=>b.score-a.score); gameState.ranking=gameState.ranking.slice(0,5);
  localStorage.setItem("ranking",JSON.stringify(gameState.ranking));
  gameState.score=0; gameState.lives=3; gameState.weaponLevel=1;
  alert("TOP 5:\n"+gameState.ranking.map((e,i)=>`${i+1}º - ${e.name}: ${e.score}`).join("\n"));
}

// 🎵 Música
function stopMusic(){ Object.values(sounds).forEach(m=>{m.pause();m.currentTime=0;}); }
function playMusic(p){ 
  stopMusic(); 
  gameState.phase=p; 
  if(p===0) sounds.menu.play(); 
  if(p===1) sounds.fase1.play(); 
  if(p===2) sounds.fase2.play(); 
  if(p===3) sounds.fase3.play(); 
  if(p===4) sounds.fase4.play(); 
  if(p===5) sounds.ending.play(); 
}

// 🔊 Volume
volumeSlider.addEventListener("input",()=>{ let v=volumeSlider.value/100; Object.values(sounds).forEach(m=>m.volume=v); });

// 🚀 Iniciar jogo
startBtn.addEventListener("click", () => {
  menu.style.display = "none";
  canvas.style.display = "block";
  canvas.focus();
  gameState.running = true;
  gameState.phase = 1;
  initStars();
  playMusic(1);
  setInterval(spawnEnemy, 2000);
  setInterval(spawnPowerUp, 10000);
  startAutoShoot();
  loop();
});

// 🖱️ Nave segue o mouse (horizontal + vertical)
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
  }, 500); // 2 tiros por segundo
}
function stopAutoShoot() {
  clearInterval(autoShoot);
}

// 🎮 Loop de animação
function loop() {
  if (gameState.running) {
    update();
    requestAnimationFrame(loop);
  }
}
``
