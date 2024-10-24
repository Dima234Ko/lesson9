// grid.ts
import { WIDTH, HEIGHT, Cell } from './constants';

export class Grid {
    cells: Cell[][];

    constructor(width: number, height: number) {
        this.cells = this.createEmptyGrid(width, height);
    }

    createEmptyGrid(width: number, height: number): Cell[][] {
        return Array.from({ length: height }, () => Array(width).fill(0));
    }

    toggleCell(x: number, y: number) {
        this.cells[y][x] = this.cells[y][x] === 1 ? 0 : 1;
    }

    getAliveNeighbors(x: number, y: number): number {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
        ];

        let aliveCount = 0;

        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < this.cells[0].length && newY >= 0 && newY < this.cells.length) {
                aliveCount += this.cells[newY][newX];
            }
        }

        return aliveCount;
    }

    reset() {
        this.cells = this.createEmptyGrid(this.cells[0].length, this.cells.length);
    }
}
