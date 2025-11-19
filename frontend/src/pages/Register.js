import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/authSlice';
import '../styles/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    studentId: '',
    branch: '',
    course: '',
    year: '',
    studentSection: '',
    counsellorId: '',
    assignedSection: '',
    counsellorRole: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setFormData({
      ...formData,
      role: selectedRole,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const { confirmPassword, ...submitData } = formData;
    const result = await dispatch(registerUser(submitData));
    if (result.type === 'auth/registerUser/fulfilled') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Student Achievement Portal</h1>
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="role-selection">
            <label>
              <input
                type="radio"
                value="student"
                checked={role === 'student'}
                onChange={handleRoleChange}
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                value="counsellor"
                checked={role === 'counsellor'}
                onChange={handleRoleChange}
              />
              Counsellor
            </label>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {role === 'student' && (
            <>
              <input
                type="text"
                name="studentId"
                placeholder="Student ID"
                value={formData.studentId}
                onChange={handleChange}
              />
              <input
                type="text"
                name="branch"
                placeholder="Branch"
                value={formData.branch}
                onChange={handleChange}
              />
              <input
                type="text"
                name="course"
                placeholder="Course"
                value={formData.course}
                onChange={handleChange}
              />
              <input
                type="text"
                name="year"
                placeholder="Year"
                value={formData.year}
                onChange={handleChange}
              />
              <input
                type="text"
                name="studentSection"
                placeholder="Section"
                value={formData.studentSection}
                onChange={handleChange}
              />
            </>
          )}

          {role === 'counsellor' && (
            <>
              <input
                type="text"
                name="counsellorId"
                placeholder="Counsellor ID"
                value={formData.counsellorId}
                onChange={handleChange}
              />
              <input
                type="text"
                name="assignedSection"
                placeholder="Assigned Section"
                value={formData.assignedSection}
                onChange={handleChange}
              />
              <input
                type="text"
                name="counsellorRole"
                placeholder="Role"
                value={formData.counsellorRole}
                onChange={handleChange}
              />
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p>Already have an account? <a onClick={() => navigate('/login')}>Login here</a></p>
      </div>
    </div>
  );
};

export default Register;
