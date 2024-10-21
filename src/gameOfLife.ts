/* eslint-disable @typescript-eslint/no-unused-expressions */
const WIDTH = 10;
const HEIGHT = 10;

type Cell = 0 | 1;

export class GameOfLife {
    grid: Cell[][];
    intervalId: ReturnType<typeof setInterval> | null; // Изменено здесь

    constructor() {
        this.grid = this.createEmptyGrid();
        this.intervalId = null;
    }

    createEmptyGrid(): Cell[][] {
        return Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));
    }

    toggleCell(x: number, y: number) {
        this.grid[y][x] = this.grid[y][x] === 1 ? 0 : 1;
        this.display();
    }

    getAliveNeighbors(x: number, y: number): number {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        let aliveCount = 0;

        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < WIDTH && newY >= 0 && newY < HEIGHT) {
                aliveCount += this.grid[newY][newX];
            }
        }

        return aliveCount;
    }

    update() {
        const newGrid: Cell[][] = this.grid.map(row => [...row]);

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                const aliveNeighbors = this.getAliveNeighbors(x, y);

                if (this.grid[y][x] === 1) {
                    if (aliveNeighbors < 2 || aliveNeighbors > 3) {
                        newGrid[y][x] = 0;
                    }
                } else {
                    if (aliveNeighbors === 3) {
                        newGrid[y][x] = 1;
                    }
                }
            }
        }

        this.grid = newGrid;
        this.display();
    }

    display() {
        const gridElement = document.getElementById('grid');
        if (!gridElement) return;

        gridElement.innerHTML = '';

        this.grid.forEach(row => {
            row.forEach(cell => {
                const cellElement = document.createElement('div');
                cellElement.className = 'cell ' + (cell === 1 ? 'alive' : 'dead');
                cellElement.textContent = cell === 1 ? '■' : '□';
                gridElement.appendChild(cellElement);
            });
        });
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
                this.toggleCell(x, y);
            }
        });
    }

    addStartButtonEvent() {
        const startButton = document.getElementById('start');
        if (!startButton) return;

        startButton.addEventListener('click', () => {
            if (this.intervalId) return;

            this.intervalId = setInterval(() => {
                this.update();
            }, 1000);
        });
    }

    addResetButtonEvent() {
        const resetButton = document.getElementById('reset');
        if (!resetButton) return;
    
        resetButton.addEventListener('click', () => {
            this.grid = this.createEmptyGrid(); // Сбрасываем сетку
            this.intervalId && clearInterval(this.intervalId); // Останавливаем игру, если она запущена
            this.intervalId = null; // Сбрасываем идентификатор интервала this.display(); // Обновляем отображение
        });
    }
    
    initialize() {
        this.addClickEvent();
        this.addStartButtonEvent();
        this.addResetButtonEvent(); // Добавляем обработчик для кнопки "Заново"
        this.display();
    }
}
