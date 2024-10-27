import { GameOfLife } from "./gameOfLife";
import { width, height } from "./size";

describe("GameOfLife", () => {
  let game: GameOfLife;

  beforeEach(() => {
    document.body.innerHTML = `
            <table id="grid"></table>
            <button id="start">Start</button>
            <button id="reset">Reset</button>
            <input id="speed" type="range" min="0" max="2000" value="1000">
        `;
    game = new GameOfLife();
    game.initialize();
  });

  it("Тест на соответствие поля стартовым параметрам", () => {
    const cells = game.grid.cells;
    expect(cells).toHaveLength(height);
    cells.forEach((row) => {
      expect(row).toHaveLength(width);
      row.forEach((cell) => expect(cell).toBe(0));
    });
  });

  it("Тест функциональности переключения состояния ячейки", () => {
    const gridElement = document.getElementById("grid");
    const cell = gridElement?.getElementsByTagName("td")[0];
    if (!cell) {
      throw new Error("Cell not found");
    }
    cell.click();
    expect(game.grid.cells[0][0]).toBe(1);
  });

  it("Тест на правильность обновления сетки в игре", () => {
    game.grid.toggleCell(1, 0);
    game.grid.toggleCell(1, 1);
    game.grid.toggleCell(1, 2);
    game.update();
    expect(game.grid.cells[1][1]).toBe(1);
    expect(game.grid.cells[0][1]).toBe(0);
    expect(game.grid.cells[2][1]).toBe(0);
  });

  it("Тест на изменение скорости игры", () => {
    const speedInput = document.getElementById("speed") as HTMLInputElement;
    speedInput.value = "500";
    speedInput.dispatchEvent(new Event("input"));
    expect(game.speed).toBe(1500);
    game.addStartButtonEvent();
    const startButton = document.getElementById("start") as HTMLButtonElement;
    startButton.click();
    const initialIntervalId = game.intervalId;
    expect(initialIntervalId).not.toBeNull();
  });

  it("Тест нажатия на кнопку 'Start', когда игра уже запущена", () => {
    const startButton = document.getElementById("start") as HTMLButtonElement;
    startButton.click();
    const initialIntervalId = game.intervalId;
    startButton.click();
    expect(game.intervalId).toBe(initialIntervalId);
  });

  it("Тест сброса игрового поля", () => {
    game.grid.toggleCell(0, 0);
    game.grid.toggleCell(1, 1);
    const resetButton = document.getElementById("reset");
    resetButton?.click();
    const cells = game.grid.cells;
    cells.forEach((row) => {
      row.forEach((cell) => expect(cell).toBe(0));
    });
  });

  it("Тест нажатия на ячейку вне границ сетки", () => {
    const gridElement = document.getElementById("grid") as HTMLTableElement;
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientX: 0,
      clientY: 0,
    });
    gridElement.dispatchEvent(clickEvent);
    expect(game.grid.cells.flat().some((cell) => cell === 1)).toBe(false);
  });

  it("Тест на выживание ячейки с двумя соседями", () => {
    game.grid.cells = [
      [0, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ];

    game.update();

    expect(game.grid.cells[0][1]).toBe(1);
    expect(game.grid.cells[1][0]).toBe(1);
    expect(game.grid.cells[1][1]).toBe(1);
    expect(game.grid.cells[1][2]).toBe(0);
    expect(game.grid.cells[2][1]).toBe(0);
  });

  it("Тест на отсутствие изменений в пустой сетке", () => {
    game.grid.cells = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    game.update();
    expect(game.grid.cells).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  it("Тест на стабильную конфигурацию", () => {
    game.grid.cells = [
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ];
    game.update();
    expect(game.grid.cells).toEqual([
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ]);
  });
});
