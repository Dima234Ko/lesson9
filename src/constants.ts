// constants.ts
export type Cell = 0 | 1;

// Начальные значения
let WIDTH = Number((document.querySelector('#width') as HTMLInputElement)?.value) || 10;
let HEIGHT = Number((document.querySelector('#height') as HTMLInputElement)?.value) || 10;

// Функция для обновления значений WIDTH и HEIGHT
export function updateDimensions() {
    const widthInput = document.querySelector('#width') as HTMLInputElement;
    const heightInput = document.querySelector('#height') as HTMLInputElement;

    if (widthInput && heightInput) { // Проверяем, что элементы существуют
        WIDTH = Number(widthInput.value);
        HEIGHT = Number(heightInput.value);
    } else {
        alert("Не удалось найти элементы ввода ширины или высоты.");
    }
}

// Экспортируем переменные
export { WIDTH, HEIGHT };



