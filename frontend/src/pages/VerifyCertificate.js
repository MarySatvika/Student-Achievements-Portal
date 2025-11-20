import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const VerifyCertificate = () => {
  const { qrCode } = useParams();
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`http://localhost:5000/api/verify/${qrCode}`);
        const data = await response.json();
        
        if (response.ok) {
          setVerificationData(data);
        } else {
          setError(data.message || 'Failed to verify certificate');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Verification error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (qrCode) {
      verifyCertificate();
    }
  }, [qrCode]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ 
          textAlign: 'center', 
          padding: '30px', 
          backgroundColor: 'white', 
          borderRadius: '10px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <h2 style={{ color: '#e74c3c', marginBottom: '15px' }}>Verification Failed</h2>
          <p style={{ color: '#7f8c8d', fontSize: '18px' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (verificationData && verificationData.verified) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '600px', 
          backgroundColor: 'white', 
          borderRadius: '15px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ 
            backgroundColor: '#27ae60', 
            padding: '30px', 
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '15px' }}>✅</div>
            <h1 style={{ 
              color: 'white', 
              margin: 0, 
              fontSize: '28px',
              fontWeight: 'bold'
            }}>
              Certificate Verified
            </h1>
            <p style={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '18px', 
              marginTop: '10px'
            }}>
              This certificate is verified by Vignan University
            </p>
          </div>

          {/* Certificate Details */}
          <div style={{ padding: '30px' }}>
            <div style={{ 
              border: '2px dashed #27ae60', 
              borderRadius: '10px', 
              padding: '25px', 
              marginBottom: '25px',
              backgroundColor: 'rgba(39, 174, 96, 0.05)'
            }}>
              <h2 style={{ 
                color: '#2c3e50', 
                textAlign: 'center', 
                marginBottom: '20px',
                fontSize: '24px'
              }}>
                {verificationData.achievement.title}
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div>
                  <p style={{ 
                    fontWeight: '600', 
                    color: '#7f8c8d', 
                    marginBottom: '5px' 
                  }}>Student Name</p>
                  <p style={{ 
                    fontSize: '18px', 
                    color: '#2c3e50',
                    margin: 0
                  }}>
                    {verificationData.achievement.student.name}
                  </p>
                </div>
                
                <div>
                  <p style={{ 
                    fontWeight: '600', 
                    color: '#7f8c8d', 
                    marginBottom: '5px' 
                  }}>Student ID</p>
                  <p style={{ 
                    fontSize: '18px', 
                    color: '#2c3e50',
                    margin: 0
                  }}>
                    {verificationData.achievement.student.studentId}
                  </p>
                </div>
                
                <div>
                  <p style={{ 
                    fontWeight: '600', 
                    color: '#7f8c8d', 
                    marginBottom: '5px' 
                  }}>Department</p>
                  <p style={{ 
                    fontSize: '18px', 
                    color: '#2c3e50',
                    margin: 0
                  }}>
                    {verificationData.achievement.student.department}
                  </p>
                </div>
                
                <div>
                  <p style={{ 
                    fontWeight: '600', 
                    color: '#7f8c8d', 
                    marginBottom: '5px' 
                  }}>Section</p>
                  <p style={{ 
                    fontSize: '18px', 
                    color: '#2c3e50',
                    margin: 0
                  }}>
                    {verificationData.achievement.student.section}
                  </p>
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <p style={{ 
                  fontWeight: '600', 
                  color: '#7f8c8d', 
                  marginBottom: '5px' 
                }}>Description</p>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#2c3e50',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  {verificationData.achievement.description}
                </p>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr 1fr', 
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div>
                  <p style={{ 
                    fontWeight: '600', 
                    color: '#7f8c8d', 
                    marginBottom: '5px' 
                  }}>Category</p>
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#2c3e50',
                    margin: 0,
                    textTransform: 'capitalize'
                  }}>
                    {verificationData.achievement.category}
                  </p>
                </div>
                
                <div>
                  <p style={{ 
                    fontWeight: '600', 
                    color: '#7f8c8d', 
                    marginBottom: '5px' 
                  }}>Level</p>
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#2c3e50',
                    margin: 0,
                    textTransform: 'capitalize'
                  }}>
                    {verificationData.achievement.level}
                  </p>
                </div>
                
                <div>
                  <p style={{ 
                    fontWeight: '600', 
                    color: '#7f8c8d', 
                    marginBottom: '5px' 
                  }}>Date</p>
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#2c3e50',
                    margin: 0
                  }}>
                    {new Date(verificationData.achievement.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '15px'
              }}>
                <div>
                  <p style={{ 
                    fontWeight: '600', 
                    color: '#7f8c8d', 
                    marginBottom: '5px' 
                  }}>Verified By</p>
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#2c3e50',
                    margin: 0
                  }}>
                    {verificationData.achievement.verifiedBy}
                  </p>
                </div>
                
                <div>
                  <p style={{ 
                    fontWeight: '600', 
                    color: '#7f8c8d', 
                    marginBottom: '5px' 
                  }}>Verified On</p>
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#2c3e50',
                    margin: 0
                  }}>
                    {new Date(verificationData.achievement.verifiedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <p style={{ 
                color: '#7f8c8d', 
                fontSize: '14px',
                marginBottom: '20px'
              }}>
                Certificate ID: {verificationData.achievement.qrCode}
              </p>
              <div style={{ 
                fontSize: '14px', 
                color: '#95a5a6',
                borderTop: '1px solid #ecf0f1',
                paddingTop: '20px'
              }}>
                <p>Verified by Vignan University • Certificate Management System</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ 
        textAlign: 'center', 
        padding: '30px', 
        backgroundColor: 'white', 
        borderRadius: '10px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        maxWidth: '500px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>❓</div>
        <h2 style={{ color: '#f39c12', marginBottom: '15px' }}>Certificate Not Found</h2>
        <p style={{ color: '#7f8c8d', fontSize: '18px' }}>
          The certificate you're trying to verify could not be found.
        </p>
      </div>
    </div>
  );
};

export default VerifyCertificate;