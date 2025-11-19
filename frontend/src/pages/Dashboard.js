import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { achievementAPI } from '../services/api';
import BadgeDisplay from '../components/BadgeDisplay';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    totalPoints: 0,
    highestBadge: 'participant'
  });
  const [recentAchievements, setRecentAchievements] = useState([]);
  
  const getUserFromStorage = () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  };
  
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);
  
  useEffect(() => {
    if (!user) {
      const storedUser = getUserFromStorage();
      if (storedUser) {
        setUser(storedUser);
      } else {
        navigate('/login');
        return;
      }
    }
    
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [user]);
  
  const fetchDashboardData = async () => {
    try {
      const achievementsResponse = await achievementAPI.getMyAchievements();
      const achievements = achievementsResponse.data;
      
      const total = achievements.length;
      const approved = achievements.filter(a => a.status === 'admin_approved').length;
      const pending = achievements.filter(a => a.status === 'pending' || a.status === 'counsellor_approved').length;
      const rejected = achievements.filter(a => a.status === 'counsellor_rejected' || a.status === 'admin_rejected').length;
      
      setStats(prevStats => ({
        ...prevStats,
        total,
        approved,
        pending,
        rejected
      }));
      
      const recent = achievements
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(a => ({
          id: a._id,
          title: a.title,
          category: a.category,
          status: a.status.replace('_', ' '),
          date: new Date(a.date).toLocaleDateString()
        }));
        
      setRecentAchievements(recent);
      
      try {
        const statsResponse = await achievementAPI.getUserStats();
        const userStats = statsResponse.data;
        
        setStats(prevStats => ({
          ...prevStats,
          totalPoints: userStats.totalPoints || 0,
          highestBadge: (userStats.highestBadge || 'participant').toLowerCase()
        }));
      } catch (statsError) {
        console.error('Error fetching user stats:', statsError);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      alert('Error fetching dashboard data. Please try again.');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const categoryData = [
    { name: 'Academic', value: 6 },
    { name: 'Technical', value: 4 },
    { name: 'Sports', value: 3 },
    { name: 'Cultural', value: 2 }
  ];
  
  const levelData = [
    { name: 'College', value: 7 },
    { name: 'State', value: 5 },
    { name: 'National', value: 2 },
    { name: 'International', value: 1 }
  ];
  
  const monthlyData = [
    { month: 'Jun', achievements: 2 },
    { month: 'Jul', achievements: 3 },
    { month: 'Aug', achievements: 1 },
    { month: 'Sep', achievements: 4 },
    { month: 'Oct', achievements: 3 },
    { month: 'Nov', achievements: 2 }
  ];
  
  const COLORS = ['#667eea', '#f093fb', '#4facfe', '#43e97b'];
  
  if (user === null) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }
  
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <div className="header-left"><h2 className="sap-logo">SAP</h2></div>
        <nav className="header-nav">
          <button onClick={() => navigate('/dashboard')} className="nav-btn active">Dashboard</button>
          <button onClick={() => navigate('/my-achievements')} className="nav-btn">Achievements</button>
          <button onClick={() => navigate('/profile')} className="nav-btn">Profile</button>
          <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
        </nav>
      </header>
      
      <main className="dashboard-main">
        <section className="welcome-section">
          <h1>Welcome, {user.name || user.firstName + ' ' + user.lastName}!</h1>
          <p>Track and showcase your achievements</p>
        </section>
        
        <section className="stats-section">
          <div className="stat-card total"><h3>Total Achievements</h3><p className="stat-number">{stats.total}</p></div>
          <div className="stat-card approved"><h3>Approved</h3><p className="stat-number">{stats.approved}</p></div>
          <div className="stat-card pending"><h3>Pending</h3><p className="stat-number">{stats.pending}</p></div>
          <div className="stat-card rejected"><h3>Rejected</h3><p className="stat-number">{stats.rejected}</p></div>
        </section>
        
        <section className="recent-section">
          <h2>Recent Achievements</h2>
          <div className="achievements-list">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="achievement-item">
                <h4>{achievement.title}</h4>
                <span className={`status-badge ${achievement.status.toLowerCase()}`}>{achievement.status}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
