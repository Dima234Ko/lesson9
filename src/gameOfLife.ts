import { Grid } from './grid';
import { WIDTH, HEIGHT, Cell } from './constants';

export class GameOfLife {
    grid: Grid;
    intervalId: ReturnType<typeof setInterval> | null;

    constructor() {
        this.grid = new Grid();
        this.intervalId = null;
    }

    update() {
        const newGrid: Cell[][] = this.grid.cells.map(row => [...row]);

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                const aliveNeighbors = this.grid.getAliveNeighbors(x, y);

                if (this.grid.cells[y][x] === 1) {
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

        this.grid.cells = newGrid;
        this.display();
    }

    display() {
        const gridElement = document.getElementById('grid');
        if (!gridElement) return;
    
        gridElement.innerHTML = '';
    
        const table = document.createElement('table');
        this.grid.cells.forEach(row => {
            const tableRow = document.createElement('tr');
            row.forEach(cell => {
                const cellElement = document.createElement('td');
                cellElement.style.backgroundColor = cell === 1 ? 'black' : 'white';
                cellElement.style.width = '20px';
                cellElement.style.height = '20px';
                cellElement.style.border = '1px solid black';
                tableRow.appendChild(cellElement);
            });
            table.appendChild(tableRow);
        });
    
        gridElement.appendChild(table);
    }
    

    addClickEvent() {
        const gridElement = document.getElementById('grid');
        if (!gridElement) return;
    
        gridElement.addEventListener('click', (event) => {
            const target = event.target as HTMLTableCellElement;
            if (target.tagName === 'TD') {
                const cellIndex = Array.from(gridElement.getElementsByTagName('td')).indexOf(target);
                const x = cellIndex % WIDTH;
                const y = Math.floor(cellIndex / WIDTH);
                this.grid.toggleCell(x, y);
                this.display();
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
            this.grid.reset();
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
            this.display();
        });
    }

    initialize() {
        this.addClickEvent();
        this.addStartButtonEvent();
        this.addResetButtonEvent();
        this.display();
    }
}
