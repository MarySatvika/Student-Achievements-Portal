import React, { useState } from 'react';

const NotificationBell = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="notification-bell" style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        onClick={toggleDropdown}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          padding: '10px'
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      </button>

      {showDropdown && (
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            width: '300px',
            zIndex: 1000,
            maxHeight: '400px',
            overflowY: 'auto'
          }}
        >
          <div 
            style={{
              padding: '10px',
              borderBottom: '1px solid #eee',
              fontWeight: 'bold'
            }}
          >
            Notifications (0)
          </div>
          
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            No new notifications
          </div>
          
          <div 
            style={{
              padding: '10px',
              textAlign: 'center',
              backgroundColor: '#f9f9f9',
              borderTop: '1px solid #eee'
            }}
          >
            <button 
              onClick={() => setShowDropdown(false)}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;