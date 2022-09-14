interface Coordinate {
  x: number;
  y: number;
}

export enum Direction {
  Left,
  Up,
  Right,
  Down,
}

export class Board {
  board: Array<number>;
  size = 4;
  gameOver = false;
  score = 0;
  highscore = 0;

  constructor(size: number) {
    this.size = size;

    // TODO load from localStorage
    this.reset();
  }

  reset() {
    this.score = 0;
    this.gameOver = false;
    this.board = new Array(this.size * this.size).fill(0);
    this.spawnRandomTile();
    this.spawnRandomTile();
    this.save();
  }

  save() {
    // TODO save to localStorage
    // localStorage.setItem("", this.size);
  }

  apply() {
    const element = document.getElementById("board-foreground");
    let html = "";
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const here = { x: col, y: row };
        if (this.has(here)) {
          const value = this.get(here);
          html += `<div class="tile tile-${value}" style="--y: ${row}; --x: ${col};"></div>`;
        }
      }
    }
    element!.innerHTML = html;
  }

  action(direction: Direction): boolean {
    switch (direction) {
      case Direction.Left:
        return this.left();
      case Direction.Up:
        return this.up();
      case Direction.Right:
        return this.right();
      case Direction.Down:
        return this.down();
    }
  }

  left(): boolean {
    const scoreDelta = this.merge();
    const moved = this.move();
    this.score += scoreDelta;
    if (scoreDelta > 0 || moved) {
      if (this.score > this.highscore) {
        this.highscore = this.score;
      }

      this.spawnRandomTile();

      if (this.isGameOver()) {
        this.gameOver = true;
      }

      return true;
    }
    return false;
  }

  up(): boolean {
    this.transpose();
    const changed = this.left();
    this.transpose();
    return changed;
  }

  right(): boolean {
    this.transpose();
    this.reflect();
    this.transpose();
    const changed = this.left();
    this.transpose();
    this.reflect();
    this.transpose();
    return changed;
  }

  down(): boolean {
    this.reflect();
    this.transpose();
    const changed = this.left();
    this.transpose();
    this.reflect();
    return changed;
  }

  isGameOver(): boolean {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        // Check for empty fields
        const here = { x: col, y: row };
        if (!this.has(here)) {
          return false;
        }

        // Check for mergeable tiles
        const right = { x: col + 1, y: row };
        if (this.get(here) == this.get(right)) {
          return false;
        }
        const bottom = { x: col, y: row + 1 };
        if (this.get(here) == this.get(bottom)) {
          return false;
        }
      }
    }
    return true;
  }

  spawnRandomTile() {
    // Get empty fields
    const free = new Array<Coordinate>();
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const here = { x: col, y: row };
        if (!this.has(here)) {
          free.push(here);
        }
      }
    }

    // Pick a random field
    const index = Math.floor(Math.random() * free.length);
    // 10% chance of getting a 4, else a 2
    const value = Math.random() > 0.9 ? 4 : 2;
    this.set(free[index], value);
  }

  transpose() {
    const newBoard = new Array<number>(this.size * this.size).fill(0);
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        // Swap x and y
        const value = this.get({ x: col, y: row });
        newBoard[row + col * this.size] = value;
      }
    }
    this.board = newBoard;
  }

  reflect() {
    const newBoard = new Array<number>(this.size * this.size).fill(0);
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        // Reflect along x-axis
        const value = this.get({ x: col, y: row });
        newBoard[col + (this.size - row - 1) * this.size] = value;
      }
    }
    this.board = newBoard;
  }

  merge(): number {
    let scoreDelta = 0;
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        // Look for a non-empty field
        const left = { x: col, y: row };
        if (!this.has(left)) {
          continue;
        }

        for (let i = col + 1; i < this.size; i++) {
          // Look for a field with the same value
          const right = { x: i, y: row };
          if (!this.has(right)) {
            continue;
          }

          if (this.get(left) == this.get(right)) {
            // Merge the two values
            const value = this.get(left)!;
            this.set(left, value * 2);
            this.delete(right);
            scoreDelta += value * 2;
          }
          break;
        }
      }
    }
    return scoreDelta;
  }

  move(): boolean {
    let changed = false;
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        // Look for an empty field
        const left = { x: col, y: row };
        if (this.has(left)) {
          continue;
        }

        for (let i = col + 1; i < this.size; i++) {
          // Look for a non-empty field
          const right = { x: i, y: row };
          if (!this.has(right)) {
            continue;
          }

          // Move the non-empty field to the left
          this.set(left, this.get(right)!);
          this.delete(right);
          changed = true;
          break;
        }
      }
    }
    return changed;
  }

  get(coordinate: Coordinate) {
    return this.board[coordinate.x + coordinate.y * this.size];
  }

  set(coordinate: Coordinate, value: number) {
    this.board[coordinate.x + coordinate.y * this.size] = value;
  }

  has(coordinate: Coordinate) {
    return this.get(coordinate) > 0;
  }

  delete(coordinate: Coordinate) {
    this.set(coordinate, 0);
  }

  print() {
    let str = "";
    for (let row = 0; row < this.size; row++) {
      str += this.board.slice(row * this.size, (row + 1) * this.size).join(" ");
      str += "\n";
    }
    console.log(str);
    console.log(this.board);
  }
}