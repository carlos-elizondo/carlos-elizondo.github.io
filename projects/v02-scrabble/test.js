import { Game } from "./game.js";
import { Rack } from "./rack.js";
import {
    canConstructWord,
    constructWord,
    baseScore,
    possibleWords,
    bestPossibleWords,
    isValid,
} from "./scrabbleUtils.js";

// console.log(shuffle([1, 2, 3, 4, 5])); // this should produce a different sequence each time
let g = new Game();
let r = new Rack();

// YOUR TESTS GO HERE
// Tests for the constructor in game.js question 1
console.assert(g.bag.length === 100, "Bag should have 100 tiles");
console.assert(
    typeof g.bag[0] === "string",
    "Bag should be an array of strings"
);
// console.assert(g.grid.length === 15, "Grid should have 15 columns");
// console.assert(g.grid[0].length === 15, "Grid should have 15 rows");
// console.assert(
//     g.grid[0][0] === null,
//     "Grid rows should be initialized with nulls"
// );

// Tests for the _canBePlacedOnBoard in game.js question 2
// direction = true => horizontal
// direction = false => vertical
// console.assert(
//     g._canBePlacedOnBoard("123456789123456", { x: 1, y: 1 }, true),
//     "Should be able to place a 15 letter word horizontally from the start"
// );
// console.assert(
//     g._canBePlacedOnBoard("123456789123456", { x: 1, y: 1 }, false),
//     "Should be able to place a 15 letter word vertically from the start"
// );
// console.assert(
//     g._canBePlacedOnBoard("1234567891234567", { x: 1, y: 1 }, true) === false,
//     "Should not be able to place a 16 letter word horizontally from the start"
// );
// console.assert(
//     g._canBePlacedOnBoard("1234567891234567", { x: 1, y: 1 }, false) === false,
//     "Should not be able to place a 16 letter word horizontally from the start"
// );
// console.assert(
//     g._canBePlacedOnBoard("1234", { x: 12, y: 1 }, true),
//     "Should be able to place a 4 letter word horizontally from position x = 11"
// );
// console.assert(
//     g._canBePlacedOnBoard("1234", { x: 13, y: 1 }, true) === false,
//     "Should not be able to place a 4 letter word horizontally from position x = 12"
// );
// console.assert(
//     g._canBePlacedOnBoard("1234", { x: 1, y: 12 }, false),
//     "Should be able to place a 4 letter word vertically from position x = 11"
// );
// console.assert(
//     g._canBePlacedOnBoard("1234", { x: 1, y: 13 }, false) === false,
//     "Should not be able to place a 4 letter word vertically from position x = 12"
// );
// // Tests for the _placeOnBoard in game.js question 2
// console.assert(
//     g._placeOnBoard("Hello", { x: 1, y: 1 }, true),
//     "Should be able to place a 5 letter word horizontally from the start"
// );
// console.assert(
//     g._placeOnBoard("Hello", { x: 1, y: 2 }, false),
//     "Should be able to place a 5 letter word horizontally from the start"
// );
console.log(g.grid);
// Tests for takenFromBag in game.js question 3
console.assert(
    g.takeFromBag(10).length === 10,
    "Should take 10 tiles from bag"
);
console.assert(
    g.takeFromBag(100).length === 90,
    "Should take 100 tiles from bag however there are only 90 left"
);
console.assert(
    g.takeFromBag(1).length === 0,
    "Should take 1 tiles from bag however there are none left"
);
// Tests for Rack in rack.js question 4
let g2 = new Game();
// console.log("this.bag2: ", g2.bag);
let g2First = {};
g2.bag.slice(0, 10).forEach((tile) => {
    if (tile in g2First) {
        g2First[tile]++;
    } else {
        g2First[tile] = 1;
    }
});
// console.log(g2First);
r.takeFromBag(10, g2);
console.assert(
    JSON.stringify(r.getAvailableTiles()) === JSON.stringify(g2First),
    "Should take 10 tiles from the g2First bag and be the same as the rack.getAvailableTiles()"
);
// console.log(r.getAvailableTiles());

// Testing isValid
console.assert(
    isValid("he**o"),
    "he**o, with wildcards, should be a valid word"
);
console.assert(isValid("hello"), "hello should be a valid word");

// Testing Rack's render method
let r2 = new Rack();
let g3 = new Game();
r2.takeFromBag(7, g3);
// r2.render(document.getElementById("rack"));
