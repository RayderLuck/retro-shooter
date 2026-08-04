export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 5;
        this.shootType = 'basico'; // Tipos: 'basico', 'explosivo', 'perfurante', 'ricochete'
    }

    // Atualiza a posição da nave com base nos comandos
    update(keys, canvasWidth, canvasHeight) {
        if (keys['ArrowLeft'] || keys['a']) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] || keys['d']) {
            this.x += this.speed;
        }

        // Limita a nave dentro dos limites da tela
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvasWidth) {
            this.x = canvasWidth - this.width;
        }
    }

    // Desenha a nave no contexto do canvas
    draw(ctx, spriteImage) {
        if (spriteImage && spriteImage.complete) {
            ctx.drawImage(spriteImage, this.x, this.y, this.width, this.height);
        } else {
            // Fallback caso a imagem ainda não tenha carregado
            ctx.fillStyle = '#00ffcc';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
