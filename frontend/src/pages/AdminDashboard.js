import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Check authentication and load data
  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
      } catch (error) {
        return null;
      }
    };
    
    const userData = getUserFromStorage();
    setUser(userData);
    
    // Redirect if not authenticated or not admin
    if (!userData) {
      navigate('/login');
      return;
    }
    
    if (userData.role !== 'admin') {
      // Redirect to appropriate dashboard
      if (userData.role === 'student') {
        navigate('/dashboard');
      } else if (userData.role === 'faculty' || userData.role === 'counsellor') {
        navigate('/faculty-dashboard');
      } else {
        navigate('/login');
      }
      return;
    }
    
    // Load mock data for admin
    setTimeout(() => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student', department: 'Computer Science', isActive: true },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'faculty', department: 'Computer Science', isActive: true },
        { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', department: 'Administration', isActive: true },
        { id: 4, name: 'Mike Johnson', email: 'mike@example.com', role: 'student', department: 'Mechanical Engineering', isActive: true },
      ];
      
      const mockAchievements = [
        { id: 1, title: 'Coding Competition Winner', student: 'John Doe', category: 'technical', status: 'approved', date: '2023-03-15' },
        { id: 2, title: 'Research Paper Published', student: 'Jane Smith', category: 'academic', status: 'pending', date: '2023-05-20' },
        { id: 3, title: 'Basketball Champion', student: 'Mike Johnson', category: 'sports', status: 'approved', date: '2023-02-10' },
      ];
      
      const mockStats = [
        { department: 'Computer Science', approved: 15, pending: 3, rejected: 1 },
        { department: 'Mechanical Engineering', approved: 8, pending: 2, rejected: 0 },
        { department: 'Electrical Engineering', approved: 12, pending: 5, rejected: 2 },
        { department: 'Civil Engineering', approved: 7, pending: 1, rejected: 1 },
      ];
      
      setUsers(mockUsers);
      setAchievements(mockAchievements);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Show loading state while checking authentication
  if (user === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }
  
  // Redirect if not authenticated or not admin
  if (!user) {
    return null;
  }
  
  if (user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <img 
            src="/logo512.png" 
            alt="Admin Dashboard Logo" 
            className="dashboard-logo"
            style={{ width: '80px', height: '80px' }}
          />
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage users and view institutional achievement statistics</p>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/profile')} className="btn-secondary">Profile</button>
          <button onClick={handleLogout} className="btn-danger">Logout</button>
        </div>
      </header>
      
      <div className="dashboard-stats">
        <div className="summary-cards">
          <div className="card" style={{ position: 'relative' }}>
            <img 
              src="/logo192.png" 
              alt="Users Icon" 
              className="dashboard-icon"
              style={{ width: '40px', height: '40px', position: 'absolute', top: '10px', right: '10px' }}
            />
            <h3>Total Users</h3>
            <p className="card-value">{users.length}</p>
          </div>
          
          <div className="card" style={{ position: 'relative' }}>
            <img 
              src="/logo192.png" 
              alt="Achievements Icon" 
              className="dashboard-icon"
              style={{ width: '40px', height: '40px', position: 'absolute', top: '10px', right: '10px' }}
            />
            <h3>Total Achievements</h3>
            <p className="card-value">{achievements.length}</p>
          </div>
          
          <div className="card" style={{ position: 'relative' }}>
            <img 
              src="/logo192.png" 
              alt="Pending Icon" 
              className="dashboard-icon"
              style={{ width: '40px', height: '40px', position: 'absolute', top: '10px', right: '10px' }}
            />
            <h3>Pending Approvals</h3>
            <p className="card-value">
              {achievements.filter(a => a.status === 'pending').length}
            </p>
          </div>
          
          <div className="card" style={{ position: 'relative' }}>
            <img 
              src="/logo192.png" 
              alt="Departments Icon" 
              className="dashboard-icon"
              style={{ width: '40px', height: '40px', position: 'absolute', top: '10px', right: '10px' }}
            />
            <h3>Active Departments</h3>
            <p className="card-value">
              {new Set(users.filter(u => u.role !== 'admin').map(u => u.department)).size}
            </p>
          </div>
        </div>
        
        <div className="chart-container">
          <h3>Achievements by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="approved" fill="#00C49F" name="Approved" />
              <Bar dataKey="pending" fill="#FFBB28" name="Pending" />
              <Bar dataKey="rejected" fill="#FF8042" name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="user-management">
        <h2>User Management</h2>
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.department}</td>
                  <td>
                    <span className={`status ${user.isActive ? 'status-active' : 'status-inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-edit">Edit</button>
                    <button className="btn-toggle">
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="reports-section">
        <h2>Reports & Exports</h2>
        <div className="report-cards">
          <div className="report-card">
            <h3>Section-wise Data</h3>
            <p>View detailed statistics and achievements for specific sections</p>
            <button className="btn-export" onClick={() => navigate('/section-data')}>View Section Data</button>
          </div>
          
          <div className="report-card">
            <h3>Department-wise Achievements</h3>
            <p>Export detailed achievement reports by department</p>
            <button className="btn-export">Export CSV</button>
          </div>
          
          <div className="report-card">
            <h3>Student Achievement Summary</h3>
            <p>Export comprehensive student achievement records</p>
            <button className="btn-export">Export PDF</button>
          </div>
          
          <div className="report-card">
            <h3>NAAC/AICTE Report</h3>
            <p>Generate compliance report for institutional audits</p>
            <button className="btn-export">Generate Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;