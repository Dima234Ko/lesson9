import { GameOfLife } from './gameOfLife';
import { WIDTH } from './constants';

export class GameEvents {
    private game: GameOfLife;

    constructor(game: GameOfLife) {
        this.game = game;
        this.addClickEvent();
        this.addStartButtonEvent();
        this.addResetButtonEvent();
    }

    addClickEvent() {
        const gridElement = document.getElementById('grid');
        if (!gridElement) return;

        gridElement.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains('cell')) {
                const cellIndex = Array.from(gridElement.children).indexOf(target);
                const x = cellIndex % WIDTH;
                const y = Math.floor(cellIndex / WIDTH);
                this.game.grid.toggleCell(x, y); // Изменено на this.game.grid.toggleCell
                this.game.display(); // Обновляем отображение после переключения
            }
        });
    }

    addStartButtonEvent() {
        const startButton = document.getElementById('start');
        if (!startButton) return;

        startButton.addEventListener('click', () => {
            if (this.game['intervalId']) return;

            this.game['intervalId'] = setInterval(() => {
                this.game.update();
            }, 1000);
        });
    }

    addResetButtonEvent() {
        const resetButton = document.getElementById('reset');
        if (!resetButton) return;

        resetButton.addEventListener('click', () => {
            this.game.grid.reset();
            if (this.game['intervalId']) {
                clearInterval(this.game['intervalId']);
                this.game['intervalId'] = null;
            }
            this.game.display();
        });
    }
}
