export class UI {
    constructor() {
        this.coins = 0;
        this.score = 0;
        this.lives = 3;
    }

    // Atualiza os valores do HUD
    update(coins, score, lives) {
        this.coins = coins;
        this.score = score;
        this.lives = lives;
    }

    // Desenha as informações na tela usando o contexto do Canvas
    draw(ctx, canvasWidth) {
        ctx.save();
        ctx.font = '16px "Courier New", monospace';
        ctx.fillStyle = '#ffffff';

        // Pontuação no canto superior esquerdo
        ctx.fillText(`Score: ${this.score}`, 20, 30);

        // Vidas no centro superior
        ctx.fillText(`Vidas: ${this.lives}`, canvasWidth / 2 - 35, 30);

        // Contador de Moedas no canto superior direito
        ctx.fillStyle = '#ffd700';
        ctx.fillText(`Moedas: ${this.coins}`, canvasWidth - 130, 30);

        ctx.restore();
    }
}
