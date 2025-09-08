import React from 'react';
import './FeaturesSection.css';

const FeaturesSection = () => {
  return (
    <section className="features-section" id="why-us">
      <div className="features-header">
        <h2 className="section-title">היתרונות שלנו</h2>
        <p className="section-description">
          חוויית ניהול אירועים מתקדמת שחוסכת לכם זמן ומביאה תוצאות מושלמות. 
          גלו מה הופך את מתנל'ה לבחירה הטובה ביותר.
        </p>
      </div>

      <div className="features-grid">
        <div className="feature-card card">
          <div className="feature-icon">
            <i className="fa-solid fa-users"></i>
          </div>
          <h3 className="card-title">ניהול אורחים מתקדם</h3>
          <p className="card-text">
            מערכת RSVP חכמה עם מעקב בזמן אמת ותזכורות אוטומטיות.
          </p>
        </div>

        <div className="feature-card card">
          <div className="feature-icon">
            <i className="fa-solid fa-gift"></i>
          </div>
          <h3 className="card-title">מתנות ומעקב חכם</h3>
          <p className="card-text">
            ניהול מתנות מתקדם עם מניעת כפילויות ומעקב אוטומטי.
          </p>
        </div>

        <div className="feature-card card">
          <div className="feature-icon">
            <i className="fa-solid fa-calendar-check"></i>
          </div>
          <h3 className="card-title">תכנון ותזמון</h3>
          <p className="card-text">
            לוח זמנים אינטראקטיבי עם תזכורות חכמות ומעקב משימות.
          </p>
        </div>

        <div className="feature-card card">
          <div className="feature-icon">
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <h3 className="card-title">דוחות ותובנות</h3>
          <p className="card-text">
            ניתוחים מתקדמים וסטטיסטיקות בזמן אמת לאירוע מושלם.
          </p>
        </div>

        <div className="feature-card card">
          <div className="feature-icon">
            <i className="fa-solid fa-mobile-screen"></i>
          </div>
          <h3 className="card-title">נגישות מלאה</h3>
          <p className="card-text">
            פלטפורמה רספונסיבית הפועלת מושלם על כל המכשירים.
          </p>
        </div>

        <div className="feature-card card">
          <div className="feature-icon">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h3 className="card-title">אבטחה ופרטיות</h3>
          <p className="card-text">
            הגנה מלאה על הנתונים עם הצפנה מתקדמת ופרטיות מובטחת.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;