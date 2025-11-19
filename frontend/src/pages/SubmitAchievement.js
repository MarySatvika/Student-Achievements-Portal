import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { achievementAPI } from '../services/api';
import '../styles/SubmitAchievement.css';

const SubmitAchievement = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    date: '',
    certificate: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      await achievementAPI.createAchievement(formDataToSend);
      localStorage.setItem('achievementSubmitted', 'true');
      navigate('/my-achievements');
    } catch (error) {
      alert('Error submitting achievement');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-container">
      <header className="dashboard-header">
        <div className="header-left"><h2>SAP</h2></div>
        <nav className="header-nav">
          <button onClick={() => navigate('/dashboard')} className="nav-btn">Dashboard</button>
          <button onClick={() => navigate('/my-achievements')} className="nav-btn">Achievements</button>
          <button onClick={() => navigate('/profile')} className="nav-btn">Profile</button>
        </nav>
      </header>
      
      <main className="submit-main">
        <h1>Submit Achievement</h1>
        <form onSubmit={handleSubmit} className="submit-form">
          <input
            type="text"
            name="title"
            placeholder="Achievement Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="Academic">Academic</option>
            <option value="Technical">Technical</option>
            <option value="Sports">Sports</option>
            <option value="Cultural">Cultural</option>
          </select>
          <select name="level" value={formData.level} onChange={handleChange} required>
            <option value="">Select Level</option>
            <option value="College">College</option>
            <option value="State">State</option>
            <option value="National">National</option>
            <option value="International">International</option>
          </select>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="certificate"
            onChange={handleChange}
            accept="image/*,application/pdf"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Achievement'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default SubmitAchievement;
