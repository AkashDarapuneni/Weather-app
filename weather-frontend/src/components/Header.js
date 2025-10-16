import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ isLoggedIn, user, onLogin, onLogout, currentLocation, setCurrentLocation, loading }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setCurrentLocation(searchQuery.trim());
      setSearchQuery('');
    }
  };

  return (
    <header className="header">
      <div className="header-top">
        <Link to="/" className="logo">our's<span>Weather</span></Link>
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
      </div>

      <nav className="navigation">
        <ul className="nav-links">
          {/* <li><Link to="/">Home</Link></li> */}
          {/* <li><Link to="/hourly">Hourly</Link></li>
          <li><Link to="/daily">Daily</Link></li>
          <li><a href="#maps">Maps</a></li>
          <li><a href="#video">Video</a></li>
          <li><a href="#news">News</a></li>
          <li><a href="#blogs">Blogs</a></li>
          <li><a href="#radar">Radar</a></li> */}
        </ul>

        <form className="search-container" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search your Address, City or Zip Code" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" disabled={loading}>
            <i className="fas fa-search"></i> 
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
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