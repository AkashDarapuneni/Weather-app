import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import "./App.css";
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState("Mumbai");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "faabd6ba25cbf0e2b731262c03aff780"; // your OpenWeatherMap key

  const fetchWeatherData = async (location) => {
    if (!location) return;
    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Get city coordinates
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          location
        )}&limit=1&appid=${API_KEY}`
      );
      if (!geoRes.ok) throw new Error("Failed to fetch coordinates");
      const geoData = await geoRes.json();
      if (!geoData || geoData.length === 0) {
        throw new Error(`City "${location}" not found`);
      }

      const { lat, lon, name, country, state } = geoData[0];

      // 2️⃣ Fetch main One Call 3.0 weather data
      const onecallRes = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const onecallData = await onecallRes.json();

      // 3️⃣ Fetch /weather (for current fallback)
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const weatherData2 = await weatherRes.json();

      // 4️⃣ Fetch /forecast (for hourly & daily fallback)
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();

      // 5️⃣ Fetch air quality
      const airRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const airJson = await airRes.json();
      const airQuality =
        airJson.list && airJson.list.length > 0
          ? {
              aqi: airJson.list[0].main.aqi,
              components: airJson.list[0].components,
            }
          : null;

      // 6️⃣ Normalize data to consistent format
      let normalizedHourly = [];
      let normalizedDaily = [];

      if (onecallData && onecallData.hourly) {
        normalizedHourly = onecallData.hourly;
        normalizedDaily = onecallData.daily;
      } else if (forecastData && forecastData.list) {
        // Normalize /forecast data to look like OneCall hourly
        normalizedHourly = forecastData.list.map((h) => ({
          dt: h.dt,
          temp: h.main?.temp,
          feels_like: h.main?.feels_like,
          humidity: h.main?.humidity,
          clouds: h.clouds?.all,
          wind_speed: h.wind?.speed,
          pop: h.pop ?? 0,
          weather: h.weather,
        }));

        // Group into daily summaries (every 8 * 3-hour = 1 day)
        const dailyMap = {};
        forecastData.list.forEach((h) => {
          const day = new Date(h.dt * 1000).toDateString();
          if (!dailyMap[day]) {
            dailyMap[day] = {
              dt: h.dt,
              temp: { min: h.main.temp, max: h.main.temp },
              humidity: h.main.humidity,
              wind_speed: h.wind.speed,
              pop: h.pop ?? 0,
              weather: h.weather,
            };
          } else {
            dailyMap[day].temp.min = Math.min(
              dailyMap[day].temp.min,
              h.main.temp
            );
            dailyMap[day].temp.max = Math.max(
              dailyMap[day].temp.max,
              h.main.temp
            );
          }
        });
        normalizedDaily = Object.values(dailyMap);
      }

      // 7️⃣ Final combined object (always consistent)
      const fullData = {
        locationName: name,
        country,
        state,
        coordinates: { lat, lon },
        timezone:
          onecallData?.timezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        current: onecallData?.current || {
          temp: weatherData2.main?.temp,
          feels_like: weatherData2.main?.feels_like,
          humidity: weatherData2.main?.humidity,
          wind_speed: weatherData2.wind?.speed,
          clouds: weatherData2.clouds?.all,
          uvi: onecallData?.current?.uvi || null,
          weather: weatherData2.weather,
        },
        hourly: normalizedHourly,
        daily: normalizedDaily,
        airQuality,
      };

      setWeatherData(fullData);
    } catch (err) {
      console.error(err);
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
    if (newLocation && newLocation.trim() !== "")
      setCurrentLocation(newLocation.trim());
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
          <Route
            path="/"
            element={
              <Home weatherData={weatherData} loading={loading} error={error} />
            }
          />
  <Route
    path="/"
    element={<Home weatherData={weatherData} loading={loading} error={error} />}
  />
  <Route path="/login" element={<LoginPage onLogin={(user) => handleLogin(user)} />} />
  <Route path="/signup" element={<SignupPage onLogin={(user) => handleLogin(user)} />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
