import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          ניהול אירועים חכם, סוף סוף כמו שצריך
        </h1>
        <p className="hero-subtitle lead">
          פלטפורמה מודרנית לניהול RSVP, מתנות לאורחים וארגון אירועים מושלמים. 
          מוכן תוך דקות, אישי ומשתלם.
        </p>
        <div className="hero-actions">
          <a href="/register" className="btn btn-primary btn-lg">
            <i className="fa-solid fa-rocket"></i>
            <span>התחל לנהל את האירוע שלך →</span>
          </a>
          <a href="#overview" className="btn btn-secondary btn-lg">
            <i className="fa-solid fa-circle-info"></i>
            <span>גלה איך זה עובד</span>
          </a>
        </div>
        <div className="hero-proof">
          <div className="proof-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">אירועים מנוהלים</span>
            </div>
            <div className="stat">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">אורחים מרוצים</span>
            </div>
            <div className="stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">שביעות רצון</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-image">
        <img src="https://source.unsplash.com/600x600/?event,celebration" alt="גרפיקה לאירוע" />
      </div>
    </section>
  );
};

export default HeroSection;
