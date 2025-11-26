// Home.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Home.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom 3D Animated Icon
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

const formatTime = (unix, tz) => {
  if (!unix) return 'N/A';
  const d = new Date(unix * 1000);
  return d.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: tz || undefined,
  });
};

const formatDate = (unix, tz) => {
  if (!unix) return 'N/A';
  const d = new Date(unix * 1000);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: tz || undefined,
  });
};

const safe = (x, fallback = 'N/A') =>
  x === undefined || x === null ? fallback : x;

const WeatherSection = ({ title, children }) => (
  <section className="weather-card">
    <h3>{title}</h3>
    {children}
  </section>
);

const Home = ({ weatherData, loading, error }) => {
  const [climateType, setClimateType] = useState('sunny');
  const [customIcon, setCustomIcon] = useState(null);

  useEffect(() => {
    // Create custom icon
    setCustomIcon(createCustomIcon());
  }, []);

  useEffect(() => {
    // Detect climate type based on current weather
    if (weatherData?.current) {
      const weatherMain = weatherData.current.weather[0].main.toLowerCase();
      const weatherDesc = weatherData.current.weather[0].description.toLowerCase();
      
      if (weatherDesc.includes('rain') || weatherDesc.includes('drizzle')) {
        setClimateType('rainy');
        createRainAnimation();
      } else if (weatherDesc.includes('snow')) {
        setClimateType('snowy');
        createSnowAnimation();
      } else if (weatherDesc.includes('storm') || weatherDesc.includes('thunder')) {
        setClimateType('stormy');
        createStormAnimation();
      } else if (weatherDesc.includes('cloud')) {
        setClimateType('cloudy');
      } else {
        setClimateType('sunny');
      }
    }
  }, [weatherData]);

  const createRainAnimation = () => {
    const container = document.querySelector('.weather-3d-elements');
    if (!container) return;

    // Clear existing animations
    const existing = container.querySelectorAll('.rain-drop, .snow-flake, .lightning');
    existing.forEach(el => el.remove());

    // Create rain drops
    for (let i = 0; i < 60; i++) {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      drop.style.cssText = `
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 2}s;
        animation-duration: ${Math.random() * 0.5 + 1}s;
      `;
      container.appendChild(drop);
    }
  };

  const createSnowAnimation = () => {
    const container = document.querySelector('.weather-3d-elements');
    if (!container) return;

    const existing = container.querySelectorAll('.rain-drop, .snow-flake, .lightning');
    existing.forEach(el => el.remove());

    for (let i = 0; i < 40; i++) {
      const flake = document.createElement('div');
      flake.className = 'snow-flake';
      flake.style.cssText = `
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 5}s;
        animation-duration: ${Math.random() * 3 + 5}s;
        width: ${Math.random() * 6 + 4}px;
        height: ${Math.random() * 6 + 4}px;
      `;
      container.appendChild(flake);
    }
  };

  const createStormAnimation = () => {
    const container = document.querySelector('.weather-3d-elements');
    if (!container) return;

    const existing = container.querySelectorAll('.rain-drop, .snow-flake, .lightning');
    existing.forEach(el => el.remove());

    // Create lightning
    const lightning = document.createElement('div');
    lightning.className = 'lightning';
    container.appendChild(lightning);

    // Create heavy rain
    for (let i = 0; i < 80; i++) {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      drop.style.cssText = `
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 1}s;
        animation-duration: ${Math.random() * 0.3 + 0.7}s;
        height: ${Math.random() * 10 + 15}px;
        opacity: ${Math.random() * 0.3 + 0.5};
      `;
      container.appendChild(drop);
    }
  };

  if (loading) return (
    <div className="loading">
      <div style={{fontSize: '3rem', marginBottom: '20px'}}>🌤️</div>
      Loading Weather Data...
    </div>
  );
  
  if (error) return (
    <div className="error">
      <div style={{fontSize: '3rem', marginBottom: '20px'}}>⚠️</div>
      {error}
    </div>
  );
  
  if (!weatherData) return (
    <div className="no-data">
      <div style={{fontSize: '3rem', marginBottom: '20px'}}>🔍</div>
      Search for a city to see beautiful weather data
    </div>
  );

  const {
    locationName,
    country,
    state,
    coordinates,
    timezone,
    current,
    hourly,
    daily,
    alerts,
    airQuality,
  } = weatherData;

  const iconUrl = (icon, size = '@2x') =>
    icon ? `https://openweathermap.org/img/wn/${icon}${size}.png` : null;

  // Get next 6 hours only
  const next6Hours = hourly ? hourly.slice(0, 6) : [];

  return (
    <div className="home-page">
      {/* Climate-based Background */}
      <div className={`weather-background ${climateType}`}>
        <video 
          autoPlay 
          muted 
          loop 
          className="background-video"
          poster="https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-sunrise-over-a-foggy-mountain-43527-large.mp4" type="video/mp4" />
        </video>
        <div className="background-overlay"></div>
      </div>
      
      {/* 3D Weather Elements */}
      <div className="weather-3d-elements">
        <div className="sun-3d"></div>
        <div className="cloud-3d cloud-large"></div>
        <div className="cloud-3d cloud-medium"></div>
        <div className="cloud-3d cloud-small"></div>
      </div>

      <div className="left-col">
        {/* Location Header */}
        <div className="location-header">
          <h2>
            {safe(locationName, 'Unknown')}
            {state ? `, ${state}` : ''} {country ? `, ${country}` : ''}
          </h2>
          <small>
            {coordinates?.lat && coordinates?.lon
              ? `Coordinates: ${coordinates.lat.toFixed(4)}, ${coordinates.lon.toFixed(4)}`
              : 'No coordinates'}
            {timezone ? ` • ${timezone}` : ''}
          </small>
        </div>

        {/* Current Weather */}
        <WeatherSection title="Current Weather">
          {current ? (
            <div className="current-grid">
              <div className="current-main">
                <div className="temp-large">
                  {current.temp ? Math.round(current.temp) + '°C' : 'N/A'}
                </div>
                <div className="desc">
                  {current.weather?.[0]?.description || 'N/A'}
                </div>
                {current.weather?.[0]?.icon && (
                  <img
                    src={iconUrl(current.weather[0].icon)}
                    alt={current.weather[0].description}
                  />
                )}
              </div>

              <div className="current-details">
                <div><strong>Feels like:</strong> {current.feels_like ? Math.round(current.feels_like) + '°C' : 'N/A'}</div>
                <div><strong>Pressure:</strong> {safe(current.pressure)} hPa</div>
                <div><strong>Humidity:</strong> {safe(current.humidity)}%</div>
                <div><strong>Clouds:</strong> {safe(current.clouds)}%</div>
                <div><strong>Visibility:</strong> {safe(current.visibility)} m</div>
                <div><strong>Wind:</strong> {safe(current.wind_speed)} m/s</div>
                <div><strong>Timestamp:</strong> {formatTime(current.dt, timezone)}</div>
              </div>
            </div>
          ) : (
            <div>No current data</div>
          )}
        </WeatherSection>

        {/* Hourly Forecast - Next 6 Hours Only */}
        <WeatherSection title="Next 6 Hours">
          {next6Hours.length > 0 ? (
            <div className="hourly-forecast">
              {next6Hours.map((h, i) => (
                <div key={i} className="hour-card">
                  <div className="hour-top">
                    <div className="hour-time">
                      {i === 0 ? 'Now' : formatTime(h.dt, timezone)}
                    </div>
                    {h.weather?.[0]?.icon && (
                      <img
                        src={iconUrl(h.weather[0].icon, '')}
                        alt={h.weather[0].description}
                      />
                    )}
                  </div>
                  <div className="hour-temp">
                    {Math.round(h.temp)}°C
                  </div>
                  <div className="hour-body">
                    <div>
                      <strong>Feels:</strong>
                      <span>{Math.round(h.feels_like)}°</span>
                    </div>
                    <div>
                      <strong>Humidity:</strong>
                      <span>{safe(h.humidity)}%</span>
                    </div>
                    <div>
                      <strong>Rain:</strong>
                      <span>{safe(h.pop)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No hourly forecast available</div>
          )}
        </WeatherSection>

        {/* Daily Forecast */}
        <WeatherSection title="7-Day Forecast">
          {daily && daily.length > 0 ? (
            <div className="daily-list">
              {daily.map((d, i) => (
                <div key={i} className="daily-card">
                  <div className="daily-left">
                    <div className="daily-date">
                      {i === 0 ? 'Today' : formatDate(d.dt, timezone)}
                    </div>
                    {d.weather?.[0]?.icon && (
                      <img
                        src={iconUrl(d.weather[0].icon)}
                        alt={d.weather[0].description}
                      />
                    )}
                    <div className="daily-desc">
                      {d.weather?.[0]?.description}
                    </div>
                  </div>
                  <div className="daily-right">
                    <div><strong>Max/Min:</strong> {Math.round(d.temp.max)}° / {Math.round(d.temp.min)}°C</div>
                    <div><strong>Humidity:</strong> {safe(d.humidity)}%</div>
                    <div><strong>Wind:</strong> {safe(d.wind_speed)} m/s</div>
                    <div><strong>Rain:</strong> {safe(d.pop)}%</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No daily forecast available</div>
          )}
        </WeatherSection>

        {/* Air Quality */}
        <WeatherSection title="Air Quality">
          {airQuality ? (
            <div>
              <div><strong>AQI:</strong> {airQuality.aqi}</div>
              <div className="aq-components">
                {airQuality.components &&
                  Object.entries(airQuality.components).map(([k, v]) => (
                    <div key={k}>
                      <strong>{k}:</strong> {v} μg/m³
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div>Air quality data not available</div>
          )}
        </WeatherSection>
      </div>

      {/* Map Section */}
      <div className="map-section">
        {coordinates?.lat && coordinates?.lon ? (
          <MapContainer
            center={[coordinates.lat, coordinates.lon]}
            zoom={10}
            style={{ height: '100%', width: '100%', minHeight: 400 }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker 
              position={[coordinates.lat, coordinates.lon]} 
              icon={customIcon}
            >
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <strong style={{ color: '#FF6B6B', fontSize: '1.1rem' }}>{locationName}</strong>
                  <br />
                  <span style={{ color: '#666' }}>{country}</span>
                  <br />
                  <span style={{ color: '#FFD700', fontWeight: 'bold' }}>
                    Temperature: {current?.temp ? Math.round(current.temp) + '°C' : 'N/A'}
                  </span>
                  <br />
                  <span style={{ color: '#87CEEB' }}>
                    {current?.weather?.[0]?.description}
                  </span>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div>No map coordinates</div>
        )}
      </div>
    </div>
  );
};

export default Home;