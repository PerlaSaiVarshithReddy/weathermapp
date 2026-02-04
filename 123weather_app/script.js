const apiKey = "c2516b7bb1a9c5b26ac41c020aa7c307";

function getWeather() {
    const city = document.getElementById("city").value.trim();
    if (!city) return;

    const unit = document.getElementById("unitToggle").checked ? "imperial" : "metric";
    const unitSymbol = unit === "metric" ? "°C" : "°F";

    document.getElementById("loading").style.display = "block";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("loading").style.display = "none";

            if (data.cod !== 200) {
                document.getElementById("current").innerHTML = "❌ City not found";
                return;
            }

            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

            document.getElementById("current").innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
                <p><b>${data.weather[0].description}</b></p>
                <h3>${data.main.temp} ${unitSymbol}</h3>

                <div class="current-grid">
                    <div>Feels like: ${data.main.feels_like} ${unitSymbol}</div>
                    <div>Humidity: ${data.main.humidity}%</div>
                    <div>Pressure: ${data.main.pressure} hPa</div>
                    <div>Wind: ${data.wind.speed}</div>
                    <div>Visibility: ${data.visibility / 1000} km</div>
                    <div>Clouds: ${data.clouds.all}%</div>
                    <div>Sunrise: ${sunrise}</div>
                    <div>Sunset: ${sunset}</div>
                </div>
            `;

            getForecast(city, unit, unitSymbol);
        });
}

function getForecast(city, unit, unitSymbol) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`)
        .then(res => res.json())
        .then(data => {

            document.getElementById("hourly-title").innerText = "⏰ Hourly Forecast";
            let hourlyHTML = "";

            for (let i = 0; i < 6; i++) {
                const h = data.list[i];
                const time = new Date(h.dt * 1000).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                hourlyHTML += `
                    <div class="hour-card">
                        ${time}<br>
                        <img src="https://openweathermap.org/img/wn/${h.weather[0].icon}.png"><br>
                        ${h.main.temp} ${unitSymbol}
                    </div>
                `;
            }
            document.getElementById("hourly").innerHTML = hourlyHTML;

            document.getElementById("forecast-title").innerText = "📅 5-Day Forecast";
            let forecastHTML = "";

            for (let i = 0; i < data.list.length; i += 8) {
                const d = data.list[i];
                const date = new Date(d.dt * 1000).toDateString();

                forecastHTML += `
                    <div class="forecast-card">
                        <b>${date}</b><br>
                        <img src="https://openweathermap.org/img/wn/${d.weather[0].icon}.png"><br>
                        ${d.weather[0].description}<br>
                        🌡️ ${d.main.temp} ${unitSymbol}<br>
                        💧 ${d.main.humidity}%
                    </div>
                `;
            }
            document.getElementById("forecast").innerHTML = forecastHTML;
        });
}
