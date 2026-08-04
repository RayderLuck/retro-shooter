export class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.initialY = y; // 🌌 Guarda a posição Y original para o efeito de flutuação
        this.width = 20;
        this.height = 20;
        this.type = type; // 'duplo', 'triplo', 'velocidade' ou 'moeda'
        this.speed = 2;
        this.angle = Math.random() * Math.PI; // 🌊 Ângulo inicial para variação de flutuação
    }

    update() {
        // Move o power-up da direita para a esquerda junto com os itens
        this.x -= this.speed;
        
        // 🌊 Movimento suave de flutuação para cima e para baixo
        this.angle += 0.08;
        this.y = this.initialY + Math.sin(this.angle) * 12;
    }

    draw(ctx) {
        ctx.save();
        
        if (this.type === 'moeda') {
            // 🌟 Brilho neon amarelo para moeda
            ctx.shadowColor = '#ffff00';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#ffff00'; 
            ctx.beginPath();
            ctx.arc(this.x + 10, this.y + 10, 10, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'duplo') {
            // 🌟 Brilho neon verde para Tiro Duplo
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#00ff00'; 
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else if (this.type === 'triplo') {
            // 🌟 Brilho neon magenta para Tiro Triplo
            ctx.shadowColor = '#ff00ff';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#ff00ff'; 
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else if (this.type === 'velocidade') {
            // 🌟 Brilho neon ciano para Velocidade
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#00ffff'; 
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
