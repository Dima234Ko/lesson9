import { GameOfLife } from './gameOfLife';
import { width, height } from './size';

describe('GameOfLife', () => {
    let game: GameOfLife; 

    beforeEach(() => {
        document.body.innerHTML = `
            <table id="grid"></table>
            <button id="start">Start</button>
            <button id="reset">Reset</button>
        `;
        game = new GameOfLife();
        game.initialize();
    });

    it('Тест на соответсвие поля стартовым параметрам', () => {
        const cells = game.grid.cells;
        expect(cells).toHaveLength(height);
        cells.forEach(row => {
            expect(row).toHaveLength(width);
            row.forEach(cell => expect(cell).toBe(0));
        });
    });

    it('Тест функциональности переключения состояния ячейки', () => {
        const gridElement = document.getElementById('grid');
        const cell = gridElement?.getElementsByTagName('td')[0];
        if (!cell) {
            throw new Error('Cell not found');
        }
        cell.click();
        expect(game.grid.cells[0][0]).toBe(1);
    });

    it('Тест на правильность обновления сетки в игре', () => {
        game.grid.toggleCell(1, 0); 
        game.grid.toggleCell(1, 1); 
        game.grid.toggleCell(1, 2); 
        game.update();
        expect(game.grid.cells[1][1]).toBe(1); 
        expect(game.grid.cells[0][1]).toBe(0); 
        expect(game.grid.cells[2][1]).toBe(0);
    });

    it('Тест сброса игрового поля', () => {
        game.grid.toggleCell(0, 0);
        game.grid.toggleCell(1, 1);

        const resetButton = document.getElementById('reset');
        resetButton?.click(); 

        const cells = game.grid.cells;
        cells.forEach(row => {
            row.forEach(cell => expect(cell).toBe(0));
        });
    });
});
