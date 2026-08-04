export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 6; // Velocidade base
        this.speedLevel = 1; // Estágio de velocidade (1 a 3)
        this.shootType = 'basico'; // 'basico', 'duplo', 'triplo'
    }

    update(keys, mouseX, mouseY, canvasWidth, canvasHeight) {
        if (mouseX !== undefined && mouseY !== undefined) {
            this.x = mouseX - this.width / 2;
            this.y = mouseY - this.height / 2;
        } else {
            if (keys['ArrowLeft'] || keys['a'] || keys['A']) this.x -= this.speed;
            if (keys['ArrowRight'] || keys['d'] || keys['D']) this.x += this.speed;
            if (keys['ArrowUp'] || keys['w'] || keys['W']) this.y -= this.speed;
            if (keys['ArrowDown'] || keys['s'] || keys['S']) this.y += this.speed;
        }

        // Limites da tela
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvasHeight) this.y = canvasHeight - this.height;
    }

    draw(ctx, spriteImage) {
        ctx.save();
        
        // 🌟 Efeito visual neon de brilho para a nave
        ctx.shadowColor = '#00ffcc';
        ctx.shadowBlur = 12;

        if (spriteImage && spriteImage.complete && spriteImage.naturalWidth !== 0) {
            ctx.drawImage(spriteImage, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = '#00ffcc';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        ctx.restore();
    }
}
