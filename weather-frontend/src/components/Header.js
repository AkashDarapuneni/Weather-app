import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ isLoggedIn, user, onLogin, onLogout, currentLocation, setCurrentLocation, loading, weatherData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [recentSearches, setRecentSearches] = useState([]);
  const [climateType, setClimateType] = useState('sunny');
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  

  // Sample popular locations
  const popularLocations = [
    { name: 'New York', country: 'US', type: 'city' },
    { name: 'London', country: 'UK', type: 'city' },
    { name: 'Tokyo', country: 'JP', type: 'city' },
    { name: 'Paris', country: 'FR', type: 'city' },
    { name: 'Sydney', country: 'AU', type: 'city' }
  ];

  useEffect(() => {
    // Detect climate type based on weather data
    if (weatherData?.current) {
      const weatherMain = weatherData.current.weather[0].main.toLowerCase();
      const weatherDesc = weatherData.current.weather[0].description.toLowerCase();
      
      if (weatherDesc.includes('rain') || weatherDesc.includes('drizzle')) {
        setClimateType('rainy');
        createHeaderRainAnimation();
      } else if (weatherDesc.includes('storm') || weatherDesc.includes('thunder')) {
        setClimateType('stormy');
        createHeaderStormAnimation();
      } else if (weatherDesc.includes('cloud')) {
        setClimateType('cloudy');
      } else {
        setClimateType('sunny');
      }
    }

    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Create floating particles around buttons
    createFloatingParticles();

    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [weatherData]);

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      fetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const createFloatingParticles = () => {
    const container = document.querySelector('.header');
    if (!container) return;

    // Clear existing particles
    const existingParticles = container.querySelectorAll('.floating-particle');
    existingParticles.forEach(particle => particle.remove());

    // Create particles around auth buttons
    const authSection = container.querySelector('.auth-section');
    if (authSection) {
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        const size = Math.random() * 3 + 1;
        particle.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          animation-delay: ${Math.random() * 10}s;
          animation-duration: ${Math.random() * 8 + 7}s;
        `;
        authSection.appendChild(particle);
      }
    }
  };

  const createHeaderRainAnimation = () => {
    const container = document.querySelector('.weather-animations');
    if (!container) return;

    // Clear existing animations
    const existing = container.querySelectorAll('.header-rain-drop, .header-lightning');
    existing.forEach(el => el.remove());

    // Create rain drops
    for (let i = 0; i < 30; i++) {
      const drop = document.createElement('div');
      drop.className = 'header-rain-drop';
      drop.style.cssText = `
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 2}s;
        animation-duration: ${Math.random() * 0.4 + 0.8}s;
      `;
      container.appendChild(drop);
    }
  };

  const createHeaderStormAnimation = () => {
    const container = document.querySelector('.weather-animations');
    if (!container) return;

    const existing = container.querySelectorAll('.header-rain-drop, .header-lightning');
    existing.forEach(el => el.remove());

    // Create lightning
    const lightning = document.createElement('div');
    lightning.className = 'header-lightning';
    container.appendChild(lightning);

    // Create heavy rain
    for (let i = 0; i < 40; i++) {
      const drop = document.createElement('div');
      drop.className = 'header-rain-drop';
      drop.style.cssText = `
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 1}s;
        animation-duration: ${Math.random() * 0.3 + 0.6}s;
        height: ${Math.random() * 8 + 10}px;
        opacity: ${Math.random() * 0.3 + 0.5};
      `;
      container.appendChild(drop);
    }
  };

  const fetchSuggestions = async (query) => {
    // Simulate API call with timeout
    setTimeout(() => {
      const mockSuggestions = [
        { name: `${query} City`, country: 'US', type: 'city' },
        { name: `${query} County`, country: 'US', type: 'county' },
        { name: `${query} Airport`, country: 'US', type: 'airport' },
        { name: `${query} Beach`, country: 'US', type: 'landmark' },
        { name: `${query} Park`, country: 'US', type: 'park' }
      ];
      setSuggestions(mockSuggestions);
    }, 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim());
    }
  };

  const performSearch = (location) => {
    console.log('Searching for:', location);
    setCurrentLocation(location);
    setSearchQuery('');
    setShowSuggestions(false);
    
    // Add to recent searches
    const newRecent = [location, ...recentSearches.filter(item => item !== location)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
  };

  const handleSuggestionClick = (suggestion) => {
    performSearch(suggestion.name);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
    setActiveSuggestion(0);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => prev > 0 ? prev - 1 : 0);
    } else if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeSuggestion]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'city': return '🏙️';
      case 'county': return '🏛️';
      case 'airport': return '✈️';
      case 'landmark': return '🏞️';
      case 'park': return '🌳';
      default: return '📍';
    }
  };

  return (
    <header className={`header ${climateType}`}>
      {/* Weather Animations with Emojis on Clouds */}
      <div className="weather-animations">
        <div className="header-sun"></div>
        
        {/* Clouds with smile emojis moving from left to right */}
        <div className="header-cloud cloud-1">
          <div className="cloud-emoji">😊</div>
        </div>
        <div className="header-cloud cloud-2">
          <div className="cloud-emoji">☺️</div>
        </div>
        <div className="header-cloud cloud-3">
          <div className="cloud-emoji">😄</div>
        </div>
        <div className="header-cloud cloud-4">
          <div className="cloud-emoji">😃</div>
        </div>
      </div>

      <div className="header-top">
        <Link to="/" className="logo">Weather<span>Vibes</span></Link>
      </div>

      <nav className="navigation">
        {/* Search Container - RIGHT SIDE CORNER */}
        <div 
          ref={searchRef}
          className={`search-container ${showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) ? 'has-suggestions' : ''}`}
        >
          <input 
            type="text" 
            placeholder="Search your Address, City or Zip Code" 
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            className="search-input"
          />
          <button type="submit" className="search-btn" onClick={handleSearch} disabled={loading}>
            <i className="fas fa-search"></i> 
            {loading ? 'Searching...' : 'Search'}
          </button>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
            <div ref={suggestionsRef} className="search-suggestions">
              {/* Recent Searches */}
              {recentSearches.length > 0 && searchQuery.length <= 2 && (
                <div className="suggestions-section">
                  <div className="section-header">
                    <span className="suggestion-icon">🕒</span>
                    Recent Searches
                  </div>
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className={`suggestion-item ${activeSuggestion === index ? 'highlighted' : ''}`}
                      onClick={() => performSearch(search)}
                    >
                      <span className="suggestion-icon">🕒</span>
                      <div className="suggestion-content">
                        <div className="suggestion-main">{search}</div>
                      </div>
                    </div>
                  ))}
                  <div className="clear-recent">
                    <button className="clear-btn" onClick={clearRecentSearches}>
                      Clear Recent
                    </button>
                  </div>
                </div>
              )}

              {/* Popular Locations */}
              {searchQuery.length <= 2 && (
                <div className="suggestions-section popular-locations">
                  <div className="section-header">
                    <span className="suggestion-icon">🔥</span>
                    Popular Locations
                  </div>
                  {popularLocations.map((location, index) => (
                    <div
                      key={index}
                      className={`suggestion-item ${activeSuggestion === index + recentSearches.length ? 'highlighted' : ''}`}
                      onClick={() => handleSuggestionClick(location)}
                    >
                      <span className="suggestion-icon">{getSuggestionIcon(location.type)}</span>
                      <div className="suggestion-content">
                        <div className="suggestion-main">{location.name}</div>
                        <div className="suggestion-details">
                          <span>{location.country}</span>
                          <span className="suggestion-type">{location.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Search Results */}
              {suggestions.length > 0 && searchQuery.length > 2 && (
                <div className="suggestions-section">
                  <div className="section-header">
                    <span className="suggestion-icon">🔍</span>
                    Search Results
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`suggestion-item ${activeSuggestion === index ? 'highlighted' : ''}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span className="suggestion-icon">{getSuggestionIcon(suggestion.type)}</span>
                      <div className="suggestion-content">
                        <div className="suggestion-main">{suggestion.name}</div>
                        <div className="suggestion-details">
                          <span>{suggestion.country}</span>
                          <span className="suggestion-type">{suggestion.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {suggestions.length === 0 && searchQuery.length > 2 && (
                <div className="suggestion-no-results">
                  <div className="suggestion-icon">🔍</div>
                  <div>No results found for "{searchQuery}"</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Auth Section - BELOW THE SUN (centered) */}
        <div className="auth-section">
          {isLoggedIn ? (
            <div className="user-profile">
              <div className="user-avatar">{user?.initials || 'U'}</div>
              <span className="user-name">Hello, {user?.name || 'User'}</span>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/signup" className="auth-btn signup-btn">Sign Up</Link>
              <Link to="/login" className="auth-btn login-btn">Login</Link>
            </div>
          )}
        </div>
      </nav>

      <div className="current-location">
        {loading ? (
          <span>Loading weather data for {currentLocation}...</span>
        ) : (
          <span>Current Location: {currentLocation}</span>
        )}
      </div>
      
    </header>
    
  );
};

export default Header;