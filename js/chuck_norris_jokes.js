const jokeEl = document.getElementById("joke");
const jokeBtn = document.getElementById("jokeBTN");

jokeBtn.addEventListener("click", generateJoke);

generateJoke();

// USING ASYNC/AWAIT
async function generateJoke() {
  const res = await fetch("https://api.chucknorris.io/jokes/random");
  const data = await res.json();
  jokeEl.innerHTML = data.value;
}
