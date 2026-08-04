import { Game } from './game.js';

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const startBtn = document.getElementById('startBtn');
    const menu = document.getElementById('menu');
    const volumeSlider = document.getElementById('volumeSlider');

    if (canvas) {
        const game = new Game(canvas);

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                game.setVolume(e.target.value);
            });
        }

        const startGame = (e) => {
            if (e) e.preventDefault(); // Evita duplo disparo ou atraso no mobile
            
            const nameField = document.getElementById('playerName');
            if (nameField && !nameField.value.trim()) {
                alert('Digite seu nome antes de começar!');
                return;
            }

            if (menu) menu.style.display = 'none';
            game.start();
        };

        if (startBtn) {
            startBtn.addEventListener('click', startGame);
            startBtn.addEventListener('touchend', startGame, { passive: false });
        }
    }
});
