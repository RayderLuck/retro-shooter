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
        
        // 🌌 Fundo estrelado dinâmico (isolado e seguro)
        this.stars = Array.from({ length: 80 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 1.5 + 0.5
        }));
        
        this.mouseX = undefined;
        this.mouseY = undefined;
        this.shootTimer = 0;

        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        this.isGameOver = false;
        this.invulnerableTimer = 0; // 🛡️ Tempo de invulnerabilidade após tomar dano

        // 🔊 Elementos de Áudio
        this.bgMusic = document.getElementById('bgMusic');
        this.laserSound = document.getElementById('laserSound');

        this.setupListeners();
        this.setupJoystick();
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

        // Eventos de Mouse (PC)
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
            this.mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = undefined;
            this.mouseY = undefined;
        });
    }

    // 🕹️ Joystick Virtual com rastreamento global para celular
    setupJoystick() {
        const joystickBase = document.getElementById('virtualJoystick');
        const joystickStick = document.getElementById('joystickStick');
        
        if (!joystickBase || !joystickStick) return;

        let active = false;

        const handleTouch = (clientX, clientY) => {
            const baseRect = joystickBase.getBoundingClientRect();
            let centerX = baseRect.left + baseRect.width / 2;
            let centerY = baseRect.top + baseRect.height / 2;
            
            let dx = clientX - centerX;
            let dy = clientY - centerY;
            
            let distance = Math.sqrt(dx * dx + dy * dy);
            let maxDist = baseRect.width / 2 - 15;
            
            if (distance > maxDist) {
                dx = (dx / distance) * maxDist;
                dy = (dy / distance) * maxDist;
            }
            
            joystickStick.style.transform = `translate(${dx}px, ${dy}px)`;
            
            this.keys['ArrowLeft'] = dx < -10;
            this.keys['ArrowRight'] = dx > 10;
            this.keys['ArrowUp'] = dy < -10;
            this.keys['ArrowDown'] = dy > 10;
        };

        joystickBase.addEventListener('touchstart', (e) => {
            active = true;
            if (e.touches.length > 0) {
                handleTouch(e.touches[0].clientX, e.touches[0].clientY);
            }
            e.preventDefault();
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (!active) return;
            if (e.touches.length > 0) {
                handleTouch(e.touches[0].clientX, e.touches[0].clientY);
            }
            e.preventDefault();
        }, { passive: false });

        const endHandler = () => {
            if (!active) return;
            active = false;
            joystickStick.style.transform = `translate(0px, 0px)`;
            this.keys['ArrowLeft'] = false;
            this.keys['ArrowRight'] = false;
            this.keys['ArrowUp'] = false;
            this.keys['ArrowDown'] = false;
        };

        window.addEventListener('touchend', endHandler);
        window.addEventListener('touchcancel', endHandler);
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
        if (this.isGameOver) return;

        this.player.update(this.keys, this.mouseX, this.mouseY, this.canvas.width, this.canvas.height);

        // Reduz o timer de invulnerabilidade gradualmente
        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer--;
        }

        this.shootTimer++;
        if (this.shootTimer >= 12) { // 👈 Cadência de tiro um pouco mais ágil
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

            // Colisão com o Player (só tira vida se não estiver invulnerável)
            if (
                this.invulnerableTimer === 0 &&
                this.player.x < enemy.x + enemy.width &&
                this.player.x + this.player.width > enemy.x &&
                this.player.y < enemy.y + enemy.height &&
                this.player.y + this.player.height > enemy.y
            ) {
                this.lives -= 1;
                this.invulnerableTimer = 60; // 🛡️ 1 segundo de invulnerabilidade (pisca na tela)
                this.enemies.splice(eIndex, 1);

                if (this.lives <= 0) {
                    this.triggerGameOver();
                }
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

    triggerGameOver() {
        this.isGameOver = true;
        if (this.bgMusic) this.bgMusic.pause();
        
        const gameOverScreen = document.getElementById('gameOver');
        const finalScoreText = document.getElementById('finalScore');
        const canvas = document.getElementById('gameCanvas');
        const joystick = document.getElementById('virtualJoystick');

        if (gameOverScreen) gameOverScreen.style.display = 'flex';
        if (finalScoreText) finalScoreText.innerText = `Pontos: ${this.score}`;
        if (canvas) canvas.style.display = 'none';
        if (joystick) joystick.style.display = 'none';
    }

    draw() {
        // 🌌 Fundo Estelar Dinâmico com aceleração ao mover/atirar
        this.ctx.fillStyle = '#050510';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#ffffff';
        const isMovingFast = this.keys['ArrowLeft'] || this.keys['ArrowRight'] || this.keys['ArrowUp'] || this.keys['ArrowDown'];
        const speedMultiplier = isMovingFast ? 2.5 : 1;

        this.stars.forEach(star => {
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
            star.x -= star.speed * speedMultiplier;
            if (star.x < 0) {
                star.x = this.canvas.width;
                star.y = Math.random() * this.canvas.height;
            }
        });

        // 🚀 Renderiza o Jogador (pisca quando está invulnerável após tomar dano)
        if (this.invulnerableTimer === 0 || Math.floor(this.invulnerableTimer / 4) % 2 === 0) {
            this.player.draw(this.ctx, this.shipImage);
        }

        this.ctx.fillStyle = '#00ffff';
        this.bullets.forEach(bullet => {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.powerUps.forEach(item => item.draw(this.ctx));
        this.ui.draw(this.ctx, this.canvas.width);
    }

    loop() {
        if (!this.isGameOver) {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.loop());
        }
    }

    start() {
        this.isGameOver = false;
        this.lives = 3;
        this.score = 0;
        this.coins = 0;
        this.invulnerableTimer = 0;
        this.enemies = [];
        this.bullets = [];
        this.powerUps = [];

        if (this.canvas) this.canvas.style.display = 'block';
        
        const gameOverScreen = document.getElementById('gameOver');
        if (gameOverScreen) gameOverScreen.style.display = 'none';

        const joystick = document.getElementById('virtualJoystick');
        if (joystick) joystick.style.display = 'flex';

        if (this.bgMusic) {
            this.bgMusic.currentTime = 0;
            this.bgMusic.play().catch(() => {});
        }
        this.loop();
    }
}
