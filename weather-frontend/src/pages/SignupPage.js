import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthPages.css';

const SignupPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '',
    address: '', city: '', country: '', zipCode: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Create floating weather icons
    const createWeatherIcons = () => {
      const container = document.querySelector('.auth-page');
      if (!container) return;
      
      const icons = ['☀️', '⛅', '🌤️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️'];
      const existingIcons = container.querySelectorAll('.floating-weather-icon');
      existingIcons.forEach(icon => icon.remove());
      
      for (let i = 0; i < 8; i++) {
        const icon = document.createElement('div');
        icon.className = 'floating-weather-icon';
        icon.textContent = icons[Math.floor(Math.random() * icons.length)];
        icon.style.cssText = `
          left: ${Math.random() * 100}%;
          animation-delay: ${Math.random() * 20}s;
          animation-duration: ${Math.random() * 15 + 15}s;
          font-size: ${Math.random() * 1.5 + 1.5}rem;
        `;
        container.appendChild(icon);
      }
    };

    createWeatherIcons();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:2020/api/auth/signup", formData, {
        headers: { "Content-Type": "application/json" }
      });

      alert("Signup successful!");
      onLogin({
        name: formData.name,
        email: formData.email,
        initials: formData.name.charAt(0).toUpperCase()
      });

      navigate('/');
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      alert("Signup failed: " + (error.response?.data || "Server error"));
    }
  };

  return (
    <div className="auth-page">
      {/* Animated Background */}
      <div className="weather-background-auth">
        <video 
          autoPlay 
          muted 
          loop 
          className="background-video-auth"
          poster="https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-sunrise-over-a-foggy-mountain-43527-large.mp4" type="video/mp4" />
        </video>
        <div className="background-overlay-auth"></div>
      </div>

      <div className="auth-container">
        <div className="auth-header">
          <h2>Create Your Account</h2>
          <p>Join our'sWeather for personalized weather experience</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Enter your full name"
              required 
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Enter your email address"
              required 
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Create a strong password"
              required 
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="Enter your phone number"
              required 
            />
          </div>

          <div className="form-group">
            <label>Address *</label>
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              placeholder="Enter your street address"
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input 
                type="text" 
                name="city" 
                value={formData.city} 
                onChange={handleChange} 
                placeholder="Enter your city"
                required 
              />
            </div>

            <div className="form-group">
              <label>ZIP Code *</label>
              <input 
                type="text" 
                name="zipCode" 
                value={formData.zipCode} 
                onChange={handleChange} 
                placeholder="Enter ZIP code"
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Country *</label>
            <select name="country" value={formData.country} onChange={handleChange} required>
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="IN">India</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="JP">Japan</option>
            </select>
          </div>

          <button type="submit" className="auth-submit-btn">Create Account</button>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in here</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;