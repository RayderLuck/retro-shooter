export class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.type = type; // 'moeda', 'explosivo', 'perfurante', 'ricochete'
        this.speed = 3;
    }

    // Faz o item descer pela tela
    update() {
        this.y += this.speed;
    }

    // Desenha o item (você pode customizar cores ou usar sprites depois)
    draw(ctx) {
        ctx.save();
        if (this.type === 'moeda') {
            ctx.fillStyle = '#ffd700'; // Dourado para moedas
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffaa00';
            ctx.stroke();
        } else {
            ctx.fillStyle = '#ff00ff'; // Magenta para power-ups de tiro
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }

    // Verifica colisão com a nave do jogador
    checkCollision(player) {
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }
}
