import { showError } from "./new-deck-view.js";
import { renderCarouselView } from "./carousel.js";
import { fetchedDecks, getDeckByID } from "./decks.js";
import { hexToString } from "./colorMap.js";
import {
      getDecks,
      deleteDeck,
      addCard,
      updateCard,
      deleteCard,
} from "./api.js";

const deckTemplate = document.querySelector("#deck-template");
const decksList = document.querySelector(".decks__list");
const carouselSection = document.querySelector("#carousel");
const mainContent = document.querySelector(".page__main-content");
const homeSection = document.querySelector("#home");
const notFoundSection = document.querySelector("#not-found");
const deckSection = document.querySelector("#deck");
const newDeckSection = document.querySelector("#new-deck");
const mobileBar = document.querySelector(".mobile-bar");

const sections = [homeSection, carouselSection, notFoundSection, deckSection, newDeckSection];

/**
 * Shows the given section and hides all other tracked sections.
 * @param {HTMLElement} currentSection - The section element to display.
 * @param {string} display - The CSS display value to apply to the shown section.
 * @returns {void}
 */
function showView(currentSection, display) {
        sections.forEach((section) => {
                    section.style.display = "none";
        });
        mainContent.classList.remove("page__main-content_type_carousel");
        currentSection.style.display = display;
}

/**
 * Builds a deck list-item element for the given deck, wiring up its delete
 * button to remove the deck through the API.
 * @param {object} item - The deck object.
 * @returns {HTMLElement} The populated deck element.
 */
function createDeckEl(item) {
        const deckEl = deckTemplate.content.cloneNode(true).querySelector(".deck");
        deckEl.querySelector(".deck__title").textContent = item.name;

    const color = hexToString(item.color);
        deckEl.classList.add(`deck_color_${color}`);

    const deleteBtn = deckEl.querySelector(".deck__delete-btn");
        deleteBtn.addEventListener("click", () => {
                    deleteDeck(item._id)
                        .then(() => {
                                            deckEl.remove();
                                            const index = fetchedDecks.findIndex((deck) => deck._id === item._id);
                                            if (index !== -1) {
                                                                    fetchedDecks.splice(index, 1);
                                            }
                        })
                        .catch(() => showError("Can't delete deck. Please try again."));
        });

    deckEl.querySelector(".deck__count").textContent = `${item.cards.length} cards`;
        deckEl.querySelector(".deck__link").href = `#deck/${item._id}`;

    return deckEl;
}

/**
 * Creates and appends a deck element to the deck list for the given deck.
 * @param {object} item - The deck object to render.
 * @returns {void}
 */
function renderDeckEl(item) {
        const deckEl = createDeckEl(item);
        decksList.append(deckEl);
}

const cardTemplate = document.querySelector("#card-template");
const deckViewList = document.querySelector(".deck-view__list");
const deckViewTitle = document.querySelector(".deck-view__title");
const practiceBtn = document.querySelector(".deck-view__practice-btn");

/**
 * Builds a card list-item element for the given card, wiring up its edit and
 * delete buttons to persist changes through the API.
 * @param {object} deck - The deck the card belongs to.
 * @param {object} card - The card object.
 * @returns {HTMLElement} The populated card element.
 */
function createCardEl(deck, card) {
        const cardEl = cardTemplate.content.cloneNode(true).querySelector(".card");
        cardEl.classList.add(`card_color_${hexToString(deck.color)}`);
        cardEl.querySelector(".card__text").textContent = card.question;

    cardEl.querySelector(".card__delete-btn").addEventListener("click", () => {
                deleteCard(card._id)
                    .then(() => {
                                        cardEl.remove();
                                        const index = deck.cards.findIndex((c) => c._id === card._id);
                                        if (index !== -1) {
                                                                deck.cards.splice(index, 1);
                                        }
                    })
                    .catch(() => showError("Can't delete card. Please try again."));
    });

    cardEl.querySelector(".card__edit-btn").addEventListener("click", () => {
                const newQuestion = window.prompt("Edit the card's question:", card.question);
                if (!newQuestion) return;
                const newAnswer = window.prompt("Edit the card's answer:", card.answer);
                if (!newAnswer) return;

                                                                     updateCard(card._id, { question: newQuestion, answer: newAnswer })
                    .then((updatedCard) => {
                                        card.question = updatedCard.question;
                                        card.answer = updatedCard.answer;
                                        cardEl.querySelector(".card__text").textContent = updatedCard.question;
                    })
                    .catch(() => showError("Can't update card. Please try again."));
    });

    return cardEl;
}

/**
 * Prompts the user for a new card's question and answer, then adds it to the
 * given deck through the API and renders it.
 * @param {object} deck - The deck to add the card to.
 * @returns {void}
 */
function handleAddCard(deck) {
        const question = window.prompt("Enter the card's question:");
        if (!question) return;
        const answer = window.prompt("Enter the card's answer:");
        if (!answer) return;

    addCard(deck._id, { question, answer })
            .then((newCard) => {
                            deck.cards.push(newCard);
                            deckViewList.append(createCardEl(deck, newCard));
            })
            .catch(() => showError("Can't add card. Please try again."));
}

/**
 * Renders the deck-view page for the given deck, including its cards and the
 * "add card" and "practice" controls.
 * @param {object} deck - The deck to render.
 * @returns {void}
 */
function renderDeckView(deck) {
        deckViewTitle.textContent = deck.name;
        deckViewList.innerHTML = "";

    deck.cards.forEach((card) => {
                const cardEl = createCardEl(deck, card);
                deckViewList.append(cardEl);
    });

    document.querySelectorAll(".deck-view__new-card-btn").forEach((btn) => {
                btn.onclick = () => handleAddCard(deck);
    });

    practiceBtn.onclick = () => {
                window.location.hash = `#carousel/${deck._id}`;
    };
}

/**
 * Reads the current URL hash and shows the corresponding view, fetching and
 * rendering deck/card data as needed.
 * @returns {void}
 */
function handleRoute() {
        const hash = window.location.hash.slice(1) || "home";

    if (hash === "home") {
                showView(homeSection, "");
                mobileBar.innerHTML = `<button class="mobile-bar__new-deck-btn" type="button">+ New Deck</button>`;
                mobileBar.classList.remove("mobile-bar_hidden");
    } else if (hash === "new-deck") {
                showView(newDeckSection, "");
                mobileBar.classList.add("mobile-bar_hidden");
    } else if (hash.startsWith("deck/")) {
                const deckId = hash.split("/")[1];
                const deck = getDeckByID(deckId);
                if (deck) {
                                showView(deckSection, "");
                                renderDeckView(deck);
                                mobileBar.innerHTML = `
                                                <button class="mobile-bar__btn mobile-bar__btn_type_secondary" type="button">+ New Card</button>
                                                                <button class="mobile-bar__btn" type="button">Practice</button>
                                                                            `;
                                mobileBar.classList.remove("mobile-bar_hidden");
                                mobileBar.querySelector(".mobile-bar__btn_type_secondary").onclick = () => handleAddCard(deck);
                                mobileBar.querySelector(".mobile-bar__btn:last-child").onclick = () => {
                                                    window.location.hash = `#carousel/${deck._id}`;
                                };
                } else {
                                showView(notFoundSection, "");
                }
    } else if (hash.startsWith("carousel/")) {
                showView(carouselSection, "");
                mainContent.classList.add("page__main-content_type_carousel");
                const deckId = hash.split("/")[1];
                const deck = getDeckByID(deckId);
                renderCarouselView(deck);
                mobileBar.classList.add("mobile-bar_hidden");
    } else {
                showView(notFoundSection, "");
    }
}

window.addEventListener("hashchange", handleRoute);

getDecks()
    .then((decks) => {
                fetchedDecks.push(...decks);
                fetchedDecks.forEach(renderDeckEl);
    })
    .catch(() => showError("Can't fetch decks. Please refresh and try again."))
    .finally(() => {
                handleRoute();
    });

document.querySelector("#home .decks__new-deck-btn").addEventListener("click", () => {
        window.location.hash = "new-deck";
});
