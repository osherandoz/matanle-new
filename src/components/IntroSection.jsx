import React from 'react';
import './IntroSection.css';

const IntroSection = () => {
  return (
    <section className="intro-section" id="overview">
      <div className="intro-content">
        <div className="intro-header">
          <h2 className="intro-title">
            הדרך החכמה לנהל אירועים
          </h2>
          <p className="intro-tagline lead">
            מתנל'ה מביאה לכם חוויית ניהול אירועים מהפכנית. 
            פשוט, מהיר ויעיל - בדיוק כמו שצריך להיות.
          </p>
        </div>
        
        <div className="intro-steps">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>הקמה מהירה</h3>
              <p>יצירת אירוע חדש תוך דקות ספורות עם כל הפרטים החשובים</p>
            </div>
          </div>
          
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>ניהול חכם</h3>
              <p>מעקב אחר אורחים, מתנות ומשימות במקום אחד ונוח</p>
            </div>
          </div>
          
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>תוצאות מושלמות</h3>
              <p>אירוע מאורגן ומוצלח שישאיר רושם בלתי נשכח</p>
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