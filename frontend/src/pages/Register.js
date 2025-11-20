import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../redux/actions/authActions';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    photo: null,
    photoPreview: '',
    username: '',
    email: '',
    password: '',
    role: 'student',
    counsellorRole: '', // Counsellor
    phoneNumber: '',
    university: 'VFSTR',
    // Student fields
    department: '',
    branch: '',
    course: '',
    year: '',
    studentSection: '', // Changed from section to studentSection
    studentId: '',
    // Counsellor fields
    assignedSection: '', // New field for counsellor
    counsellorId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Department/Branch options
  const branches = [
    'Computer Science Engineering (CSE)',
    'Information Technology (IT)',
    'Electrical Engineering (EE)',
    'Electronics & Communication Engineering (ECE)',
    'Mechanical Engineering (ME)',
    'Civil Engineering (CE)',
    'Chemical Engineering',
    'Biotechnology',
    'Artificial Intelligence & Machine Learning (AI&ML)',
    'Data Science',
    'Cyber Security'
  ];

  // Course options
  const courses = [
    'B.Tech',
    'M.Tech',
    'B.Sc',
    'M.Sc',
    'MBA',
    'MCA',
    'Ph.D'
  ];

  // Year options
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  // Section options (1-20)
  const sections = Array.from({ length: 20 }, (_, i) => i + 1);

  const { firstName, lastName, username, email, password, role, counsellorRole, phoneNumber, university, branch, course, year, studentSection, assignedSection, studentId, counsellorId, photoPreview } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If role is admin, set fixed admin email
    if (name === 'role' && value === 'admin') {
      setFormData({ 
        ...formData, 
        [name]: value,
        email: 'sap20242027@gmail.com'
      });
    } 
    // If role is counsellor, clear email to allow user to enter counsellor email
    else if (name === 'role' && value === 'counsellor') {
      setFormData({ 
        ...formData, 
        [name]: value,
        email: ''
      });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          photo: file,
          photoPreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const fullName = `${firstName} ${lastName}`.trim();
    console.log('Form submitted with data:', { ...formData, name: fullName });

    // Validate inputs
    if (!firstName || !lastName || !username || !email || !password || !phoneNumber) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Counsellor email validation - must end with @vignan.ac.in
    if (role === 'counsellor' && !email.endsWith('@vignan.ac.in')) {
      setError('Counsellor email must end with @vignan.ac.in');
      setLoading(false);
      return;
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }

    // Role-specific validation
    if (role === 'student') {
      if (!studentId || !branch || !course || !year || !studentSection) {
        setError('Please fill in all student fields');
        setLoading(false);
        return;
      }
    } else if (role === 'counsellor') {
      if (!counsellorId || !branch || !course || !counsellorRole || !assignedSection) {
        setError('Please fill in all counsellor fields including assigned section');
        setLoading(false);
        return;
      }
    }

    try {
      console.log('Sending registration request...');
      const submitData = {
        name: fullName,
        firstName,
        lastName,
        username,
        email,
        password,
        role,
        counsellorRole: role === 'counsellor' ? counsellorRole : undefined,
        phoneNumber,
        university,
        department: branch, // Use branch as department for both students and counsellors
        branch,
        course,
        year: role === 'student' ? year : undefined,
        studentSection: role === 'student' ? studentSection : undefined,
        assignedSection: role === 'counsellor' ? assignedSection : undefined,
        studentId: role === 'student' ? studentId : undefined,
        counsellorId: role === 'counsellor' ? counsellorId : undefined
      };
      
      const response = await dispatch(register(submitData));
      console.log('Registration response:', response);
      
      // Check if registration was successful
      if (response && response.error) {
        setError(response.error.message || 'Registration failed. Please try again.');
      } else {
        setSuccess('Registration successful! You can now login with your credentials.');
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="form-container">
        <div className="form-header">
          <h2>Create Your Account</h2>
          <p>Join our student achievement portal today</p>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Photo Upload */}
          <div className="form-group" style={{ textAlign: 'center', marginBottom: '20px' }}>
            <label htmlFor="photo" style={{ display: 'block', marginBottom: '10px' }}>Profile Photo</label>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '3px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              cursor: 'pointer',
              backgroundColor: '#f9f9f9'
            }}
            onClick={() => document.getElementById('photo').click()}>
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '40px', color: '#999' }}>📷</span>
              )}
            </div>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
            <small style={{ display: 'block', marginTop: '10px', color: '#666', fontSize: '12px' }}>Click to upload photo (Max 5MB)</small>
          </div>

          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={handleChange}
              required
              placeholder="Enter your first name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={handleChange}
              required
              placeholder="Enter your last name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
              required
              placeholder="Choose a unique username"
            />
            <small style={{ color: '#666', fontSize: '12px' }}>You can login with username or email</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Role *</label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="counsellor">Counsellor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
              disabled={role === 'admin'}
              placeholder={
                role === 'admin' 
                  ? 'sap20242027@gmail.com (Auto-filled)' 
                  : role === 'counsellor'
                  ? 'yourname@vignan.ac.in'
                  : 'Enter your email address'
              }
              style={{ backgroundColor: role === 'admin' ? '#f0f0f0' : 'white' }}
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              {role === 'admin' 
                ? 'All admins use the same email' 
                : role === 'counsellor'
                ? 'Must use @vignan.ac.in email'
                : 'You can login with this email after registration'
              }
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Create a strong password (min 6 characters)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              placeholder="Enter 10-digit phone number"
              maxLength="10"
            />
          </div>

          <div className="form-group">
            <label htmlFor="university">University *</label>
            <input
              type="text"
              id="university"
              name="university"
              value={university}
              readOnly
              style={{ backgroundColor: '#f0f0f0' }}
            />
          </div>
          
          {/* Student-specific fields */}
          {role === 'student' && (
            <>
              <div className="form-group">
                <label htmlFor="studentId">Student ID *</label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={studentId}
                  onChange={handleChange}
                  required
                  placeholder="Enter your student ID"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="branch">Branch *</label>
                <select
                  id="branch"
                  name="branch"
                  value={branch}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map((br) => (
                    <option key={br} value={br}>{br}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="course">Course *</label>
                <select
                  id="course"
                  name="course"
                  value={course}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="year">Year *</label>
                <select
                  id="year"
                  name="year"
                  value={year}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Year</option>
                  {years.map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
              
              {/* Student Section Dropdown */}
              <div className="form-group">
                <label htmlFor="studentSection">Select your section number *</label>
                <select
                  id="studentSection"
                  name="studentSection"
                  value={studentSection}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Section</option>
                  {sections.map((sec) => (
                    <option key={sec} value={sec}>Section {sec}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Counsellor-specific fields */}
          {role === 'counsellor' && (
            <>
              <div className="form-group">
                <label htmlFor="counsellorId">Counsellor ID *</label>
                <input
                  type="text"
                  id="counsellorId"
                  name="counsellorId"
                  value={counsellorId}
                  onChange={handleChange}
                  required
                  placeholder="Enter your counsellor ID"
                />
              </div>

              <div className="form-group">
                <label htmlFor="counsellorRole">Counsellor Role *</label>
                <select
                  id="counsellorRole"
                  name="counsellorRole"
                  value={counsellorRole}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Counsellor Role</option>
                  <option value="Counsellor">Counsellor</option>
                </select>
              </div>

              {/* Assigned Section Dropdown for Counsellor */}
              <div className="form-group">
                <label htmlFor="assignedSection">Which section are you counsellor for? *</label>
                <select
                  id="assignedSection"
                  name="assignedSection"
                  value={assignedSection}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Section</option>
                  {sections.map((sec) => (
                    <option key={sec} value={sec}>Section {sec}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="branch">Branch *</label>
                <select
                  id="branch"
                  name="branch"
                  value={branch}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map((br) => (
                    <option key={br} value={br}>{br}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="course">Course *</label>
                <select
                  id="course"
                  name="course"
                  value={course}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="register-footer">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;