import { GameOfLife } from "./gameOfLife";
import { updateDimensions, width } from "./size";

export class GameEvents {
  private game: GameOfLife;

  constructor(game: GameOfLife) {
    this.game = game;
    this.addClickEvent();
    this.addStartButtonEvent();
    this.addResetButtonEvent();
    this.addApplyButtonEvent();
  }

  addClickEvent() {
    const gridElement = document.getElementById("grid");
    if (!gridElement) return;

    gridElement.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains("cell")) {
        const cellIndex = Array.from(gridElement.children).indexOf(target);
        const x = cellIndex % width;
        const y = Math.floor(cellIndex / width);
        this.game.grid.toggleCell(x, y);
        this.game.display();
      }
    });
  }

  addStartButtonEvent() {
    const startButton = document.getElementById("start");
    if (!startButton) return;

    startButton.addEventListener("click", () => {
      if (this.game["intervalId"]) return;

      this.game["intervalId"] = setInterval(() => {
        this.game.update();
      }, 1000);
    });
  }

  addResetButtonEvent() {
    const resetButton = document.getElementById("reset");
    if (!resetButton) return;

    resetButton.addEventListener("click", () => {
      this.game.grid.reset();
      if (this.game["intervalId"]) {
        clearInterval(this.game["intervalId"]);
        this.game["intervalId"] = null;
      }
      this.game.display();
    });
  }

  addApplyButtonEvent() {
    const applyButton = document.querySelector("#apply");
    if (applyButton) {
      applyButton.addEventListener("click", () => {
        updateDimensions();
        this.game.updateGrid();
      });
    } else {
      console.error("Не удалось найти кнопку 'Применить'.");
    }
  }
}
