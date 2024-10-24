import { GameOfLife } from './gameOfLife';
import { Grid } from './grid';
import { WIDTH, HEIGHT } from './constants';

describe('GameOfLife', () => {
    let game: GameOfLife; // Указываем тип переменной

    beforeEach(() => {
        document.body.innerHTML = `
            <table id="grid"></table>
            <button id="start">Start</button>
            <button id="reset">Reset</button>
        `;
        game = new GameOfLife();
        game.initialize();
    });

    test('Тест на соответсвие поля стартовым параметрам', () => {
        const cells = game.grid.cells;
        expect(cells).toHaveLength(HEIGHT);
        cells.forEach(row => {
            expect(row).toHaveLength(WIDTH);
            row.forEach(cell => expect(cell).toBe(0));
        });
    });

    test('Тест функциональности переключения состояния ячейки', () => {
        const gridElement = document.getElementById('grid');
        const cell = gridElement?.getElementsByTagName('td')[0];
        if (!cell) {
            throw new Error('Cell not found');
        }
        cell.click();
        expect(game.grid.cells[0][0]).toBe(1);
    });

    test('Тест на правильность обновления сетки в игре', () => {
        game.grid.toggleCell(1, 0); 
        game.grid.toggleCell(1, 1); 
        game.grid.toggleCell(1, 2); 
        game.update();
        expect(game.grid.cells[1][1]).toBe(1); 
        expect(game.grid.cells[0][1]).toBe(0); 
        expect(game.grid.cells[2][1]).toBe(0);
    });

    test('Тест сброса игрового поля', () => {
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
