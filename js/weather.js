let weatherApiKey = config.WEATHER_API_KEY;

// Fetching Data from API
class Weather {
  constructor(city, state) {
    this.apiKey = weatherApiKey;
    this.city = city;
    this.state = state;
  }

  async getWeather() {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.state}&appid=${this.apiKey}`
    );

    const responseData = await response.json();

    return responseData;
  }

  // Change weather location
  changeLocation(city, state) {
    this.city = city;
    this.state = state;
  }
}

// Checking for stored data
class Storage {
  constructor() {
    this.city;
    this.state;
    this.defaultCity = "Luxembourg";
    this.defaultState = "LUX";
  }

  getLocationData() {
    if (localStorage.getItem("city") === null) {
      this.city = this.defaultCity;
    } else {
      this.city = localStorage.getItem("city");
    }

    if (localStorage.getItem("state") === null) {
      this.state = this.defaultState;
    } else {
      this.state = localStorage.getItem("state");
    }

    return {
      city: this.city,
      state: this.state,
    };
  }

  setLocationData(city, state) {
    localStorage.setItem("city", city);
    localStorage.setItem("state", state);
  }
}

class UI {
  constructor() {
    this.location = document.getElementById("w-location");
    this.desc = document.getElementById("w-desc");
    this.string = document.getElementById("w-string");
    this.icon = document.getElementById("w-icon");
    this.details = document.getElementById("w-details");
    this.descLong = document.getElementById("w-descLong");
    this.humidity = document.getElementById("w-humidity");
    this.pressure = document.getElementById("w-pressure");
    this.wind = document.getElementById("w-wind");
  }

  paint(weather) {
    this.location.textContent = weather.name;
    this.desc.textContent = weather.weather[0].main;
    this.string.innerHTML = `${(weather.main.temp - 273.15).toFixed(
      0
    )} <span>&#8451;</span>`;
    this.icon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    );
    this.descLong.textContent = capitalizeFirstLetter(
      weather.weather[0].description
    );
    this.humidity.textContent = `Relative Humidity: ${weather.main.humidity}`;
    this.pressure.textContent = `Pressure: ${weather.main.pressure}`;
    this.wind.textContent = `Wind speed m/s: ${weather.wind.speed}`;

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }
}

// App
// Init storage
const storage = new Storage();
// Get stored location data
const weatherLocation = storage.getLocationData();
// Init Weather object
const weather = new Weather(weatherLocation.city, weatherLocation.state);
// Init UI object
const ui = new UI();

// Get weather on DOM load
document.addEventListener("DOMContentLoaded", getWeather);

// Change location event
document.getElementById("w-change-btn").addEventListener("click", (e) => {
  e.preventDefault();
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;

  // Change location
  weather.changeLocation(city, state);

  // Set location in LS
  storage.setLocationData(city, state);

  // Get and display weather
  getWeather();
});

// getweather method return promis, because we used async
function getWeather() {
  weather
    .getWeather()
    .then((results) => {
      ui.paint(results);
    })
    .catch((err) => console.log(err));
}
