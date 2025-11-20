import React from 'react';
import './BadgeDisplay.css';

const BadgeDisplay = ({ badge, size = 'medium' }) => {
  const getBadgeStyle = () => {
    const baseStyle = {
      display: 'inline-block',
      padding: '5px 10px',
      borderRadius: '15px',
      fontWeight: 'bold',
      textTransform: 'capitalize',
      fontSize: size === 'large' ? '1.2rem' : size === 'small' ? '0.8rem' : '1rem',
    };

    switch (badge.toLowerCase()) {
      case 'gold':
        return {
          ...baseStyle,
          backgroundColor: '#FFD700',
          color: '#000',
          border: '1px solid #D4AF37',
        };
      case 'silver':
        return {
          ...baseStyle,
          backgroundColor: '#C0C0C0',
          color: '#000',
          border: '1px solid #A0A0A0',
        };
      case 'bronze':
        return {
          ...baseStyle,
          backgroundColor: '#CD7F32',
          color: '#fff',
          border: '1px solid #A65A26',
        };
      case 'participant':
      default:
        return {
          ...baseStyle,
          backgroundColor: '#4169E1',
          color: '#fff',
          border: '1px solid #3254C8',
        };
    }
  };

  return (
    <span style={getBadgeStyle()}>
      {badge}
    </span>
  );
};

export default BadgeDisplay;