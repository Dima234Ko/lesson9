import { Grid } from "./grid"; // Импортируем класс Grid для работы с сеткой
import { width, height, Cell } from "./size"; // Импортируем начальные размеры сетки и тип Cell

export class GameOfLife {
  grid: Grid; // Сетка клеток
  intervalId: ReturnType<typeof setInterval> | null; // Идентификатор интервала для обновления
  speed: number; // Скорость обновления
  doomedCells: boolean[][]; // Состояние обреченных клеток

  constructor() {
    this.grid = new Grid(width, height); // Создаем новую сетку с заданными размерами
    this.intervalId = null; // Изначально игра не запущена
    this.speed = 1000; // Начальная скорость обновления
    this.doomedCells = Array.from({ length: height }, () =>
      Array(width).fill(false),
    ); // Инициализируем массив обреченных клеток
    this.initialize(); // Инициализация событий при создании
  }

  // Метод для обновления состояния клеток
  update() {
    const newGrid: Cell[][] = this.grid.cells.map((row) => [...row]); // Копируем текущее состояние клеток
    this.doomedCells = Array.from({ length: this.grid.height }, () =>
        Array(this.grid.width).fill(false),
    ); // Сброс состояния обреченных клеток

    // Проходим по всем клеткам
    for (let y = 0; y < this.grid.height; y++) {
        for (let x = 0; x < this.grid.width; x++) {
            const aliveNeighbors = this.grid.getAliveNeighbors(x, y); // Получаем количество живых соседей

            if (this.grid.cells[y][x] === 1) {
                // Живая клетка
                if (aliveNeighbors < 2 || aliveNeighbors > 3) {
                    newGrid[y][x] = 0; // Клетка умирает
                    this.doomedCells[y][x] = true; // Обреченная клетка
                }
            } else if (this.grid.cells[y][x] === 0 && aliveNeighbors === 3) {
                // Мертвая клетка
                newGrid[y][x] = 1; // Клетка рождается
            }
        }
    }

    this.grid.cells = newGrid; // Обновляем состояние клеток
    this.display(); // Обновляем отображение
}


  // Метод для проверки, все ли клетки мертвы
  checkAllCellsDead(): boolean {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (this.grid.cells[y][x] === 1) {
          return false; // Если найдена живая клетка, возвращаем false
        }
      }
    }
    return true; // Все клетки мертвы
  }

  // Метод для отображения клеток на экране
  display() {
    const gridElement = document.getElementById("grid"); // Получаем элемент сетки из DOM
    if (!gridElement) return; // Если элемент не найден, выходим

    gridElement.innerHTML = ""; // Очищаем содержимое сетки
    const table = document.createElement("table"); // Создаем новую таблицу

    // Проходим по всем клеткам и создаем элементы для отображения
    for (let y = 0; y < this.grid.height; y++) {
      const tableRow = document.createElement("tr"); // Создаем новую строку таблицы
      for (let x = 0; x < this.grid.width; x++) {
        const cellElement = document.createElement("td"); // Создаем элемент для клетки
        if (this.doomedCells[y] && this.doomedCells[y][x]) {
          cellElement.style.backgroundColor = "blue"; // Обреченная клетка
        } else {
          cellElement.style.backgroundColor =
            this.grid.cells[y][x] === 1 ? "black" : "white"; // Живая и мертвая клетка
        }
        tableRow.appendChild(cellElement); // Добавляем клетку в строку
      }
      table.appendChild(tableRow); // Добавляем строку в таблицу
    }
    gridElement.appendChild(table); // Добавляем таблицу в элемент сетки
  }

  // Метод для обновления размеров сетки
  updateGrid(newWidth: number, newHeight: number) {
    const oldWidth = this.grid.width; // Запоминаем старую ширину
    const oldHeight = this.grid.height; // Запоминаем старую высоту

    // Обновляем размеры сетки
    this.grid.resize(newWidth, newHeight);

    // Создаем новую сетку с мертвыми клетками
    const newCells = Array.from({ length: newHeight }, () =>
        Array(newWidth).fill(0) // Все клетки инициализируем как мертвые
    );

    // Переносим старые клетки в новую сетку
    for (let y = 0; y < Math.min(oldHeight, newHeight); y++) {
        for (let x = 0; x < Math.min(oldWidth, newWidth); x++) {
            newCells[y][x] = this.grid.cells[y][x]; // Копируем состояние старых клеток
        }
    }

    // Обновляем состояние клеток
    this.grid.cells = newCells;

    // Обновляем состояние doomedCells
    this.doomedCells = Array.from({ length: newHeight }, () =>
        Array(newWidth).fill(false)
    );

    this.display(); // Обновляем отображение
    this.addClickEvent(); // Привязываем события к новым клеткам
}


  // Метод для привязки событий кликов к клеткам
  addClickEvent() {
    const gridElement = document.getElementById("grid"); // Получаем элемент сетки
    if (!gridElement) return; // Если элемент не найден, выходим

    // Удаляем предыдущие обработчики событий, если они есть
    gridElement.replaceWith(gridElement.cloneNode(true));
    const newGridElement = document.getElementById("grid");

    newGridElement?.addEventListener("click", (event) => {
      const target = event.target as HTMLTableCellElement; // Получаем элемент, по которому кликнули
      if (target.tagName === "TD") {
        // Проверяем, что это клетка
        const rowIndex = Array.from(target.parentElement!.parentElement!.children).indexOf(target.parentElement!); // Индекс строки
        const cellIndex = Array.from(target.parentElement!.children).indexOf(target); // Индекс клетки в строке

        const x = cellIndex; // Индекс по горизонтали
        const y = rowIndex; // Индекс по вертикали

        // Проверяем, что индексы находятся в пределах сетки
        if (x >= 0 && x < this.grid.width && y >= 0 && y < this.grid.height) {
          this.grid.toggleCell(x, y); // Переключаем состояние клетки
          this.display(); // Обновляем отображение
        }
      }
    });
  }

  // Метод для добавления события на кнопку "Старт"
  addStartButtonEvent() {
    const startButton = document.getElementById("start"); // Получаем кнопку "Старт"
    if (!startButton) return; // Если кнопка не найдена, выходим

    startButton.addEventListener("click", () => {
      if (this.intervalId) return; // Если игра уже запущена, выходим

      this.intervalId = setInterval(() => {
        this.update(); // Обновляем состояние клеток через заданный интервал
      }, this.speed);
    });
  }

  // Метод для добавления события на кнопку "Сброс"
  addResetButtonEvent() {
    const resetButton = document.getElementById("reset"); // Получаем кнопку "Сброс"
    if (!resetButton) return; // Если кнопка не найдена, выходим

    resetButton.addEventListener("click", () => {
      this.grid.reset(); // Сбрасываем состояние сетки
      this.doomedCells = Array.from({ length: height }, () =>
        Array(width).fill(false),
      ); // Сброс состояния обреченных клеток
      if (this.intervalId) {
        clearInterval(this.intervalId); // Останавливаем игру
        this.intervalId = null; // Сбрасываем идентификатор
      }
      this.display(); // Обновляем отображение
    });
  }

  // Метод для добавления события на элемент управления скоростью
  addSpeedControlEvent() {
    const speedInput = document.getElementById("speed") as HTMLInputElement; // Получаем элемент управления скоростью
    if (!speedInput) return; // Если элемент не найден, выходим

    speedInput.addEventListener("input", () => {
      this.speed = 2000 - Number(speedInput.value); // Обновляем скорость
      if (this.intervalId) {
        clearInterval(this.intervalId); // Останавливаем текущий интервал
        this.intervalId = setInterval(() => {
          this.update(); // Запускаем новый интервал с обновленной скоростью
        }, this.speed);
      }
    });
  }

  // Метод для инициализации событий
  initialize() {
    this.addClickEvent(); // Привязываем события кликов
    this.addStartButtonEvent(); // Привязываем событие на кнопку "Старт"
    this.addResetButtonEvent(); // Привязываем событие на кнопку "Сброс"
    this.addSpeedControlEvent(); // Привязываем событие на элемент управления скоростью
    this.display(); // Отображаем начальное состояние
  }
}
