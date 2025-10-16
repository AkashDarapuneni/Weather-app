import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthPages.css';

const SignupPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '',
    address: '', city: '', country: '', zipCode: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:9092/api/auth/signup", formData, {
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
      <div className="auth-container">
        <div className="auth-header">
          <h2>Create Your Account</h2>
          <p>Join AccuWeather for personalized weather experience</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Address *</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>City *</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>ZIP Code *</label>
            <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
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
