import { Board, Direction } from "./board";

function main() {
    const board = new Board();

    window.addEventListener("keydown", (event) => {
        if (
            event.code === "ArrowLeft" ||
            event.code === "ArrowUp" ||
            event.code === "ArrowRight" ||
            event.code === "ArrowDown"
        ) {
            const direction =
                Direction[
                    event.code.replace("Arrow", "") as keyof typeof Direction
                ];
            board.action(direction);
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
