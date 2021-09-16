const cardsContainer = document.getElementById("cards-container");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const currentEl = document.getElementById("current");
const showBtn = document.getElementById("show");
const hideBtn = document.getElementById("hide");
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const addCardBtn = document.getElementById("add-card");
const clearBtn = document.getElementById("clear");
const addContainer = document.getElementById("add-container");

// Keep track of current card
let currentActiveCard = 0;

// Store DOM cards
const cardsEl = [];

// Store card data
const cardsData = getCardsData();

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

  // Add to DOM cards
  cardsEl.push(card);

  cardsContainer.appendChild(card);

  updateCurrentText();
}

// Show number of cards
function updateCurrentText() {
  currentEl.innerText = `${currentActiveCard + 1}/${cardsEl.length}`;
}

// Get cards from local storage
function getCardsData() {
  const cards = JSON.parse(localStorage.getItem("cards"));
  return cards === null ? [] : cards; // this is super important as we are adding there array into function that is returning array.
}

// Add card to local storage
function setCardsData(cards) {
  localStorage.setItem("cards", JSON.stringify(cards));
  window.location.reload();
}

createCards();

// Event listener

// Next button
nextBtn.addEventListener("click", () => {
  cardsEl[currentActiveCard].className = "card-memory left";

  currentActiveCard = currentActiveCard + 1;

  if (currentActiveCard > cardsEl.length - 1) {
    currentActiveCard = cardsEl.length - 1;
  }

  cardsEl[currentActiveCard].className = "card-memory active";

  updateCurrentText();
});

// Previous button
prevBtn.addEventListener("click", () => {
  cardsEl[currentActiveCard].className = "card-memory right";

  currentActiveCard = currentActiveCard - 1;

  if (currentActiveCard < 0) {
    currentActiveCard = 0;
  }

  cardsEl[currentActiveCard].className = "card-memory active";

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

  if (question.trim() && answer.trim()) {
    const newCard = { question, answer };

    createCard(newCard);

    questionEl.value = "";
    answerEl.value = "";

    addContainer.classList.remove("show");

    cardsData.push(newCard); // Here we are pushing new card into an arry that is created with the function getCardsData();
    setCardsData(cardsData); // Here we have to save always the whole complete array together with previously saved arrays from local storage, otherwise we will just save the one last card. Basically it is always updating in a loop. It takes previously saved items and saved them with one more newly added card.
  }
});

// Clear cards button
clearBtn.addEventListener("click", () => {
  localStorage.clear();
  cardsContainer.innerHTML = "";
  window.location.reload();
});
