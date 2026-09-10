import { useEffect, useState } from "react";
import ForecastList from "./ForecastList";
import SearchBar from "./SearchBar";
import WeatherCard from "./WeatherCard";
import "./App.css";

const backgroundImages = {
  clear: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=2200&q=88",
  cloudy: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=2200&q=88",
  rain: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=2200&q=88",
  storm: "https://images.unsplash.com/photo-1461511669078-d46bf351cd6e?auto=format&fit=crop&w=2200&q=88",
};

function getWeatherMood(code) {
  if (code <= 3) return "clear";
  if (code >= 95) return "storm";
  if (code >= 51 && code <= 82) return "rain";
  return "cloudy";
}

function App() {
  const [city, setCity] = useState("Panvel");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [status, setStatus] = useState("Loading weather...");
  const [unit, setUnit] = useState("C");
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("weather-history") || "[]"));

  const searchCity = (nextCity) => {
    const cleanedCity = nextCity.trim();
    if (!cleanedCity) return;
    setCity(cleanedCity);
    setHistory((currentHistory) => {
      const nextHistory = [cleanedCity, ...currentHistory.filter((item) => item.toLowerCase() !== cleanedCity.toLowerCase())].slice(0, 5);
      localStorage.setItem("weather-history", JSON.stringify(nextHistory));
      return nextHistory;
    });
  };

  const weatherMood = getWeatherMood(weather?.code ?? 2);

  useEffect(() => {
    const loadWeather = async () => {
      setStatus("Loading weather...");

      try {
        const locationResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );
        if (!locationResponse.ok) throw new Error("Location lookup failed");

        const locationData = await locationResponse.json();
        const location = locationData.results?.[0];
        if (!location) throw new Error("City not found");

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,pressure_msl,visibility,uv_index&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset,precipitation_probability_max&timezone=auto`
        );
        if (!weatherResponse.ok) throw new Error("Weather lookup failed");

        const weatherData = await weatherResponse.json();
        setWeather({
          name: location.name,
          main: {
            temp: weatherData.current.temperature_2m,
            humidity: weatherData.current.relative_humidity_2m,
            feelsLike: weatherData.current.apparent_temperature,
            pressure: weatherData.current.pressure_msl,
            visibility: weatherData.current.visibility,
            uvIndex: weatherData.current.uv_index,
          },
          wind: { speed: weatherData.current.wind_speed_10m },
          weather: [{ description: `Weather code ${weatherData.current.weather_code}` }],
          code: weatherData.current.weather_code,
          sunrise: weatherData.daily.sunrise[0],
          sunset: weatherData.daily.sunset[0],
        });
        setForecast(
          weatherData.daily.time.map((date, index) => ({
            dt: Date.parse(`${date}T12:00:00`) / 1000,
            temp: {
              max: weatherData.daily.temperature_2m_max[index],
              min: weatherData.daily.temperature_2m_min[index],
            },
            weather: [{ main: `Weather code ${weatherData.daily.weather_code[index]}` }],
            code: weatherData.daily.weather_code[index],
            rainChance: weatherData.daily.precipitation_probability_max[index],
          }))
        );
        setStatus("");
      } catch (error) {
        setWeather(null);
        setForecast([]);
        setStatus(error.message || "Unable to load weather");
      }
    };

    loadWeather();
  }, [city]);

  return (
    <main className={`app${darkMode ? " dark" : ""} weather-${weatherMood}`}>
      <div className="weather-backdrop" style={{ backgroundImage: `url(${backgroundImages[weatherMood]})` }} aria-hidden="true" />
      <div className={`weather-effects effects-${weatherMood}`} aria-hidden="true">
        <span className="effect-sun" />
        <span className="effect-cloud effect-cloud-one" />
        <span className="effect-cloud effect-cloud-two" />
      </div>
      <header className="app-header">
        <h1>Weather</h1>
        <div className="controls" aria-label="Weather display controls">
          <a className="github-link" href="https://github.com/rhande427-oss" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <div className="unit-toggle" aria-label="Temperature unit">
            <button className={unit === "C" ? "active" : ""} onClick={() => setUnit("C")}>°C</button>
            <button className={unit === "F" ? "active" : ""} onClick={() => setUnit("F")}>°F</button>
          </div>
          <button className="theme-toggle" onClick={() => setDarkMode((value) => !value)} aria-label="Toggle dark mode">
            {darkMode ? "☀" : "☾"}
          </button>
        </div>
      </header>
      <SearchBar onSearch={searchCity} />
      {history.length > 0 && (
        <div className="search-history" aria-label="Recent searches">
          <span>Recent</span>
          {history.map((item) => <button key={item} onClick={() => searchCity(item)}>{item}</button>)}
        </div>
      )}
      {status && <p role="status">{status}</p>}
      {weather && <WeatherCard data={weather} unit={unit} />}
      {forecast.length > 0 && <ForecastList forecast={forecast} unit={unit} />}
    </main>
  );
}

export default App;
