export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 6;
        this.shootType = 'basico';
    }

    // Atualiza a posição da nave seguindo o mouse ou toque, com suporte opcional a teclado
    update(keys, mouseX, mouseY, canvasWidth, canvasHeight) {
        // Se houver posição de mouse/toque ativa, a nave vai diretamente para lá (centralizada no cursor)
        if (mouseX !== undefined && mouseY !== undefined) {
            this.x = mouseX - this.width / 2;
            this.y = mouseY - this.height / 2;
        } else {
            // Fallback para controle por teclado caso necessário
            if (keys['ArrowLeft'] || keys['a'] || keys['A']) this.x -= this.speed;
            if (keys['ArrowRight'] || keys['d'] || keys['D']) this.x += this.speed;
            if (keys['ArrowUp'] || keys['w'] || keys['W']) this.y -= this.speed;
            if (keys['ArrowDown'] || keys['s'] || keys['S']) this.y += this.speed;
        }

        // Limites da tela para a nave não sumir
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvasHeight) this.y = canvasHeight - this.height;
    }

    // Desenha a nave usando o ship.png
    draw(ctx, spriteImage) {
        if (spriteImage && spriteImage.complete && spriteImage.naturalWidth !== 0) {
            ctx.drawImage(spriteImage, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = '#00ffcc';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
