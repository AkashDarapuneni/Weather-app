// pages/Daily.js
import React from 'react';
import './Daily.css';

const Daily = ({ weatherData }) => {
  if (!weatherData || !weatherData.daily) return <div className="loading">Loading weather data...</div>;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="daily-page">
      <div className="weather-card">
        <h2>7-Day Forecast</h2>
        <div className="daily-forecast">
          {weatherData.daily.map((day, index) => (
            <div key={index} className="daily-item">
              <div className="daily-day">
                {index === 0 ? 'Today' : days[new Date((day.dt ?? Date.now()) * 1000).getDay()]}
              </div>
              <div className="daily-icon">
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather?.[0]?.icon || '01d'}.png`}
                  alt="weather condition"
                />
              </div>
              <div className="daily-temp">
                <span className="daily-high">{Math.round(day.temp?.max ?? 0)}°</span>
                <span className="daily-low">/{Math.round(day.temp?.min ?? 0)}°</span>
              </div>
              <div className="daily-details">
                <div>Precip: {day.pop != null ? Math.round(day.pop * 100) + '%' : '--'}</div>
                <div>Wind: {day.wind_speed ?? '--'} km/h</div>
                <div>Humidity: {day.humidity ?? '--'}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Daily;
