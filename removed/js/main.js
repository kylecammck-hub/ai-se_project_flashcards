// Archived copy of original js/main.js
// Moved to /removed/js/main.js

// Original contents (archived):
// Minimal flashcards carousel starter
const cards = [
  { q: "What is the powerhouse of the cell?", a: "Mitochondria" },
  { q: "What carries genetic information?", a: "DNA" },
  { q: "Process plants use to convert sunlight?", a: "Photosynthesis" },
];
let index = 0;
const cardEl = document.getElementById("card");
const flipBtn = document.getElementById("flip");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

function render() {
  if (!cardEl) return;
  const front = cardEl.querySelector(".card__face--front");
  const back = cardEl.querySelector(".card__face--back");
  front.textContent = cards[index].q;
  back.textContent = cards[index].a;
  cardEl.classList.remove("is-flipped");
}

function flip() {
  if (!cardEl) return;
  cardEl.classList.toggle("is-flipped");
}

function prev() {
  index = (index - 1 + cards.length) % cards.length;
  render();
}
function next() {
  index = (index + 1) % cards.length;
  render();
}

if (flipBtn) flipBtn.addEventListener("click", flip);
if (prevBtn) prevBtn.addEventListener("click", prev);
if (nextBtn) nextBtn.addEventListener("click", next);

// keyboard support
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    flip();
  }
  if (e.key === "ArrowLeft") prev();
  if (e.key === "ArrowRight") next();
});

// initial render
render();
document.addEventListener("DOMContentLoaded", () => {
  console.log("Archived: starter scaffold loaded");
});
