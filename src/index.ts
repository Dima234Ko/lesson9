import "./body.css";
import "./table.css";
import "./btn.css";

import { GameOfLife } from "./gameOfLife";
import { GameEvents } from "./events";

const game = new GameOfLife();
game.initialize();

document.addEventListener("DOMContentLoaded", () => {
  new GameEvents(game); // Создаем экземпляр
});
