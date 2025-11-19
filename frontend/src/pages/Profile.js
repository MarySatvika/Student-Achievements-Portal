import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <header className="dashboard-header">
        <div className="header-left"><h2>SAP</h2></div>
        <nav className="header-nav">
          <button onClick={() => navigate('/dashboard')} className="nav-btn">Dashboard</button>
          <button onClick={() => navigate('/my-achievements')} className="nav-btn">Achievements</button>
          <button onClick={() => navigate('/profile')} className="nav-btn active">Profile</button>
          <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
        </nav>
      </header>
      
      <main className="profile-main">
        <h1>My Profile</h1>
        <div className="profile-card">
          <div className="profile-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            {user.studentId && <p><strong>Student ID:</strong> {user.studentId}</p>}
            {user.branch && <p><strong>Branch:</strong> {user.branch}</p>}
          </div>
          <button className="btn-edit" onClick={() => setEditing(!editing)}>
            {editing ? 'Save' : 'Edit Profile'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
