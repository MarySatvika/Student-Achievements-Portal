import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { achievementAPI } from '../services/api';
import '../styles/MyAchievements.css';

const MyAchievements = () => {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await achievementAPI.getMyAchievements();
      setAchievements(response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="achievements-container">
      <header className="dashboard-header">
        <div className="header-left"><h2>SAP</h2></div>
        <nav className="header-nav">
          <button onClick={() => navigate('/dashboard')} className="nav-btn">Dashboard</button>
          <button onClick={() => navigate('/my-achievements')} className="nav-btn active">Achievements</button>
          <button onClick={() => navigate('/profile')} className="nav-btn">Profile</button>
        </nav>
      </header>
      
      <main className="achievements-main">
        <h1>My Achievements</h1>
        <button onClick={() => navigate('/submit-achievement')} className="btn-submit">Submit New Achievement</button>
        
        {loading ? (
          <p>Loading achievements...</p>
        ) : achievements.length === 0 ? (
          <p>No achievements yet. Start by submitting your first achievement!</p>
        ) : (
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div key={achievement._id} className="achievement-card">
                <h3>{achievement.title}</h3>
                <p><strong>Category:</strong> {achievement.category}</p>
                <p><strong>Status:</strong> <span className={`badge ${achievement.status}`}>{achievement.status}</span></p>
                <p><strong>Date:</strong> {new Date(achievement.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyAchievements;
