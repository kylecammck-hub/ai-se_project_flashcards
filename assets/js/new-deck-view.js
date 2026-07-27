import { fetchedDecks } from "./decks.js";
import { addDeck } from "./api.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

/**
 * Returns a consistent lowercase hex color string with a leading "#".
 * Accepts values with or without a leading "#". Returns "#64d583" as a
 * fallback if the value is missing or not a valid 6-digit hex.
 * @param {string|undefined} color
 * @returns {string}
 */
function normalizeColor(color) {
        if (!color) return "#64d583";
        const hex = color.startsWith("#") ? color.slice(1) : color;
        if (!HEX_DIGITS.test(hex)) return "#64d583";
        return "#" + hex.toLowerCase();
}

const newDeckFormEl = document.querySelector("#new-deck-form");
const submitBtnEl = document.querySelector("#new-deck-submit");
const jsonTextareaEl = document.querySelector("#new-deck-json");
const errorModalEl = document.querySelector("#new-deck-error-modal");
const errorMessageEl = errorModalEl.querySelector(".modal__message");
const errorCloseBtnEl = errorModalEl.querySelector(".modal__close-btn");

/**
 * Disables the new-deck form's submit button.
 * @returns {void}
 */
function disableSubmitBtn() {
        submitBtnEl.disabled = true;
}

/**
 * Displays the error modal with the given message.
 * @param {string} message
 * @returns {void}
 */
function showError(message) {
        errorMessageEl.textContent = message;
        errorModalEl.classList.add("modal_visible");
}

/**
 * Hides the error modal.
 * @returns {void}
 */
function closeErrorModal() {
        errorModalEl.classList.remove("modal_visible");
}

errorCloseBtnEl.addEventListener("click", closeErrorModal);

/**
 * Validates a deck name.
 * @param {*} name
 * @returns {string|null} The name if valid, otherwise null.
 */
function validateName(name) {
        if (typeof name !== "string" || name.length < 2 || name.length > 80) {
                  return null;
        }
        return name;
}

/**
 * Safely parses a JSON string.
 * @param {string} jsonString
 * @returns {*} The parsed value, or null if parsing failed.
 */
function parseJSON(jsonString) {
        try {
                  return JSON.parse(jsonString);
        } catch (error) {
                  return null;
        }
}

/**
 * Handles submission of the new-deck form: validates the input, sends the
 * new deck to the API, and navigates to the new deck's view on success.
 * @param {SubmitEvent} evt
 * @returns {void}
 */
function handleNewDeckSubmit(evt) {
        evt.preventDefault();

  const formData = new FormData(evt.target);
        const formValues = Object.fromEntries(formData);

  const jsonData = parseJSON(jsonTextareaEl.value);
        if (!jsonData) {
                  showError("That doesn't look like valid JSON. Please check the syntax and try again.");
                  return;
        }

  const name = validateName(jsonData.name);
        if (!name) {
                  showError("The deck needs a \"name\" field that is a string between 2 and 80 characters.");
                  return;
        }

  if (!Array.isArray(jsonData.cards)) {
            showError("The deck needs a \"cards\" field that is an array.");
            return;
  }

  const colorValue = normalizeColor(formValues["deck-color"]);

  if (typeof jsonData.color === "string" && jsonData.color.toLowerCase() !== colorValue) {
            showError("The JSON's color (" + jsonData.color + ") doesn't match the color you selected in the picker. Please make them match and try again.");
            return;
  }

  addDeck({ name, color: colorValue, cards: jsonData.cards })
          .then((newDeck) => {
                      fetchedDecks.push(newDeck);
                      window.location.hash = "deck/" + newDeck._id;
          })
          .catch(() => showError("Can't create deck. Please try again."));
}

newDeckFormEl.addEventListener("submit", handleNewDeckSubmit);

export { disableSubmitBtn, showError };
