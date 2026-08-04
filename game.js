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
        
        this.setupListeners();
    }

    setupListeners() {
        window.addEventListener('keydown', (e) => { this.keys[e.key] = true; });
        window.addEventListener('keyup', (e) => { this.keys[e.key] = false; });

        // Captura correta do mouse relativa ao canvas redimensionado (PC e Touch)
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

        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
            }
            e.preventDefault();
        }, { passive: false });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = undefined;
            this.mouseY = undefined;
        });
    }

    shoot() {
        // O tiro sai da frente (direita) da nave, indo horizontalmente para a direita
        this.bullets.push({
            x: this.player.x + this.player.width,
            y: this.player.y + this.player.height / 2 - 3,
            width: 12,
            height: 6,
            speed: 8
        });
    }

    spawnEnemy() {
        if (Math.random() < 0.02) {
            const y = Math.random() * (this.canvas.height - 50);
            this.enemies.push(new Enemy(this.canvas.width + 40, y, 'normal'));
        }
    }

    update() {
        // Atualiza a nave seguindo o mouse/toque
        this.player.update(this.keys, this.mouseX, this.mouseY, this.canvas.width, this.canvas.height);

        // Disparo automático contínuo
        this.shootTimer++;
        if (this.shootTimer >= 15) {
            this.shoot();
            this.shootTimer = 0;
        }

        // Atualiza tiros do jogador (indo para a direita)
        this.bullets.forEach((bullet, bIndex) => {
            bullet.x += bullet.speed;
            if (bullet.x > this.canvas.width) {
                this.bullets.splice(bIndex, 1);
            }
        });

        // Gera e atualiza inimigos (indo da direita para a esquerda)
        this.spawnEnemy();
        this.enemies.forEach((enemy, eIndex) => {
            enemy.update(this.canvas.height);
            
            if (enemy.x + enemy.width < 0) {
                this.enemies.splice(eIndex, 1);
                return;
            }

            // Verifica colisão do tiro com o inimigo
            this.bullets.forEach((bullet, bIndex) => {
                if (enemy.checkCollision(bullet)) {
                    enemy.health -= 1;
                    this.bullets.splice(bIndex, 1);

                    if (enemy.health <= 0) {
                        this.enemies.splice(eIndex, 1);
                        this.score += 100;

                        // Dropa moedas ou power-ups na posição do inimigo derrotado
                        if (Math.random() < 0.5) {
                            const dropType = Math.random() < 0.7 ? 'moeda' : 'explosivo';
                            this.powerUps.push(new PowerUp(enemy.x, enemy.y, dropType));
                        }
                    }
                }
            });
        });

        // Atualiza e verifica coleta de power-ups / moedas
        this.powerUps.forEach((item, index) => {
            item.update();
            
            // Coleta o item ao encostar na nave
            if (item.checkCollision(this.player)) {
                if (item.type === 'moeda') {
                    this.coins += 1;
                } else {
                    this.player.shootType = item.type;
                }
                this.powerUps.splice(index, 1);
            } else if (item.x < -50 || item.y > this.canvas.height) { 
                // Remove se sair da tela (ajustado para o fluxo da esquerda)
                this.powerUps.splice(index, 1);
            }
        });

        this.ui.update(this.coins, this.score, this.lives);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Desenha a nave com o sprite ship.png
        this.player.draw(this.ctx, this.shipImage);

        // Desenha tiros
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
        this.loop();
    }
}
