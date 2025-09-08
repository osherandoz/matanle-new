import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          מתנל'ה - המקום שלך לניהול אירועים מושלמים
        </h1>
        <p className="hero-subtitle lead">
          פלטפורמה חדשנית שמאפשרת לך לנהל כל היבט של האירוע שלך בקלות ובמקצועיות. 
          מניהול אורחים ועד מעקב אחר מתנות - הכל במקום אחד.
        </p>
        <div className="hero-actions">
          <a href="/register" className="btn btn-primary btn-lg">
            <i className="fa-solid fa-calendar-plus"></i>
            <span>צור את האירוע שלך עכשיו</span>
          </a>
          <a href="#about-us" className="btn btn-secondary btn-lg">
            <i className="fa-solid fa-users"></i>
            <span>הכר את הצוות</span>
          </a>
        </div>
      </div>

      <div className="hero-image">
        <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=600&fit=crop&crop=center" alt="ניהול אירועים מתקדם עם מתנל'ה" />
      </div>
    </section>
  );
};

export default HeroSection;
