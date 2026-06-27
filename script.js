const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ship = { x: 50, y: 250, width: 40, height: 20 };
let bullets = [];

function drawShip() {
  ctx.fillStyle = "lime";
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

function shoot() {
  bullets.push({ x: ship.x + ship.width, y: ship.y + ship.height/2, speed: 5 });
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

setInterval(() => {
  shoot();
  update();
}, 100);
