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
        
        this.enemies = [];
        this.powerUps = [];
        this.bullets = [];
        this.keys = {};
        
        this.score = 0;
        this.coins = 0;
        this.lives = 3;
        
        this.setupListeners();
    }

    setupListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            // Disparo com a barra de espaço
            if (e.key === ' ' || e.key === 'Spacebar') {
                this.shoot();
            }
        });
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
    }

    shoot() {
        // Cria tiros simples a partir da posição da nave
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
            const x = Math.random() * (this.canvas.width - 35);
            this.enemies.push(new Enemy(x, -40, 'normal'));
        }
    }

    update() {
        // Atualiza jogador
        this.player.update(this.keys, this.canvas.width, this.canvas.height);

        // Atualiza tiros do jogador
        this.bullets.forEach((bullet, bIndex) => {
            bullet.y -= bullet.speed;
            if (bullet.y < 0) {
                this.bullets.splice(bIndex, 1);
            }
        });

        // Gera e atualiza inimigos
        this.spawnEnemy();
        this.enemies.forEach((enemy, eIndex) => {
            enemy.update(this.canvas.width);
            
            // Remove inimigos que passam da tela
            if (enemy.y > this.canvas.height) {
                this.enemies.splice(eIndex, 1);
                return;
            }

            // Verifica colisão do tiro com o inimigo
            this.bullets.forEach((bullet, bIndex) => {
                if (enemy.checkCollision(bullet)) {
                    enemy.health -= 1;
                    this.bullets.splice(bIndex, 1);

                    // Se o inimigo morreu
                    if (enemy.health <= 0) {
                        this.enemies.splice(eIndex, 1);
                        this.score += 100;

                        // Chance de dropar moeda ou power-up
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
            
            // Coleta o item se encostar na nave
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

        // Atualiza UI
        this.ui.update(this.coins, this.score, this.lives);
    }

    draw() {
        // Limpa a tela
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Desenha elementos
        this.player.draw(this.ctx, null);

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
