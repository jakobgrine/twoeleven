import { Board } from "./board";

function main() {
  const board = new Board();

  window.addEventListener("keydown", (event) => {
    switch (event.code) {
      case "ArrowLeft":
        board.left();
        break;
      case "ArrowUp":
        board.up();
        break;
      case "ArrowRight":
        board.right();
        break;
      case "ArrowDown":
        board.down();
        break;
    }
  });

  document.getElementById("reset-button").addEventListener("click", () => {
    board.reset();
  });
  document.getElementById("restart-button").addEventListener("click", () => {
    board.reset();
  });
}

window.addEventListener("load", main);
