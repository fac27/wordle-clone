import { words } from "./dictionary.js";

const template = document.querySelector("template");
const canvas = document.querySelector("#game-container");

setUpBoard();
let playing = true;

let currentRow = 0;
let currentSquare = 0;
let currentRowElement = document.querySelector(`#row-${currentRow}`);
let currentSquareElement = currentRowElement.children[currentSquare];

window.addEventListener("keydown", (event) => {
  processKeyPress(event.key);
});

function setUpBoard() {
  for (let row = 0; row < 6; row++) {
    // Get row node from template
    const rowNode = template.content.cloneNode(true);
    // Get row element from row node
    const rowElement = rowNode.firstElementChild;
    // Set the 'id' of each row
    rowElement.setAttribute("id", `row-${row}`);

    // Iterate through 'square' elements in row element and set the 'id' of each one
    const squareElements = rowElement.children;
    for (let i = 0; i < squareElements.length; i++) {
      squareElements[i].setAttribute("id", `square-${i}`);
    }

    // Add the row to the canvas
    canvas.appendChild(rowNode);
  }
}

function processKeyPress(key) {
  const isLetter =
    key.length === 1 &&
    key.toUpperCase().charCodeAt() - 64 <= 26 &&
    key.toUpperCase().charCodeAt() - 64 >= 1;

  if (isLetter) {
    key = key.toUpperCase();
    if (currentSquareElement.textContent === "") {
      currentSquareElement.textContent = key;
      // Ensure current letter does not exceed 5
      // There is no square 5 but this is needed so that
      // on delete keypress, square  5 - 1 is the last square
      currentSquare = Math.min(currentSquare + 1, 5);
      if (currentSquare < 5) {
        currentSquareElement = currentRowElement.children[currentSquare];
      }
    }
  }

  if (key === "Enter") {
    let guessWord = getGuessWord();
  }

  if (key === "Backspace") {
    currentSquare = Math.max(currentSquare - 1, 0);
    currentSquareElement = currentRowElement.children[currentSquare];
    currentSquareElement.textContent = "";
  }
}

function getGuessWord() {
    
}