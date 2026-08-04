import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { PowerUp } from './powerup.js';
import { UI } from './ui.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.player = new Player(canvas.width / 2 - 20, canvas.height / 2 - 20);
        this.ui = new UI();
        
        this.shipImage = new Image();
        this.shipImage.src = 'ship.png';

        this.enemies = [];
        this.powerUps = [];
        this.bullets = [];
        this.keys = {};
        
        this.mouseX = undefined;
        this.mouseY = undefined;
        this.shootTimer = 0;

        this.score = 0;
        this.coins = 0;
        this.lives = 3;

        // 🔊 Elementos de Áudio
        this.bgMusic = document.getElementById('bgMusic');
        this.laserSound = document.getElementById('laserSound');
        
        // 🕹️ Estado do Joystick Virtual
        this.joystickActive = false;
        this.joystickVector = { x: 0, y: 0 };
        this.joystickCenter = { x: 0, y: 0 };
        this.maxJoystickDist = 40;

        this.setupListeners();
        this.setupVirtualJoystick();
    }

    setVolume(vol) {
        const val = vol / 100;
        if (this.bgMusic) this.bgMusic.volume = val;
        if (this.laserSound) this.laserSound.volume = val;
    }

    playLaser() {
        if (this.laserSound) {
            this.laserSound.currentTime = 0;
            this.laserSound.play().catch(() => {});
        }
    }

    setupListeners() {
        window.addEventListener('keydown', (e) => { this.keys[e.key] = true; });
        window.addEventListener('keyup', (e) => { this.keys[e.key] = false; });

        const updateMousePosition = (clientX, clientY) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            
            this.mouseX = (clientX - rect.left) * scaleX;
            this.mouseY = (clientY - rect.top) * scaleY;
        };

        this.canvas.addEventListener('mousemove', (e) => {
            updateMousePosition(e.clientX, e.clientY);
        });

        this.canvas.addEventListener('mouseenter', (e) => {
            updateMousePosition(e.clientX, e.clientY);
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = undefined;
            this.mouseY = undefined;
        });
    }

    setupVirtualJoystick() {
        const base = document.getElementById('virtualJoystick');
        const stick = document.getElementById('joystickStick');
        if (!base || !stick) return;

        const handleTouchStart = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = base.getBoundingClientRect();
            this.joystickCenter = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
            this.joystickActive = true;
            handleTouchMove(e);
        };

        const handleTouchMove = (e) => {
            if (!this.joystickActive) return;
            e.preventDefault();
            const touch = e.touches[0];

            let dx = touch.clientX - this.joystickCenter.x;
            let dy = touch.clientY - this.joystickCenter.y;
            const distance = Math.hypot(dx, dy);

            if (distance > this.maxJoystickDist) {
                dx = (dx / distance) * this.maxJoystickDist;
                dy = (dy / distance) * this.maxJoystickDist;
            }

            stick.style.transform = `translate(${dx}px, ${dy}px)`;

            this.joystickVector.x = dx / this.maxJoystickDist;
            this.joystickVector.y = dy / this.maxJoystickDist;
        };

        const handleTouchEnd = (e) => {
            if (!this.joystickActive) return;
            e.preventDefault();
            this.joystickActive = false;
            this.joystickVector = { x: 0, y: 0 };
            stick.style.transform = `translate(0px, 0px)`;
        };

        base.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    shoot() {
        const tipX = this.player.x + this.player.width; 
        const centerY = this.player.y + this.player.height / 2;

        if (this.player.shootType === 'duplo') {
            this.bullets.push({ x: tipX, y: centerY - 10, width: 12, height: 5, speed: 8 });
            this.bullets.push({ x: tipX, y: centerY + 5, width: 12, height: 5, speed: 8 });
        } else if (this.player.shootType === 'triplo') {
            this.bullets.push({ x: tipX, y: centerY - 14, width: 12, height: 4, speed: 8 });
            this.bullets.push({ x: tipX, y: centerY - 3, width: 12, height: 4, speed: 8 });
            this.bullets.push({ x: tipX, y: centerY + 8, width: 12, height: 4, speed: 8 });
        } else {
            this.bullets.push({ x: tipX, y: centerY - 3, width: 12, height: 6, speed: 8 });
        }

        this.playLaser();
    }

    spawnEnemy() {
        if (Math.random() < 0.02) {
            const y = Math.random() * (this.canvas.height - 50);
            this.enemies.push(new Enemy(this.canvas.width + 40, y, 'normal'));
        }
    }

    update() {
        // Aplica o movimento do joystick virtual caso esteja ativo
        if (this.joystickActive) {
            this.player.x += this.joystickVector.x * this.player.speed;
            this.player.y += this.joystickVector.y * this.player.speed;
            
            // Limites do canvas
            if (this.player.x < 0) this.player.x = 0;
            if (this.player.x > this.canvas.width - this.player.width) this.player.x = this.canvas.width - this.player.width;
            if (this.player.y < 0) this.player.y = 0;
            if (this.player.y > this.canvas.height - this.player.height) this.player.y = this.canvas.height - this.player.height;
        } else {
            this.player.update(this.keys, this.mouseX, this.mouseY, this.canvas.width, this.canvas.height);
        }

        this.shootTimer++;
        if (this.shootTimer >= 15) {
            this.shoot();
            this.shootTimer = 0;
        }

        this.bullets.forEach((bullet, bIndex) => {
            bullet.x += bullet.speed;
            if (bullet.x > this.canvas.width) {
                this.bullets.splice(bIndex, 1);
            }
        });

        this.spawnEnemy();
        this.enemies.forEach((enemy, eIndex) => {
            enemy.update(this.canvas.height);
            
            if (enemy.x + enemy.width < 0) {
                this.enemies.splice(eIndex, 1);
                return;
            }

            this.bullets.forEach((bullet, bIndex) => {
                if (enemy.checkCollision(bullet)) {
                    enemy.health -= 1;
                    this.bullets.splice(bIndex, 1);

                    if (enemy.health <= 0) {
                        this.enemies.splice(eIndex, 1);
                        this.score += 100;

                        if (Math.random() < 0.5) {
                            const rand = Math.random();
                            let dropType = 'moeda';
                            if (rand < 0.3) dropType = 'duplo';
                            else if (rand < 0.5) dropType = 'triplo';
                            else if (rand < 0.7) dropType = 'velocidade';

                            this.powerUps.push(new PowerUp(enemy.x, enemy.y, dropType));
                        }
                    }
                }
            });
        });

        this.powerUps.forEach((item, index) => {
            item.update();
            
            if (item.checkCollision(this.player)) {
                if (item.type === 'moeda') {
                    this.coins += 1;
                } else if (item.type === 'duplo' || item.type === 'triplo') {
                    this.player.shootType = item.type;
                } else if (item.type === 'velocidade') {
                    if (this.player.speedLevel < 3) {
                        this.player.speedLevel++;
                        this.player.speed += 2;
                    }
                }
                this.powerUps.splice(index, 1);
            } else if (item.x < -50) {
                this.powerUps.splice(index, 1);
            }
        });

        this.ui.update(this.coins, this.score, this.lives);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.player.draw(this.ctx, this.shipImage);

        this.ctx.fillStyle = '#00ffff';
        this.bullets.forEach(bullet => {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.powerUps.forEach(item => item.draw(this.ctx));
        this.ui.draw(this.ctx, this.canvas.width);
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    start() {
        if (this.bgMusic) {
            this.bgMusic.play().catch(() => {});
        }
        this.loop();
    }
}
