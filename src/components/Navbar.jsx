import React, { useEffect, useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar-container ${scrolled ? 'scrolled' : ''}`}>
      <nav className="navbar">
        {/* Right – Logo */}
        <div className="navbar-logo">
          <a href="/">
            <img 
              src="src/assets/logo.png" 
              alt="מתנל'ה לוגו" 
              className="navbar-logo-img"
            />
            <h1>מתנל'ה</h1>
          </a>
        </div>

        {/* Center – Nav Links */}
        <div className="navbar-links desktop-nav">
          <ul>
            <li><a href="#overview">איך זה עובד?</a></li>
            <li><a href="#why-us">למה מתנל'ה?</a></li>
            <li><a href="#about-us">מי אנחנו?</a></li>
          </ul>
        </div>

        {/* Left – Action Buttons */}
        <div className="navbar-actions desktop-actions">
          <a href="/dashboard" className="btn btn-outline">
            <span>דשבורד</span>
          </a>
          <a href="/register" className="btn btn-primary">
            <span>הרשמה</span>
          </a>
          <a href="/login" className="btn btn-secondary">
            <span>התחברות</span>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
