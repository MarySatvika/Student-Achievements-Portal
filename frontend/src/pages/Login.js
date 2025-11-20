import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    console.log('Login attempt with:', emailOrUsername);

    // Validate inputs
    if (!emailOrUsername || !password) {
      setError('Please enter email/username and password');
      setLoading(false);
      return;
    }

    try {
      console.log('Sending login request...');
      const { data } = await authAPI.login(emailOrUsername, password);
      console.log('Login response:', data);
      
      // Direct login (bypassing OTP for development)
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      
      setSuccess('Login successful!');
      
      // Use a slightly longer delay to ensure token is properly set
      setTimeout(() => {
        if (data.role === 'student') {
          navigate('/dashboard');
        } else if (data.role === 'faculty') {
          navigate('/faculty-dashboard');
        } else if (data.role === 'admin') {
          navigate('/admin-dashboard');
        }
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login">
      <div className="form-container">
        <div className="form-header">
          <h2>Login</h2>
          <p>Enter your credentials to access your account</p>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="emailOrUsername">Email or Username</label>
              <input
                type="text"
                id="emailOrUsername"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
                placeholder="Enter your email or username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <a href="/forgot-password" style={{ color: '#007bff', textDecoration: 'none' }}>
                Forgot Password?
              </a>
            </div>
          </form>
        

        
        <div className="login-footer">
          <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;