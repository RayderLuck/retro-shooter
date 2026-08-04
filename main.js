import { Game } from './game.js';

window.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const menu = document.getElementById('menu');
    const canvas = document.getElementById('gameCanvas');
    const virtualJoystick = document.getElementById('virtualJoystick');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            // Esconde o menu inicial
            if (menu) menu.style.display = 'none';
            
            // Mostra o canvas do jogo
            if (canvas) {
                canvas.style.display = 'block';
            }

            // Exibe o joystick virtual no celular
            if (virtualJoystick) {
                virtualJoystick.style.display = 'flex';
            }

            // Inicia o loop principal do jogo
            const game = new Game(canvas);
            game.start();
        });
    }
});
