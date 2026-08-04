export class Enemy {
    constructor(x, y, type = 'normal') {
        this.x = x;
        this.y = y;
        this.width = 35;
        this.height = 35;
        this.type = type; // 'normal' ou 'chefe'
        
        if (this.type === 'chefe') {
            this.width = 80;
            this.height = 60;
            this.health = 25;
            this.speed = 2;
        } else {
            this.health = 2;
            this.speed = 3;
        }
        
        this.direction = 1; // Para oscilação vertical se necessário
    }

    // Atualiza a movimentação do inimigo da direita para a esquerda
    update(canvasHeight) {
        // Movimento principal: da direita para a esquerda
        this.x -= this.speed;
        
        // Se for chefe, adiciona um leve movimento oscilatório vertical para dar dinamismo
        if (this.type === 'chefe') {
            this.y += this.direction * 1;
            if (this.y <= 20 || this.y + this.height >= canvasHeight - 20) {
                this.direction *= -1;
            }
        }
    }

    // Desenha o inimigo no canvas
    draw(ctx) {
        ctx.save();
        if (this.type === 'chefe') {
            ctx.fillStyle = '#ff3333'; // Vermelho forte para o chefe
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Detalhes visuais do chefe
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(this.x + 10, this.y + 10, 10, 10);
            ctx.fillRect(this.x + this.width - 20, this.y + 10, 10, 10);
        } else {
            ctx.fillStyle = '#ff6600'; // Laranja para inimigo normal
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }

    // Verifica colisão com tiros do jogador
    checkCollision(bullet) {
        return (
            bullet.x < this.x + this.width &&
            bullet.x + bullet.width > this.x &&
            bullet.y < this.y + this.height &&
            bullet.y + bullet.height > this.y
        );
    }
}
