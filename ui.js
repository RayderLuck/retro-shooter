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
        ctx.font = 'bold 16px "Courier New", monospace';

        // 🌟 Efeito de brilho neon geral para os textos da interface
        ctx.shadowBlur = 8;

        // Pontuação no canto superior esquerdo (Ciano Neon)
        ctx.shadowColor = '#00ffff';
        ctx.fillStyle = '#00ffff';
        ctx.fillText(`Score: ${this.score}`, 20, 30);

        // Vidas no centro superior (Branco/Verde Neon)
        ctx.shadowColor = '#00ffcc';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Vidas: ${this.lives}`, canvasWidth / 2 - 35, 30);

        // Contador de Moedas no canto superior direito (Amarelo Ouro Neon)
        ctx.shadowColor = '#ffd700';
        ctx.fillStyle = '#ffd700';
        ctx.fillText(`Moedas: ${this.coins}`, canvasWidth - 130, 30);

        ctx.restore();
    }
}
