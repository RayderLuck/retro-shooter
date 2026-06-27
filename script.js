const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const menu = document.getElementById("menu");

let ship = { x: 50, y: 250, width: 40, height: 20 };
let bullets = [];
let gameRunning = false;

function drawShip() {
  ctx.fillStyle = "lime";
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

function shoot() {
  bullets.push({ x: ship.x + ship.width, y: ship.y + ship.height / 2, speed: 5 });
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShip();
  bullets.forEach(b => {
    b.x += b.speed;
    ctx.fillStyle = "yellow";
    ctx.fillRect(b.x, b.y, 5, 2);
  });
}

canvas.addEventListener("mousemove", (event) => {
  if (!gameRunning) return;
  const rect = canvas.getBoundingClientRect();
  const mouseY = event.clientY - rect.top;
  ship.y = Math.max(0, Math.min(mouseY - ship.height / 2, canvas.height - ship.height));
});

function startGame() {
  menu.style.display = "none";
  canvas.style.display = "block";
  gameRunning = true;

  setInterval(() => {
    if (gameRunning) {
      shoot();
      update();
    }
  }, 100);
}

startBtn.addEventListener("click", startGame);
