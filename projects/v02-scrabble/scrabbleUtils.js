// This module contains utility functions for the scrabble game.

// This imports the dictionary of scrabble words.
import { dictionary } from "./dictionary.js";

/**
 * This function checks whether a given word can be constructed with the
 * available tiles. The availableTiles object should not be modified.
 *
 * @param {object} availableTiles The available tiles to use.
 * @param {string} word The word to check.
 * @returns {boolean} Returns true if the word can be constructed with the given
 *                    tiles; false otherwise.
 */
function canConstructWord(availableTiles, word) {
    const copy = {};
    for (let letter in availableTiles) {
        copy[letter] = availableTiles[letter];
    }

    for (let letter of word) {
        if (letter in copy) {
            --copy[letter];

            if (copy[letter] === 0) {
                delete copy[letter];
            }
        } else {
            if ("*" in copy) {
                --copy["*"];

                if (copy["*"] === 0) {
                    delete copy["*"];
                }
            } else {
                return false;
            }
        }
    }

    return true;
}

/**
 * This function tries to build a word given a set of available tiles. It will
 * prioritize letter tiles over wildcards. It will return the list of tiles
 * used, or null if the word is not constructible with the given tiles.
 *
 * @param {Object<string, number>} availableTiles A collection of available
 * tiles and their amount.
 * @param {string} word The word a player wants to construct.
 * @returns {Array<string>} The letters used to construct the word, or null if
 * it is not constructible with the tiles.
 */
function constructWord(availableTiles, word) {
    const copy = {};
    for (let letter in availableTiles) {
        copy[letter] = availableTiles[letter];
    }

    const tiles = [];

    for (let letter of word) {
        if (letter in copy) {
            tiles.push(letter);
            --copy[letter];

            if (copy[letter] === 0) {
                delete copy[letter];
            }
        } else {
            if ("*" in copy) {
                tiles.push("*");
                --copy["*"];

                if (copy["*"] === 0) {
                    delete copy["*"];
                }
            } else {
                return null;
            }
        }
    }

    return tiles;
}

/**
 * We define the base score of a word the score obtained by adding each letter's
 * score, without taking board position into account. This function will compute
 * and return the base score of a given word.
 *
 * @param {string} word The word to compute a base score for.
 * @returns {number} The base score of the given word.
 */
function baseScore(word) {
    const scores = {
        "*": 0,
        a: 1,
        b: 3,
        c: 3,
        d: 2,
        e: 1,
        f: 4,
        g: 2,
        h: 4,
        i: 1,
        j: 8,
        k: 5,
        l: 1,
        m: 3,
        n: 1,
        o: 1,
        p: 3,
        q: 10,
        r: 1,
        s: 1,
        t: 1,
        u: 1,
        v: 4,
        w: 4,
        x: 8,
        y: 4,
        z: 10,
    };

    let score = 0;

    for (let letter of word) {
        score += scores[letter];
    }

    return score;
}

/**
 * Finds and returns every word from the dictionary that can be constructed with
 * the given tiles.
 *
 * @param {object} availableTiles The available tiles to use.
 * @returns {string[]} The words that can be constructed with the given tiles.
 */
function possibleWords(availableTiles) {
    const possibilities = [];

    // Let n be the size of the dictionary, m be the number of tiles in hand. This
    // implementation is not the fastest, O(nm). We could use permutations which
    // would execute in O(m!). It would theoretically be faster, since in standard
    // Scrabble, m is constant and equals 7. This other method would however scale
    // really bad with many wildcard tiles.
    for (let word of dictionary) {
        if (canConstructWord(availableTiles, word)) {
            possibilities.push(word);
        }
    }

    return possibilities;
}

/**
 * Finds and returns the word(s) with the highest base score from the
 * dictionary, given a set of available tiles.
 *
 * @param {object} availableTiles The available tiles to use.
 * @returns {string[]} The words with the highest base score.
 */
function bestPossibleWords(availableTiles) {
    const possibilities = possibleWords(availableTiles);

    let suggestions = [];
    let max = -1;

    for (let word of possibilities) {
        const score = baseScore(constructWord(availableTiles, word).join(""));
        if (score > max) {
            max = score;
            suggestions = [word];
        } else if (score === max) {
            suggestions.push(word);
        }
    }

    return suggestions;
}

/**
 * Determine if a word is valid (i.e. it is in the dictionary).
 *
 * @param {object} word The word will be played by the user, it can contain wildcards.
 * @returns {boolean} Returns true if the the word is valid (i.e. it is in the dictionary)
 */
function isValid(word) {
    // TODO: Implement this function.
    // Create an object of the word with the number of times each letter appears.
    let wordArr = word.split("");
    let wordObj = {};
    wordArr.forEach((letter) => {
        wordObj[letter] ? wordObj[letter]++ : (wordObj[letter] = 1);
    });
    // If there are no wildcards do a straight lookup in the dictionary.
    // Otherwise create an array of all possible words that can be made from the dictionary with the letters in the wordObj.
    // Then filter those words and only get the ones that have the same length as the word.
    let isWordValid = false;
    if (wordObj.hasOwnProperty("*")) {
        // Check if the word can be constructed in the dictionary.
        // Create an array of all possible words that can be made from the dictionary with the letters in the wordObj.
        let possibleWordsArr = possibleWords(wordObj);
        // Filter those words and only get the ones that have the same length as the word.
        possibleWordsArr = possibleWordsArr.filter(
            (dictionaryWord) => dictionaryWord.length === word.length
        );

        // Filter those words and only get the ones that have the same letter position as the original word.
        // taking into account the wildcards.
        possibleWordsArr = possibleWordsArr.filter((dictionaryWord) => {
            // Create an array of the dictionary word.
            let dictionaryWordArr = dictionaryWord.split("");
            let isLetterValid = true;

            // Loop through the dictionary word and compare each letter to the original word.
            // Only compare the letters that are not wildcards.
            dictionaryWordArr.forEach((letter, index) => {
                if (word[index] != letter && word[index] != "*") {
                    isLetterValid = false;
                }
            });
            // For the filter function to work we need to return a boolean.
            return isLetterValid;
        });
        // Testing
        // console.log("Filtered possible words:", possibleWordsArr);
        // console.log("Length of possible words:", possibleWordsArr.length);

        // If the array of possible words is not empty then the word is valid.
        possibleWordsArr.length > 0
            ? (isWordValid = true)
            : (isWordValid = false);
    } else {
        // Check if the word is in the dictionary.
        isWordValid = dictionary.includes(word);
        console.log("Is word valid:", isWordValid);
    }

    // Testing
    // console.log("Testing is valid:", wordObj);
    // console.log("Return value:", isWordValid);

    return isWordValid;
}

// This exports our public functions.
export {
    canConstructWord,
    constructWord,
    baseScore,
    possibleWords,
    bestPossibleWords,
    isValid,
};
