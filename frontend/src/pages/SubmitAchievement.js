import React, { useState, useEffect } from 'react';
import { achievementAPI } from '../services/api';
import './SubmitAchievement.css';

const SubmitAchievement = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: 'academic',
    level: 'college',
    department: '',
    proofDocument: null
  });
  
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Get user data from localStorage
  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
      } catch (error) {
        return null;
      }
    };
    
    const user = getUserFromStorage();
    if (user && user.department) {
      setFormData(prevData => ({
        ...prevData,
        department: user.department || ''
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, proofDocument: file });
      
      // Create preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.date || 
        !formData.category || !formData.level || !formData.department) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    try {
      // Prepare data to send (without file upload for now)
      const dataToSend = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        category: formData.category,
        level: formData.level,
        department: formData.department,
        proofDocument: formData.proofDocument ? formData.proofDocument.name : '' // Send filename only
      };
      
      // Send to backend API
      await achievementAPI.create(dataToSend);
      
      setLoading(false);
      setSuccess(true);
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        category: 'academic',
        level: 'college',
        department: formData.department, // Keep department filled
        proofDocument: null
      });
      setPreview(null);
      
      // Set flag to trigger dashboard refresh and redirect
      localStorage.setItem('achievementSubmitted', 'true');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err) {
      console.error('Error submitting achievement:', err);
      setError(err.response?.data?.message || 'Failed to submit achievement. Please try again.');
      setLoading(false);
    }
  };

  // Function to get points based on level
  const getPointsForLevel = (level) => {
    const points = {
      'college': 10,
      'university': 20,
      'state': 30,
      'national': 50,
      'international': 100
    };
    return points[level] || 0;
  };

  return (
    <div className="submit-achievement">
      <div className="form-container">
        <div className="form-header">
          <h1>Submit New Achievement</h1>
          <p>Fill in the details below to submit your achievement for verification</p>
        </div>
        
        <div className="points-info" style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Points & Badges System</h3>
          <p>Earn points based on your achievement level:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>College Level:</strong> 10 points</li>
            <li><strong>University Level:</strong> 20 points</li>
            <li><strong>State Level:</strong> 30 points</li>
            <li><strong>National Level:</strong> 50 points</li>
            <li><strong>International Level:</strong> 100 points</li>
          </ul>
          <p>Badges are awarded based on total points:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>Participant:</strong> Below 50 points</li>
            <li><strong>Bronze:</strong> 50-69 points</li>
            <li><strong>Silver:</strong> 70-99 points</li>
            <li><strong>Gold:</strong> 100+ points</li>
          </ul>
        </div>
        
        {success && (
          <div className="alert alert-success">
            Achievement submitted successfully! It will be reviewed by faculty.
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="achievement-form">
          <div className="form-group">
            <label htmlFor="title">Achievement Title *</label>
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
              <label htmlFor="date">Date of Achievement *</label>
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
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="academic">Academic</option>
                <option value="sports">Sports</option>
                <option value="technical">Technical</option>
                <option value="cultural">Cultural</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="level">Level of Achievement *</label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
              >
                <option value="college">College</option>
                <option value="university">University</option>
                <option value="state">State</option>
                <option value="national">National</option>
                <option value="international">International</option>
              </select>
              <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                Points: {getPointsForLevel(formData.level)}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                placeholder="Enter department name"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="proofDocument">Proof Document/Certificate (Optional)</label>
            <input
              type="file"
              id="proofDocument"
              name="proofDocument"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <small style={{ color: '#666', fontSize: '12px' }}>Upload your certificate or proof document</small>
            {formData.proofDocument && (
              <div style={{ marginTop: '10px', color: '#28a745' }}>
                ✓ File selected: {formData.proofDocument.name}
              </div>
            )}
            {preview && (
              <div className="file-preview">
                <img src={preview} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
              </div>
            )}
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Achievement'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitAchievement;