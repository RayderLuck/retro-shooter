import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { PowerUp } from './powerup.js';
import { UI } from './ui.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.player = new Player(canvas.width / 2 - 20, canvas.height - 70);
        this.ui = new UI();
        
        // Carrega o sprite da nave original
        this.shipImage = new Image();
        this.shipImage.src = 'ship.png';

        this.enemies = [];
        this.powerUps = [];
        this.bullets = [];
        this.keys = {};
        
        // Posições de mouse/toque e controle de tiro automático
        this.mouseX = undefined;
        this.mouseY = undefined;
        this.shootTimer = 0;

        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        
        this.setupListeners();
    }

    setupListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Eventos de movimento por Mouse e Toque para a nave seguir livremente
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const rect = this.canvas.getBoundingClientRect();
                this.mouseX = e.touches[0].clientX - rect.left;
                this.mouseY = e.touches[0].clientY - rect.top;
            }
            e.preventDefault();
        }, { passive: false });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = undefined;
            this.mouseY = undefined;
        });
    }

    shoot() {
        this.bullets.push({
            x: this.player.x + this.player.width / 2 - 3,
            y: this.player.y,
            width: 6,
            height: 12,
            speed: 7
        });
    }

    spawnEnemy() {
        if (Math.random() < 0.02) {
            // Inimigos nascem na extremidade direita da tela, com altura aleatória
            const y = Math.random() * (this.canvas.height - 50);
            this.enemies.push(new Enemy(this.canvas.width + 40, y, 'normal'));
        }
    }

    update() {
        // Atualiza a nave passando o mouse/toque e limites do canvas
        this.player.update(this.keys, this.mouseX, this.mouseY, this.canvas.width, this.canvas.height);

        // Disparo automático a cada X quadros
        this.shootTimer++;
        if (this.shootTimer >= 15) { // Ajuste a velocidade do tiro automático aqui se quiser
            this.shoot();
            this.shootTimer = 0;
        }

        // Atualiza tiros do jogador (indo para cima)
        this.bullets.forEach((bullet, bIndex) => {
            bullet.y -= bullet.speed;
            if (bullet.y < 0) {
                this.bullets.splice(bIndex, 1);
            }
        });

        // Gera e atualiza inimigos (vindo da direita para a esquerda)
        this.spawnEnemy();
        this.enemies.forEach((enemy, eIndex) => {
            enemy.update(this.canvas.height);
            
            // Remove inimigos que saem pelo lado esquerdo da tela
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

                        if (Math.random() < 0.4) {
                            const dropType = Math.random() < 0.7 ? 'moeda' : 'explosivo';
                            this.powerUps.push(new PowerUp(enemy.x, enemy.y, dropType));
                        }
                    }
                }
            });
        });

        // Atualiza power-ups / moedas
        this.powerUps.forEach((item, index) => {
            item.update();
            
            if (item.checkCollision(this.player)) {
                if (item.type === 'moeda') {
                    this.coins += 1;
                } else {
                    this.player.shootType = item.type;
                }
                this.powerUps.splice(index, 1);
            } else if (item.y > this.canvas.height) {
                this.powerUps.splice(index, 1);
            }
        });

        this.ui.update(this.coins, this.score, this.lives);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Desenha a nave com o sprite carregado
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
