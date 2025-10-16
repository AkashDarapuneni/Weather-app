import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('Mumbai');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = 'b82e91ec38ffbc9814404ee5a62287dc'; // Replace with your OpenWeatherMap free API key

  const fetchWeatherData = async (location) => {
    if (!location) return;
    setLoading(true);
    setError(null);

    try {
      // Get coordinates
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`
      );
      if (!geoRes.ok) throw new Error('Failed to fetch coordinates');
      const geoData = await geoRes.json();
      if (!geoData || geoData.length === 0) {
        setError(`City "${location}" not found`);
        setWeatherData(null);
        setLoading(false);
        return;
      }

      const { lat, lon, name, country } = geoData[0];

      // Current weather
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      if (!currentRes.ok) throw new Error('Failed to fetch current weather');
      const currentData = await currentRes.json();

      // 5-day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      if (!forecastRes.ok) throw new Error('Failed to fetch forecast');
      const forecastData = await forecastRes.json();

      // Process hourly and daily data
      const hourly = forecastData.list.slice(0, 6); // next 6 time intervals (~3h each)
      const dailyMap = {};
      forecastData.list.forEach(item => {
        const day = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        if (!dailyMap[day]) dailyMap[day] = item;
      });
      const daily = Object.values(dailyMap).slice(0, 5); // next 5 days

      const enhancedWeatherData = {
        locationName: name,
        country,
        coordinates: { lat, lon },
        current: currentData.main ? {
          temp: currentData.main.temp,
          weather: currentData.weather,
        } : {},
        hourly,
        daily,
      };

      setWeatherData(enhancedWeatherData);
      setError(null);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(currentLocation);
  }, [currentLocation]);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleLocationChange = (newLocation) => {
    if (newLocation && newLocation.trim() !== '') setCurrentLocation(newLocation.trim());
  };

  return (
    <Router>
      <div className="App">
        <Header
          isLoggedIn={isLoggedIn}
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
          currentLocation={currentLocation}
          setCurrentLocation={handleLocationChange}
          loading={loading}
        />

        <Routes>
          <Route path="/" element={<Home weatherData={weatherData} loading={loading} error={error} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupPage onLogin={handleLogin} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
