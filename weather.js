const weatherBox = document.getElementById('weather');
const apiKey = 'd70b6bce1b0cd6d45832dedb4dd6e978'; // Your OpenWeatherMap API key

// Show current weather data in the weatherBox
function showWeatherData(data) {
  const temp = data.main.temp;
  const city = data.name;
  const desc = data.weather[0].description;

  weatherBox.innerHTML = `
    <p><strong>Location:</strong> ${city}</p>
    <p><strong>Temperature:</strong> ${temp}°C</p>
    <p><strong>Condition:</strong> ${desc}</p>
  `;
}

// Fetch and show current weather by city name
function getWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      showWeatherData(data);
      getForecast(city);
    })
    .catch(() => {
      weatherBox.innerHTML = `<p>City not found. Please try again.</p>`;
    });
}

// Fetch and show current weather by coordinates
function getWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      showWeatherData(data);
      getForecast(data.name);
    })
    .catch(() => {
      weatherBox.innerHTML = `<p>Could not fetch weather data.</p>`;
    });
}

// Fetch and show 5-day forecast by city name
function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const forecastContainer = document.getElementById('forecast-cards');
      forecastContainer.innerHTML = '';

      const forecastList = data.list;
      const dailyForecasts = {};

      forecastList.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        const time = item.dt_txt.split(' ')[1];

        if (time === "12:00:00" && !dailyForecasts[date]) {
          dailyForecasts[date] = item;
        }
      });

      Object.keys(dailyForecasts).forEach(date => {
        const item = dailyForecasts[date];
        const temp = item.main.temp;
        const icon = item.weather[0].icon;
        const desc = item.weather[0].description;
        const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        forecastContainer.innerHTML += `
          <div class="forecast-card">
            <p><strong>${date}</strong></p>
            <img src="${iconURL}" alt="icon">
            <p>${Math.round(temp)}°C</p>
            <p>${desc}</p>
          </div>
        `;
      });
    })
    .catch(error => {
      console.error("Forecast error:", error);
      document.getElementById('forecast-cards').innerHTML = `<p>Unable to load forecast.</p>`;
    });
}

// Detect user location and fetch weather + forecast
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByCoords(lat, lon);
      },
      error => {
        weatherBox.innerHTML = `<p>Location access denied.</p>`;
      }
    );
  } else {
    weatherBox.innerHTML = `<p>Geolocation not supported by your browser.</p>`;
  }
}

// Start everything
getLocation();

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherByCity(city);
  }
});
function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const forecastContainer = document.getElementById('forecast-cards');
      forecastContainer.innerHTML = '';

      const forecastList = data.list;
      const dailyForecasts = {};

      forecastList.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        const time = item.dt_txt.split(' ')[1];

        if (time === "12:00:00" && !dailyForecasts[date]) {
          dailyForecasts[date] = item;
        }
      });

      Object.keys(dailyForecasts).forEach(date => {
        const item = dailyForecasts[date];
        const temp = item.main.temp;
        const icon = item.weather[0].icon;
        const desc = item.weather[0].description;
        const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        forecastContainer.innerHTML += `
          <div class="forecast-card">
            <p><strong>${date}</strong></p>
            <img src="${iconURL}" alt="icon">
            <p>${Math.round(temp)}°C</p>
            <p>${desc}</p>
          </div>
        `;
      });

      // HOURLY FORECAST (Next 6 time slots ~18 hours)
      const hourlyContainer = document.getElementById('hourly-cards');
      hourlyContainer.innerHTML = '';

      const nextHours = forecastList.slice(0, 6); // Next 6 time points

      nextHours.forEach(item => {
        const time = item.dt_txt.split(' ')[1].slice(0, 5); // HH:MM
        const temp = item.main.temp;
        const icon = item.weather[0].icon;
        const desc = item.weather[0].main;
        const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        hourlyContainer.innerHTML += `
          <div class="hourly-card">
            <p>${time}</p>
            <img src="${iconURL}" alt="icon" />
            <p>${Math.round(temp)}°C</p>
            <p>${desc}</p>
          </div>
        `;
      });

    })
    .catch(error => {
      console.error("Forecast error:", error);
      document.getElementById('forecast-cards').innerHTML = `<p>Unable to load forecast.</p>`;
    });
}



