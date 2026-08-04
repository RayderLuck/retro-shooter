import { Game } from './game.js';

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas'); // Certifique-se de que o ID do seu canvas no index.html é gameCanvas
    if (canvas) {
        const game = new Game(canvas);
        game.start();
    } else {
        console.error("Canvas não encontrado no HTML!");
    }
});
