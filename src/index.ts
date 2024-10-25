import "./body.css";
import "./table.css";
import "./btn.css";

import { GameOfLife } from "./gameOfLife";
import { GameEvents } from "./events";

const game = new GameOfLife();
game.initialize();

// Инициализируем GameEvents после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  new GameEvents(game); // Создаем экземпляр без сохранения в переменной
});
