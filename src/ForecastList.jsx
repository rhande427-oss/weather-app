// src/components/ForecastList.jsx
const weatherIcons = {
  0: "☀", 1: "🌤", 2: "⛅", 3: "☁", 45: "🌫", 48: "🌫",
  51: "🌦", 53: "🌦", 55: "🌧", 61: "🌦", 63: "🌧", 65: "🌧",
  71: "🌨", 73: "❄", 75: "❄", 80: "🌦", 81: "🌧", 82: "⛈",
  95: "⛈", 96: "⛈", 99: "⛈",
};

function ForecastList({ forecast, unit }) {
  const convertTemperature = (value) => unit === "F" ? (value * 9) / 5 + 32 : value;
  const getIconMotion = (code) => code >= 95 ? "storm" : code >= 51 ? "rain" : code <= 1 ? "sun" : "cloud";

  return (
    <div className="forecast-list">
      <h3>7-Day Forecast</h3>
      <div className="forecast-grid">
        {forecast.map((day, index) => (
          <div key={index} className="forecast-item" style={{ "--tile-index": index }}>
            <h4>{new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}</h4>
            <span className={`forecast-icon forecast-icon-${getIconMotion(day.code)}`} aria-hidden="true">{weatherIcons[day.code] || "☁"}</span>
            <p>{Math.round(convertTemperature(day.temp.max))}° / {Math.round(convertTemperature(day.temp.min))}°</p>
            <p className="rain-chance">Rain {day.rainChance ?? 0}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastList;
