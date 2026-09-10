// src/components/WeatherCard.jsx
const weatherInfo = {
  0: ["Clear sky", "☀"],
  1: ["Mainly clear", "🌤"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁"],
  45: ["Foggy", "🌫"],
  48: ["Rime fog", "🌫"],
  51: ["Light drizzle", "🌦"],
  53: ["Drizzle", "🌦"],
  55: ["Heavy drizzle", "🌧"],
  61: ["Light rain", "🌦"],
  63: ["Rain", "🌧"],
  65: ["Heavy rain", "🌧"],
  71: ["Light snow", "🌨"],
  73: ["Snow", "❄"],
  75: ["Heavy snow", "❄"],
  80: ["Rain showers", "🌦"],
  81: ["Rain showers", "🌧"],
  82: ["Heavy showers", "⛈"],
  95: ["Thunderstorm", "⛈"],
  96: ["Storm with hail", "⛈"],
  99: ["Storm with hail", "⛈"],
};

function convertTemperature(value, unit) {
  return unit === "F" ? (value * 9) / 5 + 32 : value;
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function WeatherCard({ data, unit }) {
  const [description, icon] = weatherInfo[data.code] || ["Variable conditions", "☁"];
  const iconMotion = data.code >= 95 ? "storm" : data.code >= 51 ? "rain" : data.code <= 1 ? "sun" : "cloud";
  const uvLabel = data.main.uvIndex < 3 ? "Low" : data.main.uvIndex < 6 ? "Moderate" : data.main.uvIndex < 8 ? "High" : "Very high";

  return (
    <div className="weather-card">
      <div className="weather-summary">
        <span className={`weather-icon weather-icon-${iconMotion}`} aria-hidden="true">{icon}</span>
        <h2>{data.name}</h2>
        <p>{description}</p>
      </div>
      <h3>{Math.round(convertTemperature(data.main.temp, unit))}°{unit}</h3>
      <div className="weather-details">
        <span>Feels like <strong>{Math.round(convertTemperature(data.main.feelsLike, unit))}°{unit}</strong></span>
        <span>Humidity <strong>{data.main.humidity}%</strong></span>
        <span>Wind <strong>{Math.round(data.wind.speed)} km/h</strong></span>
        <span>Pressure <strong>{Math.round(data.main.pressure)} hPa</strong></span>
        <span>Visibility <strong>{(data.main.visibility / 1000).toFixed(1)} km</strong></span>
        <span>UV index <strong>{Math.round(data.main.uvIndex)} · {uvLabel}</strong></span>
        <span>Sunrise <strong>{formatTime(data.sunrise)}</strong></span>
        <span>Sunset <strong>{formatTime(data.sunset)}</strong></span>
      </div>
    </div>
  );
}

export default WeatherCard;
