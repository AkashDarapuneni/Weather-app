// src/api.js
const API_KEY = "c7e2aa9c576616f325ae9cbf52c1fcc4";

export const fetchWeatherByCity = async (city) => {
  try {
    // Use OpenWeather One Call API 3.0 (replace with your API plan)
    // First get the city coordinates
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );
    const geoData = await geoRes.json();
    if (!geoData[0]) throw new Error("City not found");

    const { lat, lon } = geoData[0];

    // Fetch weather data
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${API_KEY}`
    );
    const weatherData = await weatherRes.json();

    return weatherData;
  } catch (err) {
    console.error("Error fetching weather:", err);
    return null;
  }
};
