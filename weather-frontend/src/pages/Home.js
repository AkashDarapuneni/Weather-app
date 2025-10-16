import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Home.css';

const Home = ({ weatherData, loading, error }) => {
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!weatherData) return <div className="no-data">Search for a city to see weather</div>;

  const { locationName, country, coordinates, current, hourly, daily } = weatherData;

  return (
    <div className="home-page">
      <div className="weather-section">
        <h2>
          Current Weather in {locationName || 'Unknown'}, {country || ''}
        </h2>

        {current ? (
          <div className="current-weather">
            <div className="temp">{current.temp ? Math.round(current.temp) + '°C' : 'N/A'}</div>
            <div className="desc">{current.weather?.[0]?.description || 'N/A'}</div>
            {current.weather?.[0]?.icon && (
              <img
                src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`}
                alt={current.weather[0].description}
              />
            )}
          </div>
        ) : (
          <div>No current weather data available</div>
        )}

        <h3>Next 6 Hours</h3>
        {hourly?.length > 0 ? (
          <div className="hourly-forecast">
            {hourly.slice(0, 6).map((hour, index) => {
              // Some APIs may have temp inside hour.temp or hour.temp.day
              const temp = hour.temp ?? hour.temp?.day ?? 'N/A';
              return (
                <div key={index} className="hour">
                  <span>{index === 0 ? 'Now' : new Date(hour.dt * 1000).getHours() + ':00'}</span>
                  {hour.weather?.[0]?.icon && (
                    <img
                      src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                      alt={hour.weather[0].description}
                    />
                  )}
                  <span>{temp !== 'N/A' ? Math.round(temp) + '°C' : 'N/A'}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div>No hourly forecast available</div>
        )}

        <h3>Next 5 Days</h3>
        {daily?.length > 0 ? (
          <div className="daily-forecast">
            {daily.slice(0, 5).map((day, index) => {
              const maxTemp = day.temp?.max ?? day.temp?.day ?? 'N/A';
              const minTemp = day.temp?.min ?? 'N/A';
              return (
                <div key={index} className="day">
                  <span>
                    {index === 0
                      ? 'Today'
                      : new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  {day.weather?.[0]?.icon && (
                    <img
                      src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                      alt={day.weather[0].description}
                    />
                  )}
                  <span>
                    {maxTemp !== 'N/A' && minTemp !== 'N/A'
                      ? `${Math.round(maxTemp)}° / ${Math.round(minTemp)}°C`
                      : 'N/A'}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div>No daily forecast available</div>
        )}
      </div>

      {coordinates?.lat && coordinates?.lon && (
        <div className="map-section">
          <MapContainer
            center={[coordinates.lat, coordinates.lon]}
            zoom={10}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[coordinates.lat, coordinates.lon]}>
              <Popup>
                {locationName}, {country} <br />
                Current Temp: {current?.temp ? Math.round(current.temp) + '°C' : 'N/A'}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default Home;
