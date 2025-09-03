import React from 'react';
import './IntroSection.css';

const IntroSection = () => {
  return (
    <section className="intro-section" id="overview">
      <div className="intro-content">
        <div className="intro-header">
          <h2 className="intro-title">
            איך זה עובד?
          </h2>
          <p className="intro-tagline lead">
            מתנל'ה היא הפלטפורמה הראשונה בישראל שמאחדת את כל הצרכים 
            של ניהול אירועים במקום אחד - RSVP, מתנות, תזמון וארגון.
          </p>
        </div>
        
        <div className="intro-steps">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>יוצרים אירוע</h3>
              <p>הזן פרטים בסיסיים וקבל קישור ייחודי לאירוע</p>
            </div>
          </div>
          
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>שתף עם האורחים</h3>
              <p>שתף את האירוע עם האורחים, עקוב אחרי אישורי ההגעה שלהם</p>
            </div>
          </div>
          
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>נהל מתנות ופרטים</h3>
              <p>ארגן מתנות, עקוב אחר פרטים וקבל עדכונים בזמן אמת</p>
            </div>
          </div>
        </div>

        {/* <div className="intro-image-container">
          <img 
            src="/src/assets/matanledashboard.png" 
            alt="מסך דשבורד מתנל'ה - ניהול אירועים חכם" 
            className="intro-image"
          />
        </div> */}
      </div>
    </section>
  );
};

export default IntroSection;