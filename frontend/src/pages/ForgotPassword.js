import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      const { data } = await authAPI.forgotPassword(email);
      setSuccess(data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!otp || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { data } = await authAPI.resetPassword(email, otp, newPassword);
      setSuccess(data.message);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await authAPI.forgotPassword(email);
      setSuccess(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // Check if this is a faculty email
  const isFacultyEmail = email.endsWith('@vignan.ac.in');

  return (
    <div className="login">
      <div className="form-container">
        <div className="form-header">
          <h2>{step === 1 ? 'Forgot Password' : 'Reset Password'}</h2>
          <p>{step === 1 ? 'Enter your email to receive password reset OTP' : 'Enter OTP and new password'}</p>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
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
              {isFacultyEmail && (
                <small style={{ color: '#ff6b00', fontSize: '12px', fontWeight: 'bold' }}>
                  Note: OTP for faculty emails will be sent to the admin email account.
                </small>
              )}
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
            
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
                Back to Login
              </a>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
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
                OTP sent to {email}
                {isFacultyEmail && (
                  <span style={{ color: '#ff6b00', fontWeight: 'bold' }}> (Check admin email)</span>
                )}
              </small>
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password (min 6 characters)"
                minLength="6"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter new password"
                minLength="6"
              />
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
            
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  textDecoration: 'underline',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                Resend OTP
              </button>
              {' | '}
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Change Email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;