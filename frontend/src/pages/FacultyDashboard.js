import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  
  // Get user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  // In a real app, this would be an API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockAchievements = [
        {
          id: 1,
          title: 'First Prize in Coding Competition',
          student: 'John Doe',
          studentId: 'CS123456',
          date: '2023-03-15',
          category: 'technical',
          level: 'college',
          status: 'pending',
          department: 'Computer Science',
          description: 'Won first prize in inter-college coding competition'
        },
        {
          id: 2,
          title: 'Published Research Paper',
          student: 'Jane Smith',
          studentId: 'CS123457',
          date: '2023-05-20',
          category: 'academic',
          level: 'national',
          status: 'pending',
          department: 'Computer Science',
          description: 'Research paper published in national journal'
        },
        {
          id: 3,
          title: 'State Level Basketball Champion',
          student: 'Mike Johnson',
          studentId: 'PE123456',
          date: '2023-02-10',
          category: 'sports',
          level: 'state',
          status: 'approved',
          department: 'Physical Education',
          description: 'Won state championship in basketball'
        },
        {
          id: 4,
          title: 'Cultural Fest Winner',
          student: 'Sarah Wilson',
          studentId: 'CS123458',
          date: '2023-04-15',
          category: 'cultural',
          level: 'college',
          status: 'rejected',
          department: 'Computer Science',
          description: 'First prize in cultural fest dance competition',
          rejectionReason: 'Insufficient proof documents'
        },
        {
          id: 5,
          title: 'Hackathon Winner',
          student: 'Alex Chen',
          studentId: 'CS123459',
          date: '2023-06-10',
          category: 'technical',
          level: 'university',
          status: 'pending',
          department: 'Computer Science',
          description: 'Won university level hackathon competition'
        }
      ];
      
      setAchievements(mockAchievements);
      setStats({
        total: mockAchievements.length,
        approved: mockAchievements.filter(a => a.status === 'approved').length,
        pending: mockAchievements.filter(a => a.status === 'pending').length,
        rejected: mockAchievements.filter(a => a.status === 'rejected').length
      });
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const handleStatusChange = (id, status, rejectionReason = '') => {
    // In a real app, this would be an API call
    setAchievements(achievements.map(ach => 
      ach.id === id ? { ...ach, status, rejectionReason } : ach
    ));
    
    // Update stats
    setStats({
      total: achievements.length,
      approved: achievements.filter(a => a.id === id ? status === 'approved' : a.status === 'approved').length,
      pending: achievements.filter(a => a.id === id ? status === 'pending' : a.status === 'pending').length,
      rejected: achievements.filter(a => a.id === id ? status === 'rejected' : a.status === 'rejected').length
    });
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  // Handle chart segment clicks
  const handleCategoryClick = (category) => {
    alert(`You clicked on: ${category.name}\nThis segment represents achievements in the ${category.name} category.`);
  };
  
  const handleLevelClick = (level) => {
    alert(`You clicked on: ${level.name}\nThis segment represents achievements at the ${level.name} level.`);
  };
  
  // Export to CSV function
  const exportToCSV = (data, filename) => {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Export filtered achievements
  const exportAchievements = () => {
    const data = filteredAchievements.map(ach => ({
      ID: ach.id,
      Title: ach.title,
      Student: ach.student,
      'Student ID': ach.studentId,
      Date: ach.date,
      Category: ach.category,
      Level: ach.level,
      Status: ach.status,
      Department: ach.department,
      'Rejection Reason': ach.rejectionReason || ''
    }));
    const statusLabel = filter === 'all' ? 'all' : filter;
    exportToCSV(data, `achievements_${statusLabel}.csv`);
  };
  
  const filteredAchievements = filter === 'all' 
    ? achievements 
    : achievements.filter(ach => ach.status === filter);
  
  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }
  
  if (!user) {
    return <div className="error">User not found. Please login again.</div>;
  }
  
  return (
    <div className="faculty-dashboard">
      {/* Header with Navigation */}
      <header className="dashboard-header">
        <div className="header-left">
          <h2 className="sap-logo">SAP</h2>
        </div>
        <nav className="header-nav">
          <button onClick={() => navigate('/faculty-dashboard')} className="nav-btn active">Dashboard</button>
          <button onClick={() => navigate('/profile')} className="nav-btn">Profile</button>
          <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
        </nav>
      </header>
      
      <main className="dashboard-main">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <img 
              src="/fav-icon.ico" 
              alt="Faculty Dashboard Logo" 
              className="dashboard-logo"
              style={{ width: '80px', height: '80px' }}
            />
            <div>
              <h1>Welcome, {user.name || user.firstName + ' ' + user.lastName}!</h1>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>
                Review and approve student achievements
              </p>
            </div>
          </div>
        </section>
        
        {/* Charts Section */}
        <section className="charts-section">
          <h2>Achievement Distribution</h2>
          <div className="charts-container">
            <div className="chart-box">
              <h3>By Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Academic', value: 12 },
                      { name: 'Sports', value: 8 },
                      { name: 'Technical', value: 15 },
                      { name: 'Cultural', value: 5 },
                      { name: 'Other', value: 3 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    style={{ cursor: 'pointer' }}
                  >
                    {[
                      { name: 'Academic', value: 12 },
                      { name: 'Sports', value: 8 },
                      { name: 'Technical', value: 15 },
                      { name: 'Cultural', value: 5 },
                      { name: 'Other', value: 3 }
                    ].map((entry, index) => (
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
              <h3>By Level</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'College', value: 20 },
                      { name: 'University', value: 12 },
                      { name: 'State', value: 8 },
                      { name: 'National', value: 3 },
                      { name: 'International', value: 1 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    style={{ cursor: 'pointer' }}
                  >
                    {[
                      { name: 'College', value: 20 },
                      { name: 'University', value: 12 },
                      { name: 'State', value: 8 },
                      { name: 'National', value: 3 },
                      { name: 'International', value: 1 }
                    ].map((entry, index) => (
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
            
            <div className="chart-box">
              <h3>Monthly Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[
                    { month: 'Jan', achievements: 5 },
                    { month: 'Feb', achievements: 8 },
                    { month: 'Mar', achievements: 12 },
                    { month: 'Apr', achievements: 7 },
                    { month: 'May', achievements: 10 },
                    { month: 'Jun', achievements: 6 }
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="achievements" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
        
        {/* Stats Cards */}
        <section className="stats-section">
          <div className="stat-card total" style={{ position: 'relative' }}>
            <img 
              src="/fav-icon.ico" 
              alt="Total Achievements Icon" 
              className="dashboard-icon"
              style={{ width: '30px', height: '30px', position: 'absolute', top: '10px', right: '10px' }}
            />
            <h3>Total Achievements</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
          <div className="stat-card approved" style={{ position: 'relative' }}>
            <img 
              src="/fav-icon.ico" 
              alt="Approved Icon" 
              className="dashboard-icon"
              style={{ width: '30px', height: '30px', position: 'absolute', top: '10px', right: '10px' }}
            />
            <h3>Approved</h3>
            <p className="stat-number">{stats.approved}</p>
          </div>
          <div className="stat-card pending" style={{ position: 'relative' }}>
            <img 
              src="/fav-icon.ico" 
              alt="Pending Icon" 
              className="dashboard-icon"
              style={{ width: '30px', height: '30px', position: 'absolute', top: '10px', right: '10px' }}
            />
            <h3>Pending</h3>
            <p className="stat-number">{stats.pending}</p>
          </div>
          <div className="stat-card rejected" style={{ position: 'relative' }}>
            <img 
              src="/fav-icon.ico" 
              alt="Rejected Icon" 
              className="dashboard-icon"
              style={{ width: '30px', height: '30px', position: 'absolute', top: '10px', right: '10px' }}
            />
            <h3>Rejected</h3>
            <p className="stat-number">{stats.rejected}</p>
          </div>
        </section>
        
        {/* Achievements to Review */}
        <section className="pending-achievements">
          <div className="achievements-header">
            <h2>Achievements to Review</h2>
            <div className="filter-controls">
              <label>Filter by status:</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button 
                className="btn-export" 
                onClick={exportAchievements}
              >
                Export to CSV
              </button>
            </div>
          </div>
          
          <div className="achievements-list">
            {filteredAchievements.map((achievement) => (
              <div key={achievement.id} className="achievement-card">
                <div className="achievement-header">
                  <h3>{achievement.title}</h3>
                  <span className={`status status-${achievement.status}`}>
                    {achievement.status}
                  </span>
                </div>
                
                <div className="achievement-details">
                  <p>{achievement.description}</p>
                  
                  <div className="student-info">
                    <div className="meta-item">
                      <label>Student:</label>
                      <span>{achievement.student} ({achievement.studentId})</span>
                    </div>
                  </div>
                  
                  <div className="achievement-meta">
                    <div className="meta-item">
                      <label>Date:</label>
                      <span>{new Date(achievement.date).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="meta-item">
                      <label>Category:</label>
                      <span>{achievement.category}</span>
                    </div>
                    
                    <div className="meta-item">
                      <label>Level:</label>
                      <span>{achievement.level}</span>
                    </div>
                    
                    <div className="meta-item">
                      <label>Department:</label>
                      <span>{achievement.department}</span>
                    </div>
                  </div>
                  
                  {achievement.rejectionReason && (
                    <div className="rejection-reason">
                      <label>Rejection Reason:</label>
                      <span>{achievement.rejectionReason}</span>
                    </div>
                  )}
                  
                  {achievement.status === 'pending' && (
                    <div className="action-buttons">
                      <button 
                        className="btn-approve"
                        onClick={() => handleStatusChange(achievement.id, 'approved')}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn-reject"
                        onClick={() => {
                          const reason = prompt('Enter rejection reason:');
                          if (reason !== null) {
                            handleStatusChange(achievement.id, 'rejected', reason);
                          }
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="page-footer">
        <p>&copy; 2025 Student Achievement Portal. All rights reserved.</p>
      </footer>
      
      {selectedAchievement && (
        <div className="modal-overlay" onClick={() => setSelectedAchievement(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedAchievement.title}</h2>
            
            <div className="modal-details">
              <p><strong>Student:</strong> {selectedAchievement.student} ({selectedAchievement.studentId})</p>
              <p><strong>Date:</strong> {new Date(selectedAchievement.date).toLocaleDateString()}</p>
              <p><strong>Category:</strong> {selectedAchievement.category}</p>
              <p><strong>Level:</strong> {selectedAchievement.level}</p>
              <p><strong>Department:</strong> {selectedAchievement.department}</p>
            </div>
  
            <div className="modal-description">
              <strong>Description:</strong>
              <p>{selectedAchievement.description}</p>
            </div>
            
            {selectedAchievement.status === 'pending' && (
              <div className="modal-actions">
                <button 
                  className="btn-approve"
                  onClick={() => {
                    handleStatusChange(selectedAchievement.id, 'approved');
                    setSelectedAchievement(null);
                  }}
                >
                  ✓ Approve
                </button>
                <button 
                  className="btn-reject"
                  onClick={() => {
                    const reason = prompt('Enter rejection reason:');
                    if (reason !== null) {
                      handleStatusChange(selectedAchievement.id, 'rejected', reason);
                      setSelectedAchievement(null);
                    }
                  }}
                >
                  ✗ Reject
                </button>
              </div>
            )}
            
            <button 
              className="btn-close"
              onClick={() => setSelectedAchievement(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
