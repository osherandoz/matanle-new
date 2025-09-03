import React from 'react';
import { X } from 'lucide-react';

// מודאל נגישות
export const AccessibilityModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* כותרת המודאל */}
        <div className="modal-header">
          <div className="logo-container">
            <div className="logo-placeholder">
              <span>LOGO</span>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* תוכן המודאל */}
        <div className="modal-content">
          <div className="content-section">
            <h3 className="section-title">הצהרת נגישות</h3>
            
            <p className="content-paragraph">
              אתר "בר שלג ואושר רווח" מחויב לספק שירותי אינטרנט נגישים לכלל הציבור, לרבות 
              אנשים עם מוגבלויות. אנו עובדים ללא הרף כדי לשפר את הנגישות של האתר ולהפוך אותו 
              לידידותי וזמין לכל המבקרים.
            </p>

            <h4 className="subsection-title">תקני נגישות</h4>
            <p className="content-paragraph">
              האתר נבנה בהתאם להנחיות הנגישות WCAG 2.1 ברמת AA וחוק שוויון זכויות 
              לאנשים עם מוגבלות (התאמות נגישות לשירותי אינטרנט), התשע"ט-2019.
            </p>

            <h4 className="subsection-title">תכונות נגישות באתר</h4>
            <ul className="content-list">
              <li>ניווט באמצעות מקלדת</li>
              <li>תמיכה בקוראי מסך</li>
              <li>ניגודיות צבעים מותאמת</li>
              <li>טקסט ברור וקריא</li>
              <li>מבנה עמוד לוגי ועקבי</li>
              <li>תמיכה בהגדלת גופנים</li>
            </ul>

            <h4 className="subsection-title">פניות ובקשות</h4>
            <p className="content-paragraph">
              אם נתקלתם בבעיית נגישות או שיש לכם הצעות לשיפור, אנא צרו קשר:
            </p>
            <p className="contact-info">
              אימייל: info@matanle.co.il<br/>
              טלפון: 050-1234567
            </p>

            <p className="content-paragraph">
              אנו מתחייבים לטפל בפניותיכם במהירות ובמקצועיות ולפעול לשיפור רציף של 
              נגישות האתר.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* מודאל */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-container {
          background: #ede0d4;
          border-radius: 1rem;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        /* כותרת */
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem 1rem;
          border-bottom: 2px solid #ddb892;
        }

        .logo-container {
          flex: 1;
        }

        .logo-placeholder {
          background: #9c6644;
          color: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: bold;
          display: inline-block;
          font-size: 1.1rem;
        }

        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #9c6644;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: background-color 0.3s ease;
        }

        .close-button:hover {
          background: #ddb892;
        }

        /* תוכן */
        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          direction: rtl;
          text-align: right;
        }

        .content-section {
          color: #333333;
          line-height: 1.7;
        }

        .section-title {
          color: #7f5539;
          font-size: 1.8rem;
          font-weight: bold;
          margin: 0 0 1.5rem 0;
          text-align: center;
        }

        .subsection-title {
          color: #9c6644;
          font-size: 1.3rem;
          font-weight: bold;
          margin: 2rem 0 1rem 0;
        }

        .content-paragraph {
          margin: 1rem 0;
          font-size: 1rem;
          line-height: 1.8;
        }

        .content-list {
          margin: 1rem 0;
          padding-right: 1.5rem;
        }

        .content-list li {
          margin: 0.5rem 0;
          line-height: 1.7;
        }

        .contact-info {
          background: #e6ccb2;
          padding: 1rem;
          border-radius: 0.5rem;
          border-right: 4px solid #9c6644;
          margin: 1rem 0;
          font-weight: 500;
        }

        /* רספונסיביות */
        @media (max-width: 768px) {
          .modal-container {
            margin: 0.5rem;
            max-height: 95vh;
          }

          .modal-header {
            padding: 1rem 1.5rem 0.75rem;
          }

          .modal-content {
            padding: 1.5rem;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .subsection-title {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .modal-overlay {
            padding: 0.5rem;
          }

          .modal-header {
            padding: 0.75rem 1rem 0.5rem;
          }

          .modal-content {
            padding: 1rem;
          }

          .section-title {
            font-size: 1.3rem;
          }

          .content-paragraph, .content-list li {
            font-size: 0.95rem;
          }
        }

        /* גלילה חלקה */
        .modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: #e6ccb2;
          border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: #9c6644;
          border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: #7f5539;
        }
      `}</style>
    </div>
  );
};

// מודאל פרטיות
export const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* כותרת המודאל */}
        <div className="modal-header">
          <div className="logo-container">
            <div className="logo-placeholder">
              <span>LOGO</span>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* תוכן המודאל */}
        <div className="modal-content">
          <div className="content-section">
            <h3 className="section-title">מדיניות פרטיות</h3>
            
            <p className="content-paragraph">
              מדיניות הפרטיות הזאת מסבירה איך אנו אוספים, משתמשים ומגנים על המידע האישי 
              שלכם באתר "בר שלג ואושר רווח".
            </p>

            <h4 className="subsection-title">איסוף מידע</h4>
            <p className="content-paragraph">
              אנו עשויים לאסוף את סוגי המידע הבאים:
            </p>
            <ul className="content-list">
              <li>מידע אישי שאתם מספקים (שם, אימייל, טלפון)</li>
              <li>מידע טכני (כתובת IP, סוג דפדפן, זמן ביקור)</li>
              <li>העדפות ופעילות באתר</li>
            </ul>

            <h4 className="subsection-title">שימוש במידע</h4>
            <p className="content-paragraph">
              אנו משתמשים במידע שנאסף למטרות הבאות:
            </p>
            <ul className="content-list">
              <li>מתן השירותים המבוקשים</li>
              <li>שיפור חוויית המשתמש באתר</li>
              <li>יצירת קשר ומתן מידע רלוונטי</li>
              <li>הגנה על האתר והמשתמשים</li>
            </ul>

            <h4 className="subsection-title">הגנה על המידע</h4>
            <p className="content-paragraph">
              אנו מיישמים אמצעי אבטחה מתקדמים להגנה על המידע האישי שלכם, כולל 
              הצפנה, אבטחת שרתים וגישה מוגבלת למידע.
            </p>

            <h4 className="subsection-title">זכויותיכם</h4>
            <p className="content-paragraph">
              לכם הזכות לדעת איזה מידע אישי שלכם נמצא ברשותנו, לבקש תיקון או מחיקה של 
              המידע, ולהתנגד לעיבוד מידע מסוים.
            </p>

            <h4 className="subsection-title">יצירת קשר</h4>
            <p className="content-paragraph">
              לשאלות או בקשות הקשורות לפרטיות:
            </p>
            <p className="contact-info">
              אימייל: info@matanle.co.il<br/>
              טלפון: 050-1234567
            </p>

            <p className="content-paragraph">
              מדיניות זו עודכנה לאחרונה: דצמבר 2024
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* מודאל */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-container {
          background: #ede0d4;
          border-radius: 1rem;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        /* כותרת */
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem 1rem;
          border-bottom: 2px solid #ddb892;
        }

        .logo-container {
          flex: 1;
        }

        .logo-placeholder {
          background: #9c6644;
          color: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: bold;
          display: inline-block;
          font-size: 1.1rem;
        }

        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #9c6644;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: background-color 0.3s ease;
        }

        .close-button:hover {
          background: #ddb892;
        }

        /* תוכן */
        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          direction: rtl;
          text-align: right;
        }

        .content-section {
          color: #333333;
          line-height: 1.7;
        }

        .section-title {
          color: #7f5539;
          font-size: 1.8rem;
          font-weight: bold;
          margin: 0 0 1.5rem 0;
          text-align: center;
        }

        .subsection-title {
          color: #9c6644;
          font-size: 1.3rem;
          font-weight: bold;
          margin: 2rem 0 1rem 0;
        }

        .content-paragraph {
          margin: 1rem 0;
          font-size: 1rem;
          line-height: 1.8;
        }

        .content-list {
          margin: 1rem 0;
          padding-right: 1.5rem;
        }

        .content-list li {
          margin: 0.5rem 0;
          line-height: 1.7;
        }

        .contact-info {
          background: #e6ccb2;
          padding: 1rem;
          border-radius: 0.5rem;
          border-right: 4px solid #9c6644;
          margin: 1rem 0;
          font-weight: 500;
        }

        /* רספונסיביות */
        @media (max-width: 768px) {
          .modal-container {
            margin: 0.5rem;
            max-height: 95vh;
          }

          .modal-header {
            padding: 1rem 1.5rem 0.75rem;
          }

          .modal-content {
            padding: 1.5rem;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .subsection-title {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .modal-overlay {
            padding: 0.5rem;
          }

          .modal-header {
            padding: 0.75rem 1rem 0.5rem;
          }

          .modal-content {
            padding: 1rem;
          }

          .section-title {
            font-size: 1.3rem;
          }

          .content-paragraph, .content-list li {
            font-size: 0.95rem;
          }
        }

        /* גלילה חלקה */
        .modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: #e6ccb2;
          border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: #9c6644;
          border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: #7f5539;
        }
      `}</style>
    </div>
  );
};