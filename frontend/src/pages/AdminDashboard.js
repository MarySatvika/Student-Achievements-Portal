import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { achievementAPI } from '../services/api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await achievementAPI.getAllAchievements();
      setAchievements(response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await achievementAPI.updateAchievementStatus(id, status);
      fetchAchievements();
    } catch (error) {
      alert('Error updating status');
    }
  };

  return (
    <div className="admin-container">
      <header className="dashboard-header">
        <div className="header-left"><h2>SAP - Admin</h2></div>
        <nav className="header-nav">
          <button onClick={() => navigate('/dashboard')} className="nav-btn">Dashboard</button>
          <button onClick={() => navigate('/admin')} className="nav-btn active">Admin</button>
        </nav>
      </header>
      
      <main className="admin-main">
        <h1>Achievement Verification</h1>
        
        {loading ? (
          <p>Loading achievements...</p>
        ) : achievements.length === 0 ? (
          <p>No achievements to verify</p>
        ) : (
          <div className="achievements-table">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Achievement</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((achievement) => (
                  <tr key={achievement._id}>
                    <td>{achievement.studentId}</td>
                    <td>{achievement.title}</td>
                    <td>{achievement.category}</td>
                    <td><span className={`badge ${achievement.status}`}>{achievement.status}</span></td>
                    <td>
                      <button onClick={() => updateStatus(achievement._id, 'admin_approved')}>Approve</button>
                      <button onClick={() => updateStatus(achievement._id, 'admin_rejected')}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
