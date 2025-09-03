import React from 'react';
import './FeaturesSection.css';

const FeaturesSection = () => {
  return (
    <section className="features-section" id="why-us">
      <div className="features-header">
        <h2 className="section-title">למה מתנל'ה?</h2>
        <p className="section-description">
          פלטפורמה חכמה שמשנה את הדרך שבה מנהלים אירועים. 
          פשוט, מהיר ומקצועי - בדיוק כמו שצריך.
        </p>
      </div>

      <div className="features-grid">
        <div className="feature-card card">
          <div className="feature-icon">
            <i className="fa-solid fa-users"></i>
          </div>
          <h3 className="card-title">ניהול RSVP חכם</h3>
          <p className="card-text">
            ארגן את רשימת האורחים בקלות. קבל אישורי השתתפות, 
            עקוב אחר תשובות ומנע בלבול. הכל במקום אחד.
          </p>
        </div>

        <div className="feature-card card">
          <div className="feature-icon">
            <i className="fa-solid fa-gift"></i>
          </div>
          <h3 className="card-title">מתנות לאורחים</h3>
          <p className="card-text">
            ארגן מתנות בצורה חכמה. תן לאורחים לבחור מתנות, 
            עקוב אחר בחירות ומנע כפילויות בקלות.
          </p>
        </div>

        <div className="feature-card card">
          <div className="feature-icon">
            <i className="fa-solid fa-calendar-check"></i>
          </div>
          <h3 className="card-title">תזמון מושלם</h3>
          <p className="card-text">
            תכנן את לוח הזמנים של האירוע. קבל תזכורות אוטומטיות 
            ועקוב אחר כל המשימות בקלות.
          </p>
        </div>

        <div className="feature-card card">
          <div className="feature-icon">
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <h3 className="card-title">ניתוח וסטטיסטיקות</h3>
          <p className="card-text">
            קבל תובנות על האירוע שלך. עקוב אחר השתתפות, 
            תגובות ומשוב מהאורחים בזמן אמת.
          </p>
        </div>

        <div className="feature-card card">
          <div className="feature-icon">
            <i className="fa-solid fa-mobile-screen"></i>
          </div>
          <h3 className="card-title">גישה מכל מקום</h3>
          <p className="card-text">
            נהל את האירוע מכל מכשיר. אפליקציה מותאמת לנייד 
            עם ממשק פשוט ואינטואיטיבי.
          </p>
        </div>

        <div className="feature-card card">
          <div className="feature-icon">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h3 className="card-title">אבטחה מתקדמת</h3>
          <p className="card-text">
            הנתונים שלך מוגנים. אבטחה מתקדמת עם הצפנה 
            מלאה ושמירה על פרטיות האורחים.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;