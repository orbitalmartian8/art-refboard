// Selecting elements from the DOM
const board = document.getElementById("board");
const clearBtn = document.getElementById("clear-btn");

// Adding event listeners to the clear button
clearBtn.addEventListener("click", clearBoard);

// Adding event listener to the board for drawing
board.addEventListener("mousemove", draw);

// Clearing the board
function clearBoard() {
  const pixels = document.querySelectorAll(".pixel");
  pixels.forEach(pixel => {
    pixel.style.backgroundColor = "#fff";
  });
}

// Drawing on the board
function draw(event) {
  const color = document.getElementById("color-picker").value;
  const pixelSize = document.getElementById("size-picker").value;
  if (event.buttons === 1) {
    const pixel = event.target;
    pixel.style.backgroundColor = color;
    pixel.style.width = `${pixelSize}px`;
    pixel.style.height = `${pixelSize}px`;
  }
}
