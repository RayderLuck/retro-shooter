export class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type; // 'duplo', 'triplo', 'velocidade' ou 'moeda'
        this.speed = 2;
    }

    update() {
        // Move o power-up da direita para a esquerda junto com os itens
        this.x -= this.speed;
    }

    draw(ctx) {
        ctx.save();
        if (this.type === 'moeda') {
            ctx.fillStyle = '#ffff00'; // Amarelo para moeda
            ctx.beginPath();
            ctx.arc(this.x + 10, this.y + 10, 10, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'duplo') {
            ctx.fillStyle = '#00ff00'; // Verde para Tiro Duplo
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else if (this.type === 'triplo') {
            ctx.fillStyle = '#ff00ff'; // Roxo/Magenta para Tiro Triplo
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else if (this.type === 'velocidade') {
            ctx.fillStyle = '#00ffff'; // Ciano para Velocidade
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }

    checkCollision(player) {
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }
}
