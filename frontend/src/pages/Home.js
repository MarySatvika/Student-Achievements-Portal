import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="home-container">
        <div className="home-header">
          <h1 className="home-main-title">
            <span className="gradient-text">Student Achievement Portal</span>
          </h1>
          <p className="home-subtitle">Empowering Students, Celebrating Success</p>
          <p className="home-tagline">Track, Verify, and Showcase Your Academic Excellence</p>
        </div>

        <div className="home-actions">
          <button 
            className="home-btn login-btn"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button 
            className="home-btn register-btn"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>

        <div className="home-features">
          <div className="feature-card">
            <h3>📚 Submit Achievements</h3>
            <p>Easily submit and track your academic accomplishments</p>
          </div>
          <div className="feature-card">
            <h3>✅ Faculty Review</h3>
            <p>Get your achievements verified by faculty members</p>
          </div>
          <div className="feature-card">
            <h3>📊 Track Progress</h3>
            <p>Monitor your academic journey in one place</p>
          </div>
          <div className="feature-card">
            <h3>🔒 QR Code Verification</h3>
            <p>Verify your certificates with secure QR codes</p>
          </div>
        </div>

        <div className="home-stats">
          <div className="stat-card">
            <h2>1000+</h2>
            <p>Students Registered</p>
          </div>
          <div className="stat-card">
            <h2>5000+</h2>
            <p>Achievements Submitted</p>
          </div>
          <div className="stat-card">
            <h2>98%</h2>
            <p>Verification Rate</p>
          </div>
        </div>

        <div className="home-university">
          <h2>Proudly Serving</h2>
          <p>Vignan's Foundation for Science, Technology and Research</p>
          <div className="university-logo">
            <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>VFSTR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;