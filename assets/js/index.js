import { renderCarouselView } from "./carousel.js";
import { decks, getDeckByID } from "./decks.js";
import { hexToString } from "./colorMap.js";
const deckTemplate = document.querySelector("#deck-template");
const decksList = document.querySelector(".decks__list");
const carouselSection = document.querySelector("#carousel");
const mainContent = document.querySelector(".page__main-content");


function createDeckEl(item) {

  const deckEl = deckTemplate.content.cloneNode(true).querySelector(".deck");
  deckEl.querySelector(".deck__title").textContent = item.name;

  const color = hexToString(item.color);
  deckEl.classList.add(`deck_color_${color}`);
  const deleteBtn = deckEl.querySelector(".deck__delete-btn");
  deleteBtn.addEventListener("click", () => {
    deckEl.remove();
  });
deckEl.querySelector(".deck__count").textContent = `${item.cards.length} cards`;
deckEl.querySelector(".deck__link").href = `#carousel/${item.id}`;
return deckEl;
}

function renderDeckEl(item) {
  const deckEl = createDeckEl(item);
  decksList.append(deckEl);
}

decks.forEach(renderDeckEl);
const homeSection = document.querySelector("#home");
const notFoundSection = document.querySelector("#not-found");

function handleRoute() {
  const hash = window.location.hash.slice(1) || "home";

  // Hide all sections
  homeSection.style.display = "none";
  notFoundSection.style.display = "none";
  carouselSection.style.display = "none";
  mainContent.classList.remove("page__main-content_type_carousel");

  if (hash === "home") {
    homeSection.style.display = "";
  } else if (hash.startsWith("carousel/")) {
    const deckId = hash.split("/")[1];
    const deck = getDeckByID(deckId);
    renderCarouselView(deck);
  } else {
    notFoundSection.style.display = "";
  }
}

window.addEventListener("hashchange", handleRoute);
handleRoute();