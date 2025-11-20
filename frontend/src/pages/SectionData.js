import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SectionData = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [sectionData, setSectionData] = useState(null);
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
    
    // Load mock data for sections
    setTimeout(() => {
      const mockSections = [
        { id: 1, name: 'Section 1', department: 'Computer Science' },
        { id: 2, name: 'Section 2', department: 'Computer Science' },
        { id: 3, name: 'Section 3', department: 'Mechanical Engineering' },
        { id: 4, name: 'Section 4', department: 'Electrical Engineering' },
        { id: 5, name: 'Section 5', department: 'Civil Engineering' },
      ];
      
      setSections(mockSections);
      setLoading(false);
    }, 1000);
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  // Load section data when a section is selected
  useEffect(() => {
    if (selectedSection) {
      setLoading(true);
      // Simulate API call to fetch section data
      setTimeout(() => {
        const mockSectionData = {
          sectionInfo: {
            name: `Section ${selectedSection}`,
            department: 'Computer Science',
            studentCount: 60,
            faculty: 'Dr. Smith'
          },
          achievements: [
            { id: 1, title: 'Coding Competition Winner', student: 'John Doe', category: 'technical', status: 'approved', date: '2023-03-15' },
            { id: 2, title: 'Research Paper Published', student: 'Jane Smith', category: 'academic', status: 'pending', date: '2023-05-20' },
            { id: 3, title: 'Basketball Champion', student: 'Mike Johnson', category: 'sports', status: 'approved', date: '2023-02-10' },
            { id: 4, title: 'Hackathon Participation', student: 'Sarah Williams', category: 'technical', status: 'approved', date: '2023-04-05' },
          ],
          stats: [
            { category: 'Academic', count: 12 },
            { category: 'Technical', count: 18 },
            { category: 'Sports', count: 8 },
            { category: 'Cultural', count: 5 },
            { category: 'Other', count: 3 },
          ],
          statusStats: [
            { name: 'Approved', value: 25 },
            { name: 'Pending', value: 7 },
            { name: 'Rejected', value: 3 },
          ]
        };
        
        setSectionData(mockSectionData);
        setLoading(false);
      }, 800);
    }
  }, [selectedSection]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
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
  
  if (loading && !sections.length) {
    return <div className="loading">Loading sections...</div>;
  }
  
  return (
    <div className="section-data-page">
      <header className="dashboard-header">
        <h1>Section-wise Data</h1>
        <p>View detailed statistics and achievements for specific sections</p>
        <div className="header-actions">
          <button onClick={() => navigate('/admin-dashboard')} className="btn-secondary">Back to Admin Dashboard</button>
          <button onClick={() => navigate('/profile')} className="btn-secondary">Profile</button>
          <button onClick={handleLogout} className="btn-danger">Logout</button>
        </div>
      </header>
      
      <div className="section-selector">
        <h2>Select Section</h2>
        <div className="form-group">
          <label htmlFor="sectionSelect">Choose a section to view data:</label>
          <select 
            id="sectionSelect"
            value={selectedSection} 
            onChange={(e) => setSelectedSection(e.target.value)}
            className="form-control"
          >
            <option value="">-- Select Section --</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name} - {section.department}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {loading && selectedSection && (
        <div className="loading">Loading section data...</div>
      )}
      
      {sectionData && !loading && (
        <div className="section-data-content">
          <div className="section-info">
            <h2>{sectionData.sectionInfo.name} Details</h2>
            <div className="info-cards">
              <div className="card">
                <h3>Department</h3>
                <p>{sectionData.sectionInfo.department}</p>
              </div>
              <div className="card">
                <h3>Students</h3>
                <p>{sectionData.sectionInfo.studentCount}</p>
              </div>
              <div className="card">
                <h3>Faculty</h3>
                <p>{sectionData.sectionInfo.faculty}</p>
              </div>
            </div>
          </div>
          
          <div className="charts-section">
            <div className="chart-container">
              <h3>Achievements by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectionData.stats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Achievements" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-container">
              <h3>Achievement Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sectionData.statusStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sectionData.statusStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="achievements-section">
            <h2>Recent Achievements</h2>
            <div className="achievements-table">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionData.achievements.map((achievement) => (
                    <tr key={achievement.id}>
                      <td>{achievement.student}</td>
                      <td>{achievement.title}</td>
                      <td>{achievement.category}</td>
                      <td>
                        <span className={`status status-${achievement.status}`}>
                          {achievement.status}
                        </span>
                      </td>
                      <td>{achievement.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionData;