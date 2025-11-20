import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { achievementAPI } from '../services/api';
import BadgeDisplay from '../components/BadgeDisplay';

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
    // Get user from localStorage
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);
  
  useEffect(() => {
    // Get user from localStorage if not already set
    if (!user) {
      const storedUser = getUserFromStorage();
      if (storedUser) {
        setUser(storedUser);
      } else {
        // Redirect to login if not authenticated
        navigate('/login');
        return;
      }
    }
    
    // Fetch dashboard data
    fetchDashboardData();
    
    // Check if achievement was just submitted
    if (localStorage.getItem('achievementSubmitted') === 'true') {
      // Clear the flag
      localStorage.removeItem('achievementSubmitted');
      // Refresh data after a short delay to ensure backend processing
      setTimeout(fetchDashboardData, 1000);
    }
    
    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  const fetchDashboardData = async () => {
    try {
      // Fetch achievements data
      const achievementsResponse = await achievementAPI.getMyAchievements();
      const achievements = achievementsResponse.data;
      
      // Calculate stats from achievements
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
      
      // Get recent achievements (last 5)
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
  
  // Category data for pie chart
  const categoryData = [
    { name: 'Academic', value: 6 },
    { name: 'Technical', value: 4 },
    { name: 'Sports', value: 3 },
    { name: 'Cultural', value: 2 }
  ];
  
  // Level data for pie chart
  const levelData = [
    { name: 'College', value: 7 },
    { name: 'State', value: 5 },
    { name: 'National', value: 2 },
    { name: 'International', value: 1 }
  ];
  
  // Monthly trend data for line chart
  const monthlyData = [
    { month: 'Jun', achievements: 2 },
    { month: 'Jul', achievements: 3 },
    { month: 'Aug', achievements: 1 },
    { month: 'Sep', achievements: 4 },
    { month: 'Oct', achievements: 3 },
    { month: 'Nov', achievements: 2 }
  ];
  
  const COLORS = ['#667eea', '#f093fb', '#4facfe', '#43e97b'];
  
  const handleCategoryClick = (category) => {
    alert(`You clicked on: ${category.name}\nThis segment represents achievements in the ${category.name} category.`);
  };
  
  const handleLevelClick = (level) => {
    alert(`You clicked on: ${level.name}\nThis segment represents achievements at the ${level.name} level.`);
  };
  
  if (user === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="student-dashboard">
  
      <header className="dashboard-header">
        <div className="header-left">
          <h2 className="sap-logo">SAP</h2>
        </div>
        <nav className="header-nav">
          <button onClick={() => navigate('/dashboard')} className="nav-btn active">Dashboard</button>
          <button onClick={() => navigate('/my-achievements')} className="nav-btn">Achievements</button>
          <button onClick={() => navigate('/profile')} className="nav-btn">Profile</button>
          <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
        </nav>
      </header>
      
      <main className="dashboard-main">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <img 
              src="fav-icon.ico" 
              alt="Student Achievement Portal Logo" 
              className="dashboard-logo"
              style={{ width: '80px', height: '80px' }}
            />
            <div>
              <h1>Welcome, {user.name || user.firstName + ' ' + user.lastName}!</h1>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>
                Track and showcase your academic and extracurricular achievements
              </p>
            </div>
            <button 
              onClick={fetchDashboardData}
              style={{
                padding: '10px 20px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                alignSelf: 'flex-start'
              }}
            >
              Refresh Data
            </button>
          </div>
        </section>
        
        {/* Points and Badge Section */}
        <section className="points-badge-section" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '30px', 
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          <div className="points-card" style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            minWidth: '200px',
            position: 'relative'
          }}>
            <img 
              src="/fav-icon.ico" 
              alt="Points Icon" 
              className="dashboard-icon"
              style={{ width: '50px', height: '50px', position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)' }}
            />
            <h3 style={{ marginTop: '30px' }}>Total Points</h3>
            <p className="points-number" style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#667eea',
              margin: '10px 0'
            }}>
              {stats.totalPoints}
            </p>
          </div>
          
          <div className="badge-card" style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            minWidth: '200px',
            position: 'relative'
          }}>
            <img 
              src="/fav-icon.ico" 
              alt="Badge Icon" 
              className="dashboard-icon"
              style={{ width: '50px', height: '50px', position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)' }}
            />
            <h3 style={{ marginTop: '30px' }}>Current Badge</h3>
            <div style={{ margin: '10px 0' }}>
              <BadgeDisplay badge={stats.highestBadge} size="large" />
            </div>
          </div>
        </section>
        
        {/* Stats Cards */}
        <section className="stats-section">
          <div className="stat-card total">
            <h3>Total Achievements</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
          <div className="stat-card approved">
            <h3>Total Approved</h3>
            <p className="stat-number">{stats.approved}</p>
          </div>
          <div className="stat-card pending">
            <h3>Pending</h3>
            <p className="stat-number">{stats.pending}</p>
          </div>
          <div className="stat-card rejected">
            <h3>Rejected</h3>
            <p className="stat-number">{stats.rejected}</p>
          </div>
        </section>
        
        {/* Overview Section with Charts */}
        <section className="overview-section">
          <h2>Overview</h2>
          <div className="charts-container">
            <div className="chart-box">
              <h3>Achievements by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    style={{ cursor: 'pointer' }}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        onClick={() => handleCategoryClick(entry)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-box">
              <h3>Achievements by Level</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={levelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    style={{ cursor: 'pointer' }}
                  >
                    {levelData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        onClick={() => handleLevelClick(entry)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Line Chart for Monthly Trend */}
          <div className="line-chart-container">
            <h3>Monthly Achievement Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="achievements" stroke="#667eea" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
        
        {/* Recent Achievements */}
        <section className="recent-section">
          <h2>Recent Achievements</h2>
          <div className="achievements-list">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="achievement-item" onClick={() => navigate('/my-achievements')}>
                <div className="achievement-info">
                  <h4>{achievement.title}</h4>
                  <p className="achievement-category">{achievement.category}</p>
                </div>
                <div className="achievement-meta">
                  <span className={`status-badge ${achievement.status.toLowerCase()}`}>
                    {achievement.status}
                  </span>
                  <span className="achievement-date">{achievement.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
