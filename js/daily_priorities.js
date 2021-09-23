const checkBoxes = document.querySelectorAll(".checkBox");
const dailyCounter = document.querySelector("#dailyFive");
const clearBTN = document.querySelector("#clearBTN");

checkBoxes.forEach((checkBox) =>
  checkBox.addEventListener("change", () => {
    storeCheckData();
    updateDailyCounter();
  })
);

// Store data to LS
function storeCheckData() {
  const checkBoxPosition = [];
  for (var i = 0; i < checkBoxes.length; i++) {
    if (checkBoxes[i].checked) {
      checkBoxPosition.push({ position: i });
    }
    localStorage.setItem("checked tab", JSON.stringify(checkBoxPosition));
  }
}

// Load data from LS and set checkbox
function loadCheckData() {
  const checkedTabs = JSON.parse(localStorage.getItem("checked tab"));
  if (checkedTabs) {
    const checkedTabsPosition = checkedTabs.map((tab) => tab.position);
    checkedTabsPosition.forEach((position) => {
      checkBoxes[position].checked = "true";
    });
  }
}

// Update counter
function updateDailyCounter() {
  const checked = document.querySelectorAll(".checkBox:checked").length;
  dailyCounter.innerHTML = `${checked} / ${checkBoxes.length}`;
}

// Clear local storage
clearBTN.addEventListener("click", () => {
  localStorage.clear();
  window.location.reload();
});

loadCheckData();
updateDailyCounter();
