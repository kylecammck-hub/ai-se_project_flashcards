import { decks } from "./decks.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

/**
 * Converts a string to a URL-safe slug: lowercase with any run of
 * non-alphanumeric characters replaced by a single hyphen, and no leading or
 * trailing hyphens.
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
      return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

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

function disableSubmitBtn() {
      submitBtnEl.disabled = true;
}

/**
 * Displays the new-deck error modal with the given message.
 * @param {string} message
 */
function showError(message) {
      errorMessageEl.textContent = message;
      errorModalEl.classList.add("modal_visible");
}

function closeErrorModal() {
      errorModalEl.classList.remove("modal_visible");
}

errorCloseBtnEl.addEventListener("click", closeErrorModal);

function validateName(name) {
      if (typeof name !== "string" || name.length < 2 || name.length > 80) {
              return null;
      }
      return name;
}

function parseJSON(jsonString) {
      try {
              return JSON.parse(jsonString);
      } catch (error) {
              return null;
      }
}

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

  const id = slugify(name) + "-" + Date.now();

  decks.push({
          id,
          color: colorValue,
          name,
          cards: jsonData.cards,
  });

  window.location.hash = "deck/" + id;
}

newDeckFormEl.addEventListener("submit", handleNewDeckSubmit);

export { disableSubmitBtn };
