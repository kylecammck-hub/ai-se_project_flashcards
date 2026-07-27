/**
 * Decks fetched from the API. Populated at runtime in index.js after
 * calling getDecks(), and kept in sync as decks and cards are added,
 * updated, or removed.
 * @type {Array<object>}
 */
const fetchedDecks = [];

/**
 * Retrieves a deck object by its ID from the fetched decks array.
 * @param {string} deckId - The unique identifier of the deck to retrieve
 * @returns {object|undefined} The deck object if found, undefined otherwise
 */
function getDeckByID(deckId) {
    return fetchedDecks.find((deck) => deck._id === deckId);
}

export { fetchedDecks, getDeckByID };
