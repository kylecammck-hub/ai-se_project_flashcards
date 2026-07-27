const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";

const headers = {
    "Content-Type": "application/json",
    Authorization: "019fa1d3-dbd4-720b-a359-d579e274b36a",
};

/**
 * Processes a fetch Response object, parsing it as JSON if the request
 * succeeded, or rejecting with the status code otherwise.
 * @param {Response} res - The Response object returned by fetch.
 * @returns {Promise<any>} A promise that resolves to the parsed JSON body.
 */
function processResponse(res) {
    if (res.ok) {
          return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
}

/**
 * Fetches all decks belonging to the authenticated user.
 * @returns {Promise<Array<object>>} A promise resolving to an array of decks.
 */
function getDecks() {
    return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

/**
 * Creates a new deck.
 * @param {object} deckData
 * @param {string} deckData.name - The name of the deck.
 * @param {string} deckData.color - The hex color of the deck.
 * @param {Array<{question: string, answer: string}>} deckData.cards - The initial cards for the deck.
 * @returns {Promise<object>} A promise resolving to the created deck object.
 */
function addDeck({ name, color, cards }) {
    return fetch(`${baseUrl}/decks`, {
          method: "POST",
          headers,
          body: JSON.stringify({ name, color, cards }),
    }).then(processResponse);
}

/**
 * Deletes a deck.
 * @param {string} deckId - The ID of the deck to delete.
 * @returns {Promise<object>} A promise resolving to a confirmation message.
 */
function deleteDeck(deckId) {
    return fetch(`${baseUrl}/decks/${deckId}`, {
          method: "DELETE",
          headers,
    }).then(processResponse);
}

/**
 * Creates a new card and associates it with a deck.
 * @param {string} deckId - The ID of the deck to add the card to.
 * @param {object} cardData
 * @param {string} cardData.question - The card's question text.
 * @param {string} cardData.answer - The card's answer text.
 * @returns {Promise<object>} A promise resolving to the created card object.
 */
function addCard(deckId, { question, answer }) {
    return fetch(`${baseUrl}/cards/${deckId}`, {
          method: "POST",
          headers,
          body: JSON.stringify({ question, answer }),
    }).then(processResponse);
}

/**
 * Updates an existing card's question and answer.
 * @param {string} cardId - The ID of the card to update.
 * @param {object} cardData
 * @param {string} cardData.question - The updated question text.
 * @param {string} cardData.answer - The updated answer text.
 * @returns {Promise<object>} A promise resolving to the updated card object.
 */
function updateCard(cardId, { question, answer }) {
    return fetch(`${baseUrl}/cards/${cardId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ question, answer }),
    }).then(processResponse);
}

/**
 * Deletes a card.
 * @param {string} cardId - The ID of the card to delete.
 * @returns {Promise<object>} A promise resolving to a confirmation message.
 */
function deleteCard(cardId) {
    return fetch(`${baseUrl}/cards/${cardId}`, {
          method: "DELETE",
          headers,
    }).then(processResponse);
}

export { getDecks, addDeck, deleteDeck, addCard, updateCard, deleteCard };
