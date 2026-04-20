import { hexToString, removeColorClasses } from "./colorMap.js";

const carouselSection = document.querySelector("#carousel");
const carouselTitle = document.querySelector(".carousel__title");
const carouselCard = document.querySelector(".carousel__card");
const carouselCardText = document.querySelector(".carousel__card-text");
const leftBtn = document.querySelector(".carousel__btn_type_left");
const rightBtn = document.querySelector(".carousel__btn_type_right");
const flipBtn = document.querySelector(".carousel__btn_type_flip");
const mainContent = document.querySelector(".page__main-content");

let currentIndex = 0;
let showingQuestion = true;

function getCarouselTitleString(deck, index) {
  return `${deck.name} \u00B7 Card ${index + 1} of ${deck.cards.length}`;
}

function updateDisplay(deck) {
  const currentCard = deck.cards[currentIndex];

  if (showingQuestion) {
    carouselCardText.textContent = currentCard.question;
    removeColorClasses(carouselCard);
    const color = hexToString(deck.color);
    carouselCard.classList.add(`carousel__card_color_${color}`);
  } else {
    carouselCardText.textContent = currentCard.answer;
    removeColorClasses(carouselCard);
    carouselCard.classList.add("carousel__card_color_white");
  }

  carouselTitle.textContent = getCarouselTitleString(deck, currentIndex);

  // Handle disabled states
  if (currentIndex === 0) {
    leftBtn.classList.add("carousel__btn_disabled");
  } else {
    leftBtn.classList.remove("carousel__btn_disabled");
  }

  if (currentIndex === deck.cards.length - 1) {
    rightBtn.classList.add("carousel__btn_disabled");
  } else {
    rightBtn.classList.remove("carousel__btn_disabled");
  }
}

export function renderCarouselView(deck) {
  currentIndex = 0;
  showingQuestion = true;

  // Show carousel, add modifier for different top margin
  carouselSection.style.display = "flex";
  mainContent.classList.add("page__main-content_type_carousel");

  // Set initial card color
  removeColorClasses(carouselCard);
  const color = hexToString(deck.color);
  carouselCard.classList.add(`carousel__card_color_${color}`);

  // Set initial display
  updateDisplay(deck);

  // Left button
  leftBtn.onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      showingQuestion = true;
      updateDisplay(deck);
    }
  };

  // Right button
  rightBtn.onclick = () => {
    if (currentIndex < deck.cards.length - 1) {
      currentIndex++;
      showingQuestion = true;
      updateDisplay(deck);
    }
  };

  // Flip button
  flipBtn.onclick = () => {
    showingQuestion = !showingQuestion;
    updateDisplay(deck);
  };
}