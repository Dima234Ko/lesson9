// grid.ts
import { WIDTH, HEIGHT, Cell } from './constants';

export class Grid {
    cells: Cell[][];

    constructor() {
        this.cells = this.createEmptyGrid();
    }

    createEmptyGrid(): Cell[][] {
        return Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));
    }

    toggleCell(x: number, y: number) {
        this.cells[y][x] = this.cells[y][x] === 1 ? 0 : 1;
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
                aliveCount += this.cells[newY][newX];
            }
        }

        return aliveCount;
    }

    reset() {
        this.cells = this.createEmptyGrid();
    }
}
