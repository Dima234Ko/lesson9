// Начальные значения
let WIDTH = Number((document.querySelector('#width') as HTMLInputElement)?.value) || 10;
let HEIGHT = Number((document.querySelector('#height') as HTMLInputElement)?.value) || 10;

// Функция для обновления значений WIDTH и HEIGHT
function updateDimensions() {
    const widthInput = document.querySelector('#width') as HTMLInputElement;
    const heightInput = document.querySelector('#height') as HTMLInputElement;

    if (widthInput && heightInput) { // Проверяем, что элементы существуют
        WIDTH = Number(widthInput.value);
        HEIGHT = Number(heightInput.value);
        console.log(`Ширина: ${WIDTH}, Высота: ${HEIGHT}`); // Для проверки
    } else {
        console.error("Не удалось найти элементы ввода ширины или высоты.");
    }
}

// Обработчик события для кнопки "Применить"
const applyButton = document.querySelector('#apply');
if (applyButton) {
    applyButton.addEventListener('click', updateDimensions);
} else {
    console.error("Не удалось найти кнопку 'Применить'.");
}

// Экспортируем переменные
export { WIDTH, HEIGHT };

export type Cell = 0 | 1;
