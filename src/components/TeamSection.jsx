import React from 'react';
import './TeamSection.css';

const TeamSection = () => {
  return (
    <section className="team-section" id="about-us">
      <div className="team-header">
        <h2 className="section-title">הצוות שמאחורי מתנל'ה</h2>
      </div>

      <div className="team-grid">
        <div className="team-card">
          <img 
            src="src\assets\osher.png" 
            alt="אושר - מפתח ראשי" 
            className="team-member-img"
          />
          <div className="card-overlay">
            <div className="member-info">
              <h3>אושר</h3>
              <p>מפתח ומייסד שותף</p>
            </div>
            <div className="social-links">
              <a href="#" aria-label="Facebook של אושר">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="#" aria-label="Instagram של אושר">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="team-card">
          <img 
            src="src\assets\barnew.png" 
            alt="בר - מייסדת מתנל'ה"
            className="team-member-img"
          />
          <div className="card-overlay">
            <div className="member-info">
              <h3>בר</h3>
              <p>מייסדת ומנכ"לית</p>
            </div>
            <div className="social-links">
              <a href="#" aria-label="Facebook של בר">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="#" aria-label="Instagram של בר">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="team-description">
        <p className="lead">
          צוות צעיר ומנוסה שמביא חדשנות טכנולוגית לעולם ניהול האירועים. 
          אנחנו מאמינים בפשטות, יעילות ובחוויית משתמש מושלמת.
        </p>
      </div>
    </section>
  );
};

export default TeamSection;