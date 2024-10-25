// grid.test.ts
import { Grid } from './grid';
import { width, height } from './size';

describe('Grid', () => {
    let grid: Grid;

    beforeEach(() => {
        grid = new Grid(width, height);
    });

    it('Тест на создание пустой решетки', () => {
        const emptyGrid = grid.createEmptyGrid(width, height);
        expect(emptyGrid).toHaveLength(height);
        expect(emptyGrid.every(row => row.length === width)).toBe(true);
        expect(emptyGrid.flat()).toEqual(Array(height * width).fill(0));
    });

    it('Тест на переключение состояния клетки', () => {
        grid.toggleCell(0, 0);
        expect(grid.cells[0][0]).toBe(1);
        grid.toggleCell(0, 0);
        expect(grid.cells[0][0]).toBe(0);
    });

    it('Тест на подсчет живых соседей', () => {
        grid.toggleCell(0, 0);
        grid.toggleCell(1, 0);
        grid.toggleCell(0, 1);
        expect(grid.getAliveNeighbors(0, 0)).toBe(2);
        expect(grid.getAliveNeighbors(1, 0)).toBe(2);
        expect(grid.getAliveNeighbors(0, 1)).toBe(2);
        expect(grid.getAliveNeighbors(1, 1)).toBe(3);
    });

    it('Тест на сброс решетки', () => {
        grid.toggleCell(0, 0);
        expect(grid.cells[0][0]).toBe(1);
        grid.reset();
        expect(grid.cells[0][0]).toBe(0);
    });
});
