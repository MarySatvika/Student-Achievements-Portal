import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!email || !otp) {
      setError('Please enter both email and OTP');
      setLoading(false);
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      setLoading(false);
      return;
    }

    try {
      const { data } = await authAPI.verifyEmail(email, otp);
      
      setSuccess(data.message);
      
      // Check if user data and token are returned (auto-login)
      if (data.token && data._id) {
        // Store user data and token
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('token', data.token);
        
        // Redirect to dashboard based on role
        setTimeout(() => {
          if (data.role === 'student') {
            navigate('/dashboard');
          } else if (data.role === 'faculty') {
            navigate('/faculty-dashboard');
          } else if (data.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 1000);
      } else {
        // Old flow - redirect to login
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await authAPI.resendVerification(email);
      setSuccess(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="form-container">
        <div className="form-header">
          <h2>Verify Your Email</h2>
          <p>Enter the OTP sent to your email address</p>
        </div>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}
        
        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="otp">Verification OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              style={{ fontSize: '18px', letterSpacing: '3px', textAlign: 'center' }}
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Check your email inbox for the OTP
              {email.endsWith('@vignan.ac.in') && (
                <span style={{ color: '#ff6b00', fontWeight: 'bold' }}> (Check admin email)</span>
              )}
            </small>
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={handleResendOTP}
            disabled={resendLoading}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: 'transparent',
              color: '#007bff',
              border: '1px solid #007bff',
              borderRadius: '5px',
              cursor: resendLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {resendLoading ? 'Sending...' : 'Resend OTP'}
          </button>
        </div>

        <div className="login-footer">
          <p>Already verified? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
