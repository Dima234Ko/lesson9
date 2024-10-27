/* eslint-disable @typescript-eslint/no-unused-vars */
import { width, height, Cell } from "./size";

export class Grid {
  cells: Cell[][];
  height: number;
  width: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = this.createEmptyGrid(width, height);
  }

  private createEmptyGrid(width: number, height: number): Cell[][] {
    return Array.from({ length: height }, () => Array(width).fill(0));
  }

  public toggleCell(x: number, y: number) {
    if (this.cells[y] && this.cells[y][x] !== undefined) {
      this.cells[y][x] = this.cells[y][x] === 1 ? 0 : 1; // Переключаем состояние клетки
    }
  }

  public getAliveNeighbors(x: number, y: number): number {
    let count = 0;
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height) {
        count += this.cells[newY][newX]; // Увеличиваем счетчик, если сосед живая клетка
      }
    }
    return count;
  }

  public reset(): void {
    this.cells = this.createEmptyGrid(this.width, this.height);
  }

  public resize(newWidth: number, newHeight: number): void {
    const newCells = this.createEmptyGrid(newWidth, newHeight);

    for (let y = 0; y < Math.min(this.height, newHeight); y++) {
      for (let x = 0; x < Math.min(this.width, newWidth); x++) {
        newCells[y][x] = this.cells[y][x]; // Копируем старые значения
      }
    }

    this.width = newWidth;
    this.height = newHeight;
    this.cells = newCells;
  }

  private isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }
}
