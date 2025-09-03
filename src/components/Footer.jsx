import React, { useState } from "react";
import "./Footer.css";
import { AccessibilityModal, PrivacyModal } from './AccessibilityPrivacyModals';

const Footer = () => {

  const [accessibilityModalOpen, setAccessibilityModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const handleAccessibilityClick = (e) => {
    e.preventDefault();
    setAccessibilityModalOpen(true);
  };

  const handlePrivacyClick = (e) => {
    e.preventDefault();
    setPrivacyModalOpen(true);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">

          {/* Social Links */}
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
          </div>

          {/* Contact Info */}
          <div className="contact-info">
            <p>
              <i className="fas fa-envelope"></i>
              <a href="mailto:info@matanle.co.il"> info@matanle.co.il</a>
            </p>
            <p>
              <i className="fas fa-phone"></i>
              <a href="tel:+972501234567"> 050-1234567</a>
            </p>
          </div>

          {/* Footer Links */}
          <div className="footer-links">
            <a href="/privacy-policy" onClick={handlePrivacyClick}>
              מדיניות פרטיות
            </a>
            <a href="/accessibility" onClick={handleAccessibilityClick}>
              הצהרת נגישות
            </a>
          </div>

          {/* Copyright */}
          <div className="copyright">
            <p>© 2024 בר שלג ואושר רווח. כל הזכויות שמורות.</p>
          </div>

        </div>
      </div>

      {/* המודלים */}
      <AccessibilityModal 
        isOpen={accessibilityModalOpen} 
        onClose={() => setAccessibilityModalOpen(false)} 
      />
      <PrivacyModal 
        isOpen={privacyModalOpen} 
        onClose={() => setPrivacyModalOpen(false)} 
      />
    </footer>
  );
};

export default Footer;