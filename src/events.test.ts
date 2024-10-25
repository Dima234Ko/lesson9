/* eslint-disable @typescript-eslint/no-unused-vars */
import { GameOfLife } from './gameOfLife';
import { GameEvents } from './events';
import { updateDimensions } from './size';

jest.mock('./size');

describe('GameEvents', () => {
    let game: GameOfLife;
    let gameEvents: GameEvents;

    beforeEach(() => {
        game = {
            grid: {
                toggleCell: jest.fn(),
                reset: jest.fn(),
            },
            display: jest.fn(),
            update: jest.fn(),
            updateGrid: jest.fn(),
            intervalId: null,
        } as unknown as GameOfLife;

        document.body.innerHTML = `
            <div id="grid">
                <div class="cell"></div>
                <div class="cell"></div>
                <div class="cell"></div>
            </div>
            <button id="start"></button>
            <button id="reset"></button>
            <button id="apply"></button>
        `;
        gameEvents = new GameEvents(game);
    });

    it('Тест отработки клика на клетку поля', () => {
        const cell = document.querySelector('.cell') as HTMLElement;
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            clientX: 0,
            clientY: 0,
        });
        cell.dispatchEvent(clickEvent);
        expect(game.grid.toggleCell).toHaveBeenCalled();
        expect(game.display).toHaveBeenCalled();
    });

    it('Тест нажатия на кнопку старт', () => {
        const startButton = document.getElementById('start') as HTMLElement;
        startButton.click();
        expect(game.intervalId).not.toBeNull();
    });

    it('Тест нажатия на кнопку применить', () => {
        const applyButton = document.getElementById('apply') as HTMLElement;
        applyButton.click();

        expect(updateDimensions).toHaveBeenCalled();
        expect(game.updateGrid).toHaveBeenCalled();
    });
});
