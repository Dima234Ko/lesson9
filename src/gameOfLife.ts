import { Grid } from "./grid";
import { width, height, Cell } from "./size";

export class GameOfLife {
  grid: Grid;
  intervalId: ReturnType<typeof setInterval> | null;
  speed: number;
  doomedCells: boolean[][];

  constructor() {
    this.grid = new Grid(width, height);
    this.intervalId = null;
    this.speed = 1000; // начальная скорость
    this.doomedCells = Array.from({ length: height }, () =>
      Array(width).fill(false),
    );
  }

  update() {
    const newGrid: Cell[][] = this.grid.cells.map((row) => [...row]);
    this.doomedCells = Array.from({ length: height }, () =>
      Array(width).fill(false),
    ); // Сброс состояния обреченных клеток

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const aliveNeighbors = this.grid.getAliveNeighbors(x, y);

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

    this.grid.cells = newGrid;
    this.display();

    // Проверка на наличие живых клеток
    if (this.checkAllCellsDead()) {
      this.stopGame(); // Остановка игры, если все клетки мертвы
    }
  }

  checkAllCellsDead(): boolean {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (this.grid.cells[y][x] === 1) {
          return false;
        }
      }
    }
    return true; // Все клетки мертвы
  }

  stopGame() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      alert("Все клетки мертвы.");
    }
  }

  display() {
    const gridElement = document.getElementById("grid");
    if (!gridElement) return;
    gridElement.innerHTML = "";
    const table = document.createElement("table");
    for (let y = 0; y < this.grid.height; y++) {
      const tableRow = document.createElement("tr");
      for (let x = 0; x < this.grid.width; x++) {
        const cellElement = document.createElement("td");
        if (this.doomedCells[y] && this.doomedCells[y][x]) {
          cellElement.style.backgroundColor = "blue"; // Обреченная клетка
        } else {
          cellElement.style.backgroundColor =
            this.grid.cells[y][x] === 1 ? "black" : "white"; // Живая и мертвая клетка
        }
        tableRow.appendChild(cellElement);
      }
      table.appendChild(tableRow);
    }
    gridElement.appendChild(table);
  }

  updateGrid(newWidth: number, newHeight: number) {
    this.grid.resize(newWidth, newHeight);
    this.doomedCells = Array.from({ length: newHeight }, () =>
      Array(newWidth).fill(false),
    ); // Обновляем размеры doomedCells
    this.display();
  }

  addClickEvent() {
    const gridElement = document.getElementById("grid");
    if (!gridElement) return;

    gridElement.addEventListener("click", (event) => {
      const target = event.target as HTMLTableCellElement;
      if (target.tagName === "TD") {
        // Получаем индекс строки (y)
        const rowIndex = Array.from(
          target.parentElement!.parentElement!.children,
        ).indexOf(target.parentElement!);
        // Получаем индекс клетки (x) в строке
        const cellIndex = Array.from(target.parentElement!.children).indexOf(
          target,
        );

        const x = cellIndex; // индекс по горизонтали
        const y = rowIndex; // индекс по вертикали

        // Проверяем, что индексы находятся в пределах сетки
        if (x >= 0 && x < this.grid.width && y >= 0 && y < this.grid.height) {
          this.grid.toggleCell(x, y);
          this.display();
        }
      }
    });
  }

  addStartButtonEvent() {
    const startButton = document.getElementById("start");
    if (!startButton) return;

    startButton.addEventListener("click", () => {
      if (this.intervalId) return;

      this.intervalId = setInterval(() => {
        this.update();
      }, this.speed);
    });
  }

  addResetButtonEvent() {
    const resetButton = document.getElementById("reset");
    if (!resetButton) return;

    resetButton.addEventListener("click", () => {
      this.grid.reset();
      this.doomedCells = Array.from({ length: height }, () =>
        Array(width).fill(false),
      ); // Сброс состояния обреченных клеток
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.display();
    });
  }

  addSpeedControlEvent() {
    const speedInput = document.getElementById("speed") as HTMLInputElement;
    if (!speedInput) return;

    speedInput.addEventListener("input", () => {
      this.speed = 2000 - Number(speedInput.value);
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
          this.update();
        }, this.speed);
      }
    });
  }

  initialize() {
    this.addClickEvent();
    this.addStartButtonEvent();
    this.addResetButtonEvent();
    this.addSpeedControlEvent();
    this.display();
  }
}
