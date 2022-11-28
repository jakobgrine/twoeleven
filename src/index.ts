import { Board, Direction } from "./board";

function main() {
  const board = new Board();

  window.addEventListener("keydown", (event) => {
    switch (event.code) {
      case "ArrowLeft":
      case "ArrowUp":
      case "ArrowRight":
      case "ArrowDown":
        const direction = Direction[event.code.replace("Arrow", "")];
        board.action(direction);
        break;
    }
  });

  document.getElementById("reset-button")!.addEventListener("click", () => {
    board.reset();
  });
  document.getElementById("restart-button")!.addEventListener("click", () => {
    board.reset();
  });
}

window.addEventListener("load", main);
