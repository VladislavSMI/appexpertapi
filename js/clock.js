const hourEl = document.querySelector(".hour");
const minuteEl = document.querySelector(".minute");
const secondEl = document.querySelector(".second");
const timeEl = document.querySelector(".time");
const dateEl = document.querySelector(".date");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function setTime() {
  const time = new Date();
  const month = time.getMonth();
  const day = time.getDay();
  const date = time.getDate();
  const hours = time.getHours();
  const hoursForClock = hours % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const secondsDeg = (360 / 100) * ((seconds / 60) * 100);
  const minutesDeg = (360 / 100) * ((minutes / 60) * 100);
  const hoursDeg = (360 / 100) * ((hours / 12) * 100);

  secondEl.style.transform = `translate(-50%, -100%) rotate(${secondsDeg}deg)`;
  minuteEl.style.transform = `translate(-50%, -100%) rotate(${minutesDeg}deg)`;
  hourEl.style.transform = `translate(-50%, -100%) rotate(${hoursDeg}deg)`;

  timeEl.innerHTML = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
  dateEl.innerHTML = `${days[day]}, ${months[month]} <span class="circle">${date}</span>`;

  // am / pm format
  // const ampm = hours >= 12 ? "PM" : "AM";
  // timeEl.innerHTML = `${hoursForClock}:${
  //   minutes < 10 ? `0${minutes}` : minutes
  // } ${ampm}`;
  // dateEl.innerHTML = `${days[day]}, ${months[month]} <span class="circle">${date}</span>`;
}

setTime();
setInterval(() => setTime(), 1000);