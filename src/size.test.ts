// constants.test.ts
import { updateDimensions, width, height } from './size';

describe('updateDimensions', () => {
    let widthInput: HTMLInputElement;
    let heightInput: HTMLInputElement;

    beforeEach(() => {
        // Создаем элементы ввода
        widthInput = document.createElement('input');
        widthInput.id = 'width';
        widthInput.type = 'number';
        document.body.appendChild(widthInput);

        heightInput = document.createElement('input');
        heightInput.id = 'height';
        heightInput.type = 'number';
        document.body.appendChild(heightInput);
    });
    
    it('Тест, что поле формируется с заданными значениями', () => {
        widthInput.value = '20';
        heightInput.value = '15';
        updateDimensions();
        expect(width).toBe(20);
        expect(height).toBe(15);
    });
});
