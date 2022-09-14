import { Board, Direction } from "./board";

function main() {
  const board = new Board(4);

  window.addEventListener("keydown", (event) => {
    switch (event.code) {
      case "ArrowLeft":
      case "ArrowUp":
      case "ArrowRight":
      case "ArrowDown":
        const direction = Direction[event.code.replace("Arrow", "")];
        const changed = board.action(direction);
        if (changed) {
          board.apply();
        }
        break;
    }
  });
}

window.addEventListener("load", main);
