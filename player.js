export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 6;
        this.shootType = 'basico';
    }

    // Restaura o controle fluido por setas ou toque/mouse se necessário
    update(keys, canvasWidth, canvasHeight) {
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] || keys['d'] || keys['D']) {
            this.x += this.speed;
        }
        if (keys['ArrowUp'] || keys['w'] || keys['W']) {
            this.y -= this.speed;
        }
        if (keys['ArrowDown'] || keys['s'] || keys['S']) {
            this.y += this.speed;
        }

        // Limites da tela
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvasHeight) this.y = canvasHeight - this.height;
    }

    // Desenha a nave usando o ship.png corretamente carregado
    draw(ctx, spriteImage) {
        if (spriteImage && spriteImage.complete && spriteImage.naturalWidth !== 0) {
            ctx.drawImage(spriteImage, this.x, this.y, this.width, this.height);
        } else {
            // Fallback visual caso a imagem demore um instante para carregar
            ctx.fillStyle = '#00ffcc';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
