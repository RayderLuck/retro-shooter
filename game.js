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
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
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

        // Gera e atualiza inimigos
        this.spawnEnemy();
        this.enemies.forEach((enemy, index) => {
            enemy.update(this.canvas.width);
            
            // Remove inimigos que saem da tela
            if (enemy.y > this.canvas.height) {
                this.enemies.splice(index, 1);
            }
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
