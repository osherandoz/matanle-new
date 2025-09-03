import React from "react";

export default function ActivityFeed() {
  const activity = [
    { id: 1, type: "rsvp_yes",    icon: "fa-user-check",    text: "ליה סבן אישרה הגעה (+1 ילד)",                 tag: "אישר הגעה",   tone: "positive", time: "09:40" },
    { id: 2, type: "gift_pick",   icon: "fa-gift",          text: "נבחרה המתנה 'רחפן לילדים' (3 משתתפים)",      tag: "נבחרה מתנה",  tone: "positive", time: "09:55" },
    { id: 3, type: "gift_cancel", icon: "fa-gift",          text: "בוטלה השתתפות במתנה 'תוף ביניים'",           tag: "בוטלה מתנה",  tone: "negative", time: "אתמול" },
    { id: 4, type: "rsvp_no",     icon: "fa-user-xmark",    text: "נועם ישראלי ביטל הגעה",                      tag: "ביטל הגעה",   tone: "negative", time: "28.08" },
    { id: 5, type: "event_edit",  icon: "fa-pen-to-square", text: "תאריך האירוע עודכן ל־12.10.2025",             tag: "עודכן אירוע", tone: "info",     time: "28.08" },
  ];

  return (
    <div className="card glass activity">
      <div className="card-head">
        <h3><i className="fa-solid fa-clock-rotate-left"></i> פעילות אחרונה</h3>
      </div>
      <ul className="activity-list">
        {activity.map(a => (
          <li key={a.id} className="activity-item">
            <span className="icon-pill"><i className={`fa-solid ${a.icon}`}></i></span>
            <div className="a-body">
              <div className="a-text">{a.text}</div>
              <div className={`tag ${a.tone}`}>{a.tag}</div>
            </div>
            <span className="time">{a.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
