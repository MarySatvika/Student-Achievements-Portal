import React from 'react';

const BadgeDisplay = ({ badge, size = 'medium' }) => {
  const badges = {
    participant: '🎖️',
    achiever: '⭐',
    master: '👑',
    legend: '🏆',
  };

  const sizeClass = size === 'large' ? '60px' : '40px';

  return (
    <div style={{
      fontSize: sizeClass,
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px'
    }}>
      <span>{badges[badge] || badges.participant}</span>
      <p style={{ margin: 0, fontSize: '16px', textTransform: 'capitalize' }}>{badge}</p>
    </div>
  );
};

export default BadgeDisplay;
