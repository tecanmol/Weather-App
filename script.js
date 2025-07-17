const form = document.querySelector("form");
const input = document.querySelector("#InputCity");

function getIconName(weather, icon) {
    // weather: data.weather[0].main (e.g., "Clear", "Clouds", "Rain", etc.)
    // icon: data.weather[0].icon (e.g., "01d", "01n", etc.)

    const isDay = icon && icon.includes('d');
    switch (weather) {
        case "Clear":
            return isDay ? "clear-day" : "clear-night";
        case "Clouds":
            // You can get more specific with icon codes if you want
            // 02: few clouds, 03: scattered, 04: broken/overcast
            if (icon.startsWith("02")) return isDay ? "cloudy-1-day" : "cloudy-1-night";
            if (icon.startsWith("03")) return isDay ? "cloudy-2-day" : "cloudy-2-night";
            if (icon.startsWith("04")) return isDay ? "cloudy-3-day" : "cloudy-3-night";
            return "cloudy";
        case "Rain":
        case "Drizzle":
            // 09: shower rain, 10: rain
            if (icon.startsWith("09")) return isDay ? "rainy-2-day" : "rainy-2-night";
            if (icon.startsWith("10")) return isDay ? "rainy-1-day" : "rainy-1-night";
            return isDay ? "rainy-1-day" : "rainy-1-night";
        case "Thunderstorm":
            // 11: thunderstorm
            if (icon.startsWith("11")) return isDay ? "scattered-thunderstorms-day" : "scattered-thunderstorms-night";
            return "thunderstorms";
        case "Snow":
            // 13: snow
            if (icon.startsWith("13")) return isDay ? "snowy-1-day" : "snowy-1-night";
            return isDay ? "snowy-1-day" : "snowy-1-night";
        case "Mist":
        case "Smoke":
        case "Haze":
        case "Dust":
        case "Fog":
        case "Sand":
        case "Ash":
            // 50: mist, fog, etc.
            if (weather === "Fog" || weather === "Mist") return isDay ? "fog-day" : "fog-night";
            if (weather === "Haze") return isDay ? "haze-day" : "haze-night";
            if (weather === "Dust" || weather === "Sand" || weather === "Ash") return "dust";
            return "fog";
        case "Squall":
        case "Tornado":
            return "tornado";
        case "Hurricane":
            return "hurricane";
        default:
            return "cloudy";
    }
}

form.addEventListener("submit", (e)=>{
    e.preventDefault(); 
  const city = input.value.trim();
    if (!city) return;

    const apiKey = "0ea267ac45b2740578cdc1367227ca27";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      const weatherDiv = document.getElementById('WeatherInfo');
            const weatherMain = data.weather[0].main;
            const weatherIcon = data.weather[0].icon;
            const iconName = getIconName(weatherMain, weatherIcon);
            const iconUrl = `https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/${iconName}.svg`;

            weatherDiv.innerHTML = `
                <img src="${iconUrl}" alt="${weatherMain}" width="64" height="48">
                <h2>${data.name}, ${data.sys.country}</h2>
                <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
                <p><strong>Weather:</strong> ${data.weather[0].description}</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
            `;
            weatherDiv.style.display = "flex";
    })
    .catch(error => {
      document.getElementById('WeatherInfo').innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
})

