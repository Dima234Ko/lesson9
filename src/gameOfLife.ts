import { Grid } from "./grid";
import { width, height, Cell } from "./size";

export class GameOfLife {
  grid: Grid;
  intervalId: ReturnType<typeof setInterval> | null; //Интервал для обновления
  speed: number; // Скорость обновления
  doomedCells: boolean[][];

  constructor() {
    this.grid = new Grid(width, height); // Создаем новую сетку с заданными размерами
    this.intervalId = null;
    this.speed = 1000; // Начальная скорость обновления
    this.doomedCells = Array.from({ length: height }, () =>
      Array(width).fill(false),
    );
    this.initialize();
  }

  // Метод для обновления состояния клеток
  update() {
    const newGrid: Cell[][] = this.grid.cells.map((row) => [...row]); // Копируем текущее состояние клеток
    this.doomedCells = Array.from({ length: this.grid.height }, () =>
      Array(this.grid.width).fill(false),
    ); // Сброс состояния клеток

    // Проходим по всем клеткам
    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        const aliveNeighbors = this.grid.getAliveNeighbors(x, y); // Получаем количество живых соседей

        if (this.grid.cells[y][x] === 1) {
          if (aliveNeighbors < 2 || aliveNeighbors > 3) {
            newGrid[y][x] = 0; // Клетка умирает
            this.doomedCells[y][x] = true; // Обреченная клетка
          }
        } else if (this.grid.cells[y][x] === 0 && aliveNeighbors === 3) {
          newGrid[y][x] = 1; // Клетка рождается
        }
      }
    }
    this.grid.cells = newGrid; // Обновляем состояние клеток
    this.display(); // Обновляем отображение
    // Проверка, все ли клетки мертвы
    if (this.checkAllCellsDead()) {
      this.stopGame(); // Остановка игры, если все клетки мертвы
    }
  }

  // Метод для остановки игры
  stopGame() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Останавливаем интервал
      this.intervalId = null;
    }
    alert("Игра остановлена: все клетки мертвы.");
  }

  // Метод для проверки, все ли клетки мертвы
  checkAllCellsDead(): boolean {
    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        if (this.grid.cells[y][x] === 1) {
          return false;
        }
      }
    }
    return true;
  }

  // Метод для отображения клеток на экране
  display() {
    const gridElement = document.querySelector("#grid");
    if (!gridElement) return;
    gridElement.innerHTML = ""; // Очищаем содержимое сетки
    const table = document.createElement("table"); // Создаем новую таблицу
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

    this.grid.resize(newWidth, newHeight);
    const newCells = Array.from({ length: newHeight }, () =>
      Array(newWidth).fill(0),
    );

    // Переносим старые клетки в новую сетку
    for (let y = 0; y < Math.min(oldHeight, newHeight); y++) {
      for (let x = 0; x < Math.min(oldWidth, newWidth); x++) {
        newCells[y][x] = this.grid.cells[y][x];
      }
    }

    // Обновляем состояние клеток
    this.grid.cells = newCells;
    this.doomedCells = Array.from({ length: newHeight }, () =>
      Array(newWidth).fill(false),
    );
    this.display();
    this.addClickEvent();
  }

  // Событие по клику на клетку
  addClickEvent() {
    const gridElement = document.querySelector("#grid");
    if (!gridElement) return;
    gridElement.replaceWith(gridElement.cloneNode(true));
    const newGridElement = document.querySelector("#grid");

    newGridElement?.addEventListener("click", (event) => {
      const target = event.target as HTMLTableCellElement;
      if (target.tagName === "TD") {
        const rowIndex = Array.from(
          target.parentElement!.parentElement!.children,
        ).indexOf(target.parentElement!);
        const cellIndex = Array.from(target.parentElement!.children).indexOf(
          target,
        );

        const x = cellIndex; // Индекс по горизонтали
        const y = rowIndex; // Индекс по вертикали

        // Проверяем, что индексы находятся в пределах сетки
        if (x >= 0 && x < this.grid.width && y >= 0 && y < this.grid.height) {
          this.grid.toggleCell(x, y); // Переключаем состояние клетки
          this.display();
        }
      }
    });
  }

  // Метод для добавления события на кнопку "Старт"
  addStartButtonEvent() {
    const startButton = document.querySelector("#start"); // Получаем кнопку "Старт"
    if (!startButton) return; // Если кнопка не найдена, выходим
    startButton.addEventListener("click", () => {
      if (this.intervalId) return;
      this.intervalId = setInterval(() => {
        this.update(); // Обновляем состояние клеток
      }, this.speed);
    });
  }

  // Метод для добавления события на кнопку "Сброс"
  addResetButtonEvent() {
    const resetButton = document.querySelector("#reset");
    if (!resetButton) return; // Если кнопка не найдена, выходим
    resetButton.addEventListener("click", () => {
      this.grid.reset(); // Сбрасываем состояние сетки
      this.doomedCells = Array.from({ length: height }, () =>
        Array(width).fill(false),
      );
      if (this.intervalId) {
        clearInterval(this.intervalId); // Останавливаем игру
        this.intervalId = null;
      }
      this.display(); // Обновляем отображение
    });
  }

  // Метод для добавления события на элемент управления скоростью
  addSpeedControlEvent() {
    const speedInput = document.querySelector("#speed") as HTMLInputElement;
    if (!speedInput) return; // Если элемент не найден, выходим
    speedInput.addEventListener("input", () => {
      this.speed = 2000 - Number(speedInput.value); // Обновляем скорость
      if (this.intervalId) {
        clearInterval(this.intervalId);
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
