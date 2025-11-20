import React from 'react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand-center">
        <h2>SAP</h2>
      </div>
      <div className="navbar-notifications">
        <NotificationBell />
      </div>
    </nav>
  );
};

export default Navbar;