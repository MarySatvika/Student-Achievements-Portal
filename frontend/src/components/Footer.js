import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section footer-full-width">
          <h3>Contact Admins</h3>
          <p className="contact-intro">For any queries, please contact:</p>
          
          <div className="admin-contacts">
            <div className="admin-contact-group">
              <div className="admin-card">
                <span className="admin-name">Vasantha</span>
                <a href="tel:9398658772" className="admin-phone">9398658772</a>
              </div>
              <div className="admin-card">
                <span className="admin-name">Satvika</span>
                <a href="tel:8885349293" className="admin-phone">8885349293</a>
              </div>
            </div>
            
            <div className="admin-contact-group">
              <div className="admin-card">
                <span className="admin-name">Srujana</span>
                <a href="tel:8550789703" className="admin-phone">8550789703</a>
              </div>
              <div className="admin-card">
                <span className="admin-name">Poojitha</span>
                <a href="tel:9346185839" className="admin-phone">9346185839</a>
              </div>
            </div>
          </div>
          
          <div className="admin-email">
            <p>Email: <a href="mailto:sap20242027@gmail.com">sap20242027@gmail.com</a></p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Student Achievement Portal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;