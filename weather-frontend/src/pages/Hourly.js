// pages/Hourly.js
import React from 'react';
import './Hourly.css';

const Hourly = ({ weatherData }) => {
  if (!weatherData || !weatherData.hourly) return <div className="loading">Loading weather data...</div>;

  return (
    <div className="hourly-page">
      <div className="weather-card">
        <h2>24-Hour Forecast</h2>
        <div className="hourly-forecast">
          {weatherData.hourly.map((hour, index) => (
            <div key={index} className="hourly-item">
              <div className="hourly-time">
                {index === 0 ? 'Now' : new Date(hour.dt * 1000).getHours() + ':00'}
              </div>
              <div className="hourly-icon">
                <img
                  src={`http://openweathermap.org/img/wn/${hour.weather?.[0]?.icon || '01d'}.png`}
                  alt="weather condition"
                />
              </div>
              <div className="hourly-temp">{Math.round(hour.temp ?? 0)}°C</div>
              <div className="hourly-details">
                <div>Humidity: {hour.humidity ?? '--'}%</div>
                <div>Wind: {hour.wind_speed ?? '--'} km/h</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hourly;
