import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState({
    photo: '',
    photoPreview: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    university: 'VFSTR',
    course: '',
    year: '',
    section: '',
    branch: '',
    studentId: '',
    role: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [preferences, setPreferences] = useState({
    language: 'English'
  });
  
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  

  
  const languages = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam'];
  
  useEffect(() => {
    const user = getUserFromStorage();
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Auto-populate all fields from user data
    setProfileData({
      photo: user.photo || '',
      photoPreview: user.photo || '',
      firstName: user.firstName || user.name?.split(' ')[0] || '',
      lastName: user.lastName || user.name?.split(' ')[1] || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      university: user.university || 'VFSTR',
      course: user.course || '',
      year: user.year || '',
      section: user.section || user.studentSection || user.assignedSection || '',
      branch: user.branch || user.department || '',
      studentId: user.studentId || user.facultyId || user.counsellorId || '',
      role: user.role || ''
    });
  }, [navigate]);
  
  const getUserFromStorage = () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  };
  
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handlePhotoUpload(e.target.files[0]);
    }
  };
  
  const handlePhotoUpload = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData({
        ...profileData,
        photo: file,
        photoPreview: reader.result
      });
    };
    reader.readAsDataURL(file);
  };
  
  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };
  
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };
  
  const handlePreferencesChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };
  
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    
    setTimeout(() => {
      const user = getUserFromStorage();
      const updatedUser = {
        ...user,
        ...profileData,
        name: `${profileData.firstName} ${profileData.lastName}`
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccess('Profile updated successfully!');
      setLoading(false);
    }, 1000);
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setSuccess('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setLoading(false);
    }, 1000);
  };
  
  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    
    setTimeout(() => {
      setSuccess('Preferences saved successfully!');
      setLoading(false);
    }, 1000);
  };
  
  const handleExportData = (format) => {
    const user = getUserFromStorage();
    
    // For admin, export all student details with their achievements
    const data = {
      profile: user,
      students: [
        // This would come from API in real implementation
        { name: 'John Doe', id: 'CS123456', branch: 'Computer Science', section: 2, year: '3rd Year', achievements: 15 },
        { name: 'Jane Smith', id: 'ME123457', branch: 'Mechanical', section: 1, year: '2nd Year', achievements: 8 },
        { name: 'Robert Johnson', id: 'EE123458', branch: 'Electrical', section: 3, year: '4th Year', achievements: 12 }
      ]
    };
    
    if (format === 'csv') {
      // Create CSV content
      let csvContent = 'Admin Profile Information\n';
      csvContent += `Name,${user.firstName} ${user.lastName}\n`;
      csvContent += `Email,${profileData.email}\n`;
      csvContent += `ID,${user.studentId || user.facultyId}\n\n`;
      
      csvContent += 'All Student Details with Achievements\n';
      csvContent += 'Student Name,Student ID,Branch,Section,Year,Total Achievements\n';
      data.students.forEach(student => {
        csvContent += `${student.name},${student.id},${student.branch},${student.section},${student.year},${student.achievements}\n`;
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admin_data_export_${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // For PDF, we'll create a simple HTML that can be printed as PDF
      const printContent = `
        <html>
        <head>
          <title>Admin Data Export</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #667eea; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #667eea; color: white; }
          </style>
        </head>
        <body>
          <h1>Student Achievement Portal - Admin Data Export</h1>
          <h2>Admin Profile Information</h2>
          <table>
            <tr><th>Field</th><th>Value</th></tr>
            <tr><td>Name</td><td>${user.firstName} ${user.lastName}</td></tr>
            <tr><td>Email</td><td>${profileData.email}</td></tr>
            <tr><td>Admin ID</td><td>${user.studentId || user.facultyId}</td></tr>
          </table>
          
          <h2>All Student Details with Achievements</h2>
          <table>
            <tr><th>Student Name</th><th>Student ID</th><th>Branch</th><th>Section</th><th>Year</th><th>Total Achievements</th></tr>
            ${data.students.map(student => `
              <tr>
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td>${student.branch}</td>
                <td>${student.section}</td>
                <td>${student.year}</td>
                <td>${student.achievements}</td>
              </tr>
            `).join('')}
          </table>
        </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
    
    setSuccess(`Data exported successfully as ${format.toUpperCase()}!`);
  };
  
  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure you want to delete your admin account? This action cannot be undone and all your data will be permanently deleted.')) {
      if (window.confirm('This is your final warning. All admin data and access will be permanently deleted. Do you still want to continue?')) {
        // In real implementation, this would call an API
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Admin account deleted successfully. You will be redirected to the login page.');
        navigate('/login');
      }
    }
  };

  const user = getUserFromStorage();
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  return (
    <div className="profile-page">
      {/* Header with Project Name and Navigation */}
      <header className="dashboard-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px', 
        backgroundColor: '#667eea', 
        color: 'white',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        <div className="project-name" style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
          Student Achievement Portal
        </div>
        <div className="header-nav" style={{ display: 'flex', gap: '20px' }}>
          <button 
            className="nav-btn" 
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '20px', 
              color: 'white', 
              cursor: 'pointer',
              fontWeight: '600'
            }}
            onClick={() => navigate('/admin-dashboard')}
          >
            Dashboard
          </button>
          <button 
            className="nav-btn" 
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '20px', 
              color: 'white', 
              cursor: 'pointer',
              fontWeight: '600'
            }}
            onClick={() => navigate('/profile')}
          >
            Profile
          </button>
          <button 
            className="nav-btn logout-btn" 
            style={{ 
              background: '#e74c3c', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '20px', 
              color: 'white', 
              cursor: 'pointer',
              fontWeight: '600'
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>
      
      <div className="profile-content" style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px' }}>
        {success && <div className="alert alert-success" style={{ padding: '15px', marginBottom: '20px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px' }}>{success}</div>}
        {error && <div className="alert alert-danger" style={{ padding: '15px', marginBottom: '20px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px' }}>{error}</div>}
        
        {/* Profile Settings Form */}
        <section className="settings-section" style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '10px', 
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px', borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>Profile Settings</h2>
          <form onSubmit={handleProfileSubmit} className="settings-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Photo Upload */}
            <div className="form-group photo-upload-group">
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#34495e' }}>Profile Photo</label>
              <div 
                className={`photo-upload-area ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                style={{ 
                  border: '3px dashed #cbd5e0', 
                  borderRadius: '15px', 
                  padding: '40px', 
                  textAlign: 'center', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s ease', 
                  background: '#f8f9fa', 
                  minHeight: '250px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                {profileData.photoPreview ? (
                  <img src={profileData.photoPreview} alt="Profile" className="photo-preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #667eea' }} />
                ) : (
                  <div className="photo-placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                    <span className="upload-icon" style={{ fontSize: '4rem' }}>📷</span>
                    <p style={{ color: '#7f8c8d', fontSize: '1.1rem', margin: '0' }}>Drag & drop your photo here or click to browse</p>
                  </div>
                )}
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div className="form-group">
                <label htmlFor="firstName" style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#34495e' }}>First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  required
                  style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName" style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#34495e' }}>Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  required
                  style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email" style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#34495e' }}>Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                required
                disabled
                style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem', background: '#f0f0f0', cursor: 'not-allowed' }}
              />
              <small style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>This email is fixed for admin accounts</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNumber" style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#34495e' }}>Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleProfileChange}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="studentId" style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#34495e' }}>Admin ID *</label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={profileData.studentId}
                onChange={handleProfileChange}
                required
                disabled
                style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem', background: '#f0f0f0', cursor: 'not-allowed' }}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="role" style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#34495e' }}>Role</label>
              <input
                type="text"
                id="role"
                name="role"
                value="Admin"
                disabled
                style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem', background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', color: 'white', fontWeight: '600', textTransform: 'capitalize' }}
              />
              <small style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>This role is fixed for admin accounts</small>
            </div>
            
            <button type="submit" className="save-btn" disabled={loading} style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              border: 'none', 
              padding: '14px 30px', 
              borderRadius: '8px', 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              alignSelf: 'flex-start',
              opacity: loading ? 0.6 : 1
            }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </section>
        
        {/* Account Settings Form */}
        <section className="settings-section" style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '10px', 
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px', borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>Account Settings</h2>
          <form onSubmit={handlePasswordSubmit} className="settings-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label htmlFor="currentPassword" style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#34495e' }}>Current Password *</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword" style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#34495e' }}>New Password *</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#34495e' }}>Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }}
              />
            </div>
            
            <button type="submit" className="update-btn" disabled={loading} style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              border: 'none', 
              padding: '14px 30px', 
              borderRadius: '8px', 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              alignSelf: 'flex-start',
              opacity: loading ? 0.6 : 1
            }}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </section>
        
        {/* Preferences Form */}
        <section className="settings-section" style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '10px', 
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px', borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>Preferences</h2>
          <form onSubmit={handlePreferencesSubmit} className="settings-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label htmlFor="language" style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#34495e' }}>Language *</label>
              <select
                id="language"
                name="language"
                value={preferences.language}
                onChange={handlePreferencesChange}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="save-btn" disabled={loading} style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              border: 'none', 
              padding: '14px 30px', 
              borderRadius: '8px', 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              alignSelf: 'flex-start',
              opacity: loading ? 0.6 : 1
            }}>
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </form>
        </section>
        
        {/* Danger Zone */}
        <section className="settings-section danger-zone" style={{ 
          background: '#fff5f5', 
          padding: '30px', 
          borderRadius: '10px', 
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          border: '2px solid #e74c3c',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#e74c3c', marginBottom: '20px', borderBottom: '2px solid #e74c3c', paddingBottom: '10px' }}>Danger Zone</h2>
          
          <div className="danger-item" style={{ padding: '20px', background: 'white', borderRadius: '10px', marginBottom: '20px', border: '2px solid #fee' }}>
            <div className="danger-info" style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#2c3e50' }}>Export All Student Data</h3>
              <p style={{ margin: '0 0 15px 0', color: '#7f8c8d', fontSize: '0.95rem' }}>
                Download all student details with their achievements in CSV or PDF format for backup and reporting purposes.
              </p>
              <p style={{ margin: 0, color: '#e74c3c', fontSize: '0.9rem', fontStyle: 'italic' }}>
                This export contains sensitive information about all students in the system. Handle with care.
              </p>
            </div>
            <div className="export-buttons" style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => handleExportData('csv')}
                className="export-btn-small"
                style={{ 
                  background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '6px', 
                  fontSize: '0.95rem', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Export CSV
              </button>
              <button 
                onClick={() => handleExportData('pdf')}
                className="export-btn-small pdf-btn"
                style={{ 
                  background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '6px', 
                  fontSize: '0.95rem', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Export PDF
              </button>
            </div>
          </div>
          
          <div className="danger-item" style={{ padding: '20px', background: 'white', borderRadius: '10px', border: '2px solid #fee' }}>
            <div className="danger-info" style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#2c3e50' }}>Delete Admin Account</h3>
              <p style={{ margin: '0 0 15px 0', color: '#7f8c8d', fontSize: '0.95rem' }}>
                Permanently delete your admin account and all associated data. This action cannot be undone.
              </p>
              <p style={{ margin: 0, color: '#e74c3c', fontSize: '0.9rem', fontStyle: 'italic' }}>
                Warning: This will remove your access to the admin panel. Student data will remain in the system.
              </p>
            </div>
            <div className="delete-buttons">
              <button 
                onClick={handleDeleteAccount}
                className="delete-btn-small"
                style={{ 
                  background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '6px', 
                  fontSize: '0.95rem', 
                  fontWeight: '600', 
                  cursor: 'pointer'
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </section>
      </div>
      
      {/* Footer */}
      <footer className="page-footer" style={{ 
        textAlign: 'center', 
        padding: '20px', 
        background: '#f8f9fa', 
        borderTop: '1px solid #eee', 
        marginTop: 'auto' 
      }}>
        <p style={{ margin: '0', color: '#7f8c8d', fontSize: '0.9rem' }}>
          © 2024 Student Achievement Portal. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Profile;