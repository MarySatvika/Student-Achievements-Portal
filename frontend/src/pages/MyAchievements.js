import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { achievementAPI } from '../services/api';
import BadgeDisplay from '../components/BadgeDisplay';
import QRCode from 'react-qr-code';

const MyAchievements = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [achievements, setAchievements] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    participation: 'single',
    teamSize: '2',
    teamMembers: '',
    teamName: '',
    date: '',
    level: 'college',
    category: 'academic',
    branch: 'Computer Science',
    proofDocument: null
  });
  
  // Filter state
  const [filterType, setFilterType] = useState('category');
  const [filterValue, setFilterValue] = useState('all');
  
  const branches = [
    'Computer Science', 'Information Technology', 'Electronics and Communication',
    'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
    'Chemical Engineering', 'Biotechnology'
  ];
  
  const categories = ['academic', 'technical', 'sports', 'cultural', 'other'];
  const levels = ['college', 'university', 'state', 'national', 'international'];
  
  // Fetch achievements from backend API
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await achievementAPI.getMyAchievements();
        setAchievements(response.data);
        setFilteredAchievements(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError('Failed to load achievements. Please try again later.');
        setLoading(false);
        
        // Fallback to localStorage if API fails
        const storedAchievements = localStorage.getItem('achievements');
        if (storedAchievements) {
          try {
            const parsed = JSON.parse(storedAchievements);
            setAchievements(parsed);
            setFilteredAchievements(parsed);
          } catch (parseError) {
            console.error('Error parsing stored achievements:', parseError);
          }
        }
      }
    };

    fetchAchievements();
  }, []);
  
  // Apply filters when URL parameters or filter state changes
  useEffect(() => {
    // Parse URL parameters
    const searchParams = new URLSearchParams(location.search);
    const filterParam = searchParams.get('filter');
    const valueParam = searchParams.get('value');
    
    // Set filter state based on URL parameters or existing state
    if (filterParam && valueParam) {
      setFilterType(filterParam);
      setFilterValue(valueParam);
    }
    
    // Apply filtering
    let result = [...achievements];
    
    if (filterValue !== 'all') {
      if (filterType === 'category') {
        result = result.filter(ach => ach.category === filterValue);
      } else if (filterType === 'level') {
        result = result.filter(ach => ach.level === filterValue);
      }
    }
    
    setFilteredAchievements(result);
  }, [filterType, filterValue, achievements, location.search]);
  
  const handleFilterChange = (type, value) => {
    setFilterType(type);
    setFilterValue(value);
    // Update URL without reloading the page
    const searchParams = new URLSearchParams();
    if (value !== 'all') {
      searchParams.set('filter', type);
      searchParams.set('value', value);
    }
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, proofDocument: file });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // In a real app, this would submit to the backend
    // For now, we'll just add to the local list
    
    const newAchievement = {
      id: Date.now(),
      ...formData,
      status: 'pending',
      remarks: 'Pending review'
    };
    
    setAchievements([newAchievement, ...achievements]);
    setFilteredAchievements([newAchievement, ...filteredAchievements]);
    setShowForm(false);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      participation: 'single',
      teamSize: '2',
      teamMembers: '',
      teamName: '',
      date: '',
      level: 'college',
      category: 'academic',
      branch: 'Computer Science',
      proofDocument: null
    });
  };
  
  // Export to CSV function
  const exportToCSV = () => {
    if (filteredAchievements.length === 0) {
      alert('No achievements to export!');
      return;
    }

    const data = filteredAchievements.map(ach => ({
      Title: ach.title,
      Description: ach.description,
      Date: new Date(ach.date).toLocaleDateString(),
      Category: ach.category,
      Level: ach.level,
      Participation: ach.participation === 'team' ? `Team (${ach.teamName})` : 'Single',
      Status: ach.status,
      Remarks: ach.remarks || ''
    }));

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'my_achievements.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (loading) {
    return <div className="loading">Loading achievements...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="achievements-page">
      {/* Header with Navigation */}
      <header className="dashboard-header">
        <div className="header-left">
          <h2 className="sap-logo">SAP</h2>
        </div>
        <nav className="header-nav">
          <button onClick={() => navigate('/dashboard')} className="nav-btn">Dashboard</button>
          <button onClick={() => navigate('/my-achievements')} className="nav-btn active">Achievements</button>
          <button onClick={() => navigate('/profile')} className="nav-btn">Profile</button>
          <button onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }} className="nav-btn logout-btn">Logout</button>
        </nav>
      </header>
      
      <main className="achievements-main">
        {/* Heading and Add Button */}
        <div className="achievements-header">
          <h1 className="achievements-title">Achievements Hub</h1>
          <button 
            className="add-achievement-btn" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add New Achievement'}
          </button>
        </div>
        
        {/* Add Achievement Form */}
        {showForm && (
          <div className="achievement-form-container">
            <form onSubmit={handleSubmit} className="achievement-form">
              <h2>Submit New Achievement</h2>
              
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter achievement title"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe your achievement in detail"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="participation">Participation *</label>
                  <select
                    id="participation"
                    name="participation"
                    value={formData.participation}
                    onChange={handleChange}
                    required
                  >
                    <option value="single">Single</option>
                    <option value="team">Team</option>
                  </select>
                </div>
                
                {formData.participation === 'team' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="teamSize">Team Size *</label>
                      <select
                        id="teamSize"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleChange}
                        required
                      >
                        {Array.from({ length: 9 }, (_, i) => i + 2).map(num => (
                          <option key={num} value={num}>{num} members</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="teamName">Team Name *</label>
                      <input
                        type="text"
                        id="teamName"
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleChange}
                        required
                        placeholder="Enter team name"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="teamMembers">Team Members *</label>
                      <input
                        type="text"
                        id="teamMembers"
                        name="teamMembers"
                        value={formData.teamMembers}
                        onChange={handleChange}
                        required
                        placeholder="Enter member names separated by commas"
                      />
                    </div>
                  </>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="level">Level *</label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    required
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="branch">Branch *</label>
                  <select
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                  >
                    {branches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="proofDocument">Upload File (Optional)</label>
                <input
                  type="file"
                  id="proofDocument"
                  name="proofDocument"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <small>Upload your certificate or proof document (PDF, JPG, PNG)</small>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Submit Achievement
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Filter Section */}
        <div className="filter-section">
          <h3>Apply Filters</h3>
          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="filterType">Filter By:</label>
              <select 
                id="filterType"
                value={filterType} 
                onChange={(e) => handleFilterChange(e.target.value, filterValue)}
              >
                <option value="category">Category</option>
                <option value="level">Level</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="filterValue">Value:</label>
              <select 
                id="filterValue"
                value={filterValue} 
                onChange={(e) => handleFilterChange(filterType, e.target.value)}
              >
                <option value="all">All</option>
                {(filterType === 'category' ? categories : levels).map(item => (
                  <option key={item} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <button 
              className="export-btn" 
              onClick={exportToCSV}
            >
              Export to CSV
            </button>
          </div>
        </div>
        
        {/* Achievements List */}
        <div className="achievements-list">
          {filteredAchievements.length === 0 ? (
            <div className="no-achievements">
              <h3>No achievements found</h3>
              <p>{filterValue === 'all' ? 'You haven\'t submitted any achievements yet.' : 'No achievements match the current filter.'}</p>
              <button onClick={() => setShowForm(true)} className="add-btn">
                Submit Your First Achievement
              </button>
            </div>
          ) : (
            filteredAchievements.map((achievement) => (
              <div key={achievement._id} className="achievement-card">
                <div className="achievement-header">
                  <h3>{achievement.title}</h3>
                  <span className={`status ${getStatusClass(achievement.status)}`}>
                    {achievement.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="achievement-details">
                  <p className="achievement-description">{achievement.description}</p>
                  
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
                      <label>Participation:</label>
                      <span>
                        {achievement.participation === 'team' 
                          ? `Team (${achievement.teamName})` 
                          : 'Single'}
                      </span>
                    </div>
                    
                    <div className="meta-item">
                      <label>Branch:</label>
                      <span>{achievement.branch}</span>
                    </div>
                    
                    <div className="meta-item">
                      <label>Remarks:</label>
                      <span>{achievement.remarks || 'No remarks yet'}</span>
                    </div>
                    
                    {/* Points and Badge */}
                    <div className="meta-item">
                      <label>Points:</label>
                      <span>{achievement.points || 0}</span>
                    </div>
                    
                    {achievement.badge && (
                      <div className="meta-item">
                        <label>Badge:</label>
                        <span>
                          <BadgeDisplay badge={achievement.badge} />
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {achievement.proofDocument && (
                    <div className="proof-section">
                      <label>Uploaded File:</label>
                      <span>{achievement.proofDocument.name || achievement.proofDocument}</span>
                    </div>
                  )}
                  
                  {/* QR Code for approved achievements */}
                  {achievement.status === 'counsellor_approved' && achievement.qrCode && (
                    <div className="qr-code-section" style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                      <label>Verification QR Code:</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                        <div 
                          style={{
                            width: '100px',
                            height: '100px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white'
                          }}
                        >
                          <QRCode value={achievement.qrCode} size={80} />
                        </div>
                        <div>
                          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
                            Scan this QR code to verify your certificate
                          </p>
                          <button 
                            onClick={() => {
                              // Copy verification URL to clipboard
                              const verificationUrl = `http://localhost:3000/verify/${achievement._id}`;
                              navigator.clipboard.writeText(verificationUrl).then(() => {
                                alert('Verification link copied to clipboard!');
                              });
                            }}
                            style={{
                              padding: '8px 15px',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Copy Verification Link
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      
      <footer className="page-footer">
        <p>&copy; 2025 Student Achievement Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MyAchievements;