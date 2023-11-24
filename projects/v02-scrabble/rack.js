export class Rack {
    constructor() {
        this.available = {};
    }

    /**
     * Returns an object of available tiles mapped to their amount.
     *
     * @returns {Object<string, number>} An object describing the tiles available
     * in this rack.
     */
    getAvailableTiles() {
        return this.available;
    }

    setAvailableTiles(available) {
        this.available = available;
    }

    /**
     * This function will draw n tiles from the game's bag. If there are not
     * enough tiles in the bag, this should take all the remaining ones.
     *
     * @param {number} n The number of tiles to take from the bag.
     * @param {Game} game The game whose bag to take the tiles from.
     */
    takeFromBag(n, game) {
        for (let tile of game.takeFromBag(n)) {
            if (tile in this.available) {
                ++this.available[tile];
            } else {
                this.available[tile] = 1;
            }
        }
    }

    /**
     * Renders the rack with the tiles available.
     *
     * @param {HTMLElement} element The element to render the rack in.
     *
     */
    render(element) {
        // If the rack is already rendered, empty it.
        if (
            ("document.getElementById(1)", document.getElementById("1") != null)
        ) {
            for (let i = 1; i < 8; i++) {
                let parent = document.getElementById("rack");
                let child = document.getElementById(i);
                parent.removeChild(child);
            }
        }

        // Render the rack.
        let getAvailableTiles = this.available;
        let idTracker = 0;
        for (let tile in getAvailableTiles) {
            for (let i = 0; i < getAvailableTiles[tile]; i++) {
                const div = document.createElement("div");
                div.classList.add("grid-item");
                idTracker += 1;
                div.setAttribute("id", idTracker);
                div.textContent = tile;
                element.appendChild(div);
            }
        }
    }
    /**
     * Removes the tiles from the rack.
     *
     * @param {object} wordToTiles An object mapping the tiles to be removed.
     *
     */
    removeTitles(wordToTiles) {
        // Testing
        // console.log("Remove The following tiles from the rack: ", wordToTiles);
        // console.log("this.available before: ", this.available);

        // Remove the tiles from the rack.
        for (let tile in wordToTiles) {
            // For each tile, remove the number of tiles from the rack.
            for (let i = 0; i < wordToTiles[tile]; i++) {
                console.log("tile: ", this.available[tile]);
                // If the tile is not a wildcard.
                if (tile in this.available) {
                    if (this.available[tile] === 1) {
                        delete this.available[tile];
                    } else {
                        this.available[tile] -= 1;
                    }
                } else {
                    // for wildcards
                    if (this.available["*"] === 1) {
                        delete this.available["*"];
                    } else {
                        this.available["*"] -= 1;
                    }
                }
            }
        }
        // console.log("this.available after: ", this.available);
    }
}
