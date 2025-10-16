import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthPages.css';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9092/api/auth/login", formData, {
        headers: { "Content-Type": "application/json" }
      });

      const userData = response.data;
      alert("Login successful!");

      onLogin({
        name: userData.name,
        email: userData.email,
        initials: userData.name.charAt(0).toUpperCase()
      });

      navigate('/');
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed: " + (error.response?.data || "Invalid credentials"));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your AccuWeather account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="auth-submit-btn">Sign In</button>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
