const apiKey = 'd46ab4fb451d039108fe7ce69d6d27f2';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');

function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

function saveSearchHistory(city) {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  searchHistory.push(city);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Function to retrieve search history from localStorage
function getSearchHistory() {
  return JSON.parse(localStorage.getItem('searchHistory')) || [];
}

// Update addToSearchHistory function to save history to localStorage
function addToSearchHistory(city) {
  const history = getSearchHistory();
  if (!history.includes(city)) {
    saveSearchHistory(city);
  }
  renderSearchHistory();
}

// Function to render search history
function renderSearchHistory() {
  searchHistory.innerHTML = '';
  const history = getSearchHistory();
  history.forEach(city => {
    const searchItem = document.createElement('div');
    searchItem.textContent = city;
    searchItem.classList.add('search-item');
    searchItem.addEventListener('click', function() {
      getWeather(city);
    });
    searchHistory.appendChild(searchItem);
  });
}

// Call renderSearchHistory on page load
renderSearchHistory();

searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
    cityInput.value = '';
  }
});


function getWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      showCurrentWeather(data);
      addToSearchHistory(data.city.name);
      if (data.list && data.list.length > 0) {
        const forecastData = data.list.filter(entry => entry.dt_txt.includes('12:00:00'));
        showForecast(forecastData);
      }
    })
    .catch(error => {
      console.error('Error fetching weather:', error);
      alert('City not found. Please try again.');
    });
}


function showCurrentWeather(data) {
  const celsiusTemp = data.list[0].main.temp;
  const fahrenheitTemp = celsiusToFahrenheit(celsiusTemp);

  currentWeather.innerHTML = `
    <div class="weather-card">
      <h2>${data.city.name} (${new Date().toLocaleDateString()})</h2>
      <img src="http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png" alt="${data.list[0].weather[0].description}">
      <p>Temperature: ${fahrenheitTemp}°F</p>
      <p>Humidity: ${data.list[0].main.humidity}%</p>
      <p>Wind Speed: ${data.list[0].wind.speed} m/s</p>
      </div>
      `;
      // <p>Date: ${new Date().toLocaleDateString()}</p>
}

function showForecast(forecastData) {
  forecast.innerHTML = ''; // Clear previous forecast data

  forecastData.forEach(day => {
    const forecastCard = document.createElement('div');
    forecastCard.classList.add('forecast-card');

    const date = new Date(day.dt * 1000); // Convert Unix timestamp to milliseconds
    const dateString = date.toLocaleDateString();

    const celsiusTemp = day.main.temp;
    const fahrenheitTemp = celsiusToFahrenheit(celsiusTemp);

    forecastCard.innerHTML = `
      <h3>${dateString}</h3>
      <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
      <p>Temperature: ${fahrenheitTemp}°F</p>
      <p>Humidity: ${day.main.humidity}%</p>
      <p>Wind Speed: ${day.wind.speed} m/s</p>
    `;

    forecast.appendChild(forecastCard);
  });
}


// function addToSearchHistory(city) {
//   const searchItem = document.createElement('div');
//   searchItem.textContent = city;
//   searchItem.classList.add('search-item');
//   searchItem.addEventListener('click', function() {
//     getWeather(city);
//   });
//   searchHistory.appendChild(searchItem);
// }

// You can add functions to fetch and display the forecast data as per your requirements.
