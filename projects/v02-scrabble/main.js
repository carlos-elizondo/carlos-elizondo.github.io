import { Game } from "./game.js";
import { Rack } from "./rack.js";
import * as scrabbleUtils from "./scrabbleUtils.js";

// Initialize the game
const game = new Game();
game.render(document.getElementById("board"));

// Initialize the rack
const rack = new Rack();

// Initialize the hint
const help = document.getElementById("help");

// Testing
const possibleWords = scrabbleUtils.possibleWords(rack.getAvailableTiles());

function saveState() {
    //   Use the localStorage object to store the state. Make sure you use
    //   JSON.stringify() to convert the state to a string.

    // Creating an object to store the state for the game and rack
    const gameState = {
        bagState: game.bag,
        gridState: game.grid,
        rackState: rack.getAvailableTiles(),
    };

    // Saving the state object to local storage
    localStorage.setItem("gameState", JSON.stringify(gameState));
}

function restoreState() {
    //   Use the localStorage object to restore the state. Make sure you use the
    //   JSON.parse() method to convert the state string to an object.

    // Getting the state object from local storage
    const gameState = JSON.parse(localStorage.getItem("gameState"));

    // Testing
    // console.log("gameState:bagState \n", gameState.bagState);
    // console.log("gameState:gridState \n", gameState.gridState);

    // Setting the state of the grid, bag, and rack
    game.bag = gameState.bagState;
    game.grid = gameState.gridState;
    rack.setAvailableTiles(gameState.rackState);

    // Testing
    // console.log("game:bag \n", game.bag);
    // console.log("game:grid \n", game.grid);

    //Render
    game.render(document.getElementById("board"));
    rack.render(document.getElementById("rack"));
}

// Call restoreState() to restore the state of the text boxes.
// This will restore the state of the app when loaded/reloaded.
if (localStorage.length > 0) {
    window.addEventListener("load", restoreState);
} else {
    rack.takeFromBag(7, game);
    rack.render(document.getElementById("rack"));
}

const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", () => {
    // Clear local storage
    localStorage.clear();

    // Reset the game
    const newGame = new Game();
    game.bag = newGame.bag;
    game.grid = newGame.grid;

    // Reset hint
    hint.textContent = "";
    // Render the game
    game.render(document.getElementById("board"));
});

// Helper event listener
// When input of word is changed display the possible words
document.getElementById("word").addEventListener("input", () => {
    const word = document.getElementById("word").value.toLowerCase();
    console.log("word: ", word);
    // let testObj = { a: 1, b: 2, c: 3, d: null, e: undefined };
    // console.log("testObj[a]: ", testObj["a"]);
    // console.log("testObj[d]: ", testObj["e"]);
});

// Play button event listener
document.getElementById("play").addEventListener("click", () => {
    const word = document.getElementById("word").value.toLowerCase();
    const x = parseInt(document.getElementById("x").value);
    const y = parseInt(document.getElementById("y").value);
    const direction =
        document.getElementById("direction").value === "horizontal";
    let wordToTiles = {};
    word.split("").forEach((letter) => {
        if (wordToTiles[letter]) {
            wordToTiles[letter] += 1;
        } else {
            wordToTiles[letter] = 1;
        }
    });
    // Testing:
    // console.log("Bag contents: \n", game.bag);
    // console.log("Grid contents: \n", game.grid);
    console.log("Word To Tiles: ", wordToTiles);

    // Play
    if (
        scrabbleUtils.isValid(word) &&
        scrabbleUtils.canConstructWord(rack.getAvailableTiles(), word)
    ) {
        // Play Word
        if (x <= 0 || y <= 0 || x > 15 || y > 15) {
            window.alert("Out of range: Check position (x/y)!");
        } else if (game.playAt(word, { x, y }, direction) != -1) {
            // Update rack and re-render it
            rack.removeTitles(wordToTiles);
            let numOfTilesToTake = word.length;
            rack.takeFromBag(numOfTilesToTake, game);
            rack.render(document.getElementById("rack"));
            // const possibleWords = scrabbleUtils.possibleWords(
            //     rack.getAvailableTiles()
            // );
            // console.log("Possible Words: \n", possibleWords);
        } else {
            window.alert("Overlapping: Check position (x/y)!");
        }
    } else {
        window.alert("Invalid word!");
    }
    // Once the play is done, save the state
    saveState();

    //Render
    game.render(document.getElementById("board"));
});

// Help button event listener
help.addEventListener("click", () => {
    // console.log("Does it even tickle?");
    const hint = document.getElementById("hint");
    let bestPossibleWordsArr = scrabbleUtils.bestPossibleWords(
        rack.getAvailableTiles()
    );
    let random = Math.floor(Math.random() * bestPossibleWordsArr.length);
    console.log("Best Possible Words: ", bestPossibleWordsArr);
    hint.textContent = "Hint: " + bestPossibleWordsArr[random];
});
