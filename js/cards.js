const cardsContainer = document.getElementById("cards-container");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const currentEl = document.getElementById("current");
const showBtn = document.getElementById("show");
const hideBtn = document.getElementById("hide");
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const addCardBtn = document.getElementById("add-card");
const clearAllBtn = document.getElementById("clear-all");
const addContainer = document.getElementById("add-container");
const cardsElements = document.getElementsByClassName("card-memory");

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Keep track of current card
let currentActiveCard = 0;

// Local Storage
// Get cards from local storage and concat with existing predefined cards
function getCardsData() {
  const cards = JSON.parse(localStorage.getItem("cards"));
  return cards === null ? [] : cards;
}

// Add card to local storage
function setCardsData(cards) {
  localStorage.setItem("cards", JSON.stringify(cards));
  window.location.reload();
}

// Show number of cards
function updateCurrentText() {
  currentEl.innerText = `${currentActiveCard + 1}/${cardsElements.length}`;
}

// Store card data
let cardsData = getCardsData();

// Create all cards
function createCards() {
  cardsData.forEach((data, index) => createCard(data, index));
}

// Create a single card in DOM
function createCard(data, index) {
  const card = document.createElement("div");
  card.classList.add("card-memory");
  card.classList.add("bg-primary");

  if (index === 0) {
    card.classList.add("active");
  }

  card.innerHTML = `
  <div class="inner-card">
  <div class="inner-card-front">
  <button class="btn btn-small btn-delete" onclick="removeCard(${data.cardId})">
    <i class="fas fa-times"></i>
  </button>
       <p>
       ${data.question}
       </p>
    </div>
    <div class="inner-card-back">
       <p>
       ${data.answer}
       </p>
    </div>
  </div>
  `;

  card.addEventListener("click", () => card.classList.toggle("show-answer"));

  cardsContainer.appendChild(card);

  updateCurrentText();
}


// Next button
nextBtn.addEventListener("click", () => {
  cardsElements[currentActiveCard].className = "card-memory left";

  currentActiveCard = currentActiveCard + 1;

  if (currentActiveCard > cardsElements.length - 1) {
    currentActiveCard = cardsElements.length - 1;
  }

  cardsElements[currentActiveCard].className = "card-memory active";

  updateCurrentText();
});

// Previous button
prevBtn.addEventListener("click", () => {
  cardsElements[currentActiveCard].className = "card-memory right";

  currentActiveCard = currentActiveCard - 1;

  if (currentActiveCard < 0) {
    currentActiveCard = 0;
  }

  cardsElements[currentActiveCard].className = "card-memory active";

  updateCurrentText();
});

// Show add container
showBtn.addEventListener("click", () => addContainer.classList.add("show"));

// Hide add container
hideBtn.addEventListener("click", () => addContainer.classList.remove("show"));

// Add new card
addCardBtn.addEventListener("click", () => {
  const question = questionEl.value;
  const answer = answerEl.value;
  const cardId = generateID();

  if (question.trim() && answer.trim()) {
    const newCard = { question, answer, cardId };

    createCard(newCard);

    questionEl.value = "";
    answerEl.value = "";

    addContainer.classList.remove("show");

    cardsData.push(newCard);
    setCardsData(cardsData);
  }
});

// Delete all cards
clearAllBtn.addEventListener("click", () => {
  localStorage.clear();
  cardsContainer.innerHTML = "";
  window.location.reload();
});

// Delete card by id
function removeCard(id) {
  cardsData = cardsData.filter((cardData) => cardData.cardId !== id);
  setCardsData(cardsData);
}

createCards();
