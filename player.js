export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 6; // Velocidade base
        this.speedLevel = 1; // Estágio de velocidade (1 a 3)
        this.shootType = 'basico'; // 'basico', 'duplo', 'triplo'
        this.tilt = 0; // ✈️ Ângulo de inclinação suave
    }

    update(keys, mouseX, mouseY, canvasWidth, canvasHeight) {
        let movingY = 0;

        if (mouseX !== undefined && mouseY !== undefined) {
            this.x = mouseX - this.width / 2;
            this.y = mouseY - this.height / 2;
            this.tilt = 0;
        } else {
            if (keys['ArrowLeft'] || keys['a'] || keys['A']) this.x -= this.speed;
            if (keys['ArrowRight'] || keys['d'] || keys['D']) this.x += this.speed;
            
            if (keys['ArrowUp'] || keys['w'] || keys['W']) {
                this.y -= this.speed;
                movingY = -1; // Subindo
            }
            if (keys['ArrowDown'] || keys['s'] || keys['S']) {
                this.y += this.speed;
                movingY = 1; // Descendo
            }
        }

        // ✈️ Suaviza a inclinação da nave com base no movimento vertical
        this.tilt = movingY * 0.15;

        // Limites da tela
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvasHeight) this.y = canvasHeight - this.height;
    }

    draw(ctx, spriteImage) {
        ctx.save();
        
        // Move o ponto de origem para o centro da nave para rotacionar perfeitamente
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.tilt);

        // 🌟 O brilho neon fica mais intenso e muda de cor conforme o speedLevel aumenta
        ctx.shadowColor = this.speedLevel === 3 ? '#ff00ff' : (this.speedLevel === 2 ? '#00ffff' : '#00ffcc');
        ctx.shadowBlur = 10 + (this.speedLevel * 4);

        if (spriteImage && spriteImage.complete && spriteImage.naturalWidth !== 0) {
            ctx.drawImage(spriteImage, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            ctx.fillStyle = '#00ffcc';
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }

        ctx.restore();
    }
}
