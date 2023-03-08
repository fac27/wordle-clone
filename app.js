import { words } from "./dictionary.js";

const template = document.querySelector("template");
const canvas = document.querySelector("#game-container");

// Guess letter status enumeration
const letterStatus = Object.freeze({
  NOT_IN_WORD: 0,
  WRONG_PLACE: 1,
  CORRECT: 2,
});

setUpBoard();

let secretWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
console.log(secretWord);

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
  if (!playing) {
    return;
  }
  if (isLetter(key)) {
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
    if (guessWordIsComplete()) {
      const guessLetters = getGuessLetters();
      const turnResults = checkIfCorrect(guessLetters);

        setSquareColours(turnResults);

      console.log(turnResults);
      if (turnResults.every((result) => result === letterStatus.CORRECT)) {
        alert("You won!");
        playing = false;
      } else {
        currentRow = currentRow + 1;
        if (currentRow === 6) {
            alert(`You lost!\nThe word was ${secretWord}.`);
            playing = false;
        }
        currentSquare = 0;
        currentRowElement = document.querySelector(`#row-${currentRow}`);
        currentSquareElement = currentRowElement.children[currentSquare];
      }
    }
  }

  if (key === "Backspace") {
    currentSquare = Math.max(currentSquare - 1, 0);
    currentSquareElement = currentRowElement.children[currentSquare];
    currentSquareElement.textContent = "";
  }
}

function isLetter(s) {
  let isSingleLetter =
    s.length === 1 &&
    s.toUpperCase().charCodeAt() - 64 <= 26 &&
    s.toUpperCase().charCodeAt() - 64 >= 1;

  return isSingleLetter;
}

function guessWordIsComplete() {
  for (let square of currentRowElement.childNodes) {
    if (square.textContent === "") {
      return false;
    }
  }
  return true;
}

function getGuessLetters() {
  let letters = [];

  for (let square of currentRowElement.children) {
    letters.push(square.textContent);
  }

  return letters;
}

function checkIfCorrect(guessLetters) {
  const results = [];
  const secretWordAsArray = secretWord.split("");

  for (let i = 0; i < guessLetters.length; i++) {
    // Is this letter correct?
    if (guessLetters[i] === secretWordAsArray[i]) {
      results.push(letterStatus.CORRECT);
      secretWordAsArray[i] = "#";
      continue;
    }

    // Get index of guess letter in secret word (-1 if not present)
    const indexInWord = secretWordAsArray.indexOf(guessLetters[i]);

    // Is letter not present?
    if (indexInWord === -1) {
      results.push(letterStatus.NOT_IN_WORD);
      continue;
    }

    // Letter must be in wrong place
    secretWordAsArray[indexInWord] = "#";
    results.push(letterStatus.WRONG_PLACE);
  }

  return results;
}

function setSquareColours(results) {

    const squareElements = currentRowElement.children;

    for (let i = 0; i < results.length; i++) {
        if (results[i] === letterStatus.CORRECT) {
            squareElements[i].classList.add(`animate-order-${i+1}`);
            squareElements[i].classList.add("spin-to-correct");
        }
        if (results[i] === letterStatus.WRONG_PLACE) {
          squareElements[i].classList.add(`animate-order-${i+1}`);
            squareElements[i].classList.add("spin-to-wrong-place");
        }
        if (results[i] === letterStatus.NOT_IN_WORD) {
          squareElements[i].classList.add(`animate-order-${i+1}`);
          squareElements[i].classList.add("spin-to-incorrect");
        }
    }
}