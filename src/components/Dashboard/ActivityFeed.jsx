import React, { useMemo } from "react";

export default function ActivityFeed({ guests = [], tasks = [], vendors = [], gifts = [] }) {
  const activity = useMemo(() => {
    const activities = [];

    // Add guest activities
    guests.forEach(guest => {
      const date = guest.updatedAt?.toDate?.() || guest.createdAt?.toDate?.() || new Date();
      const kidsText = guest.kids > 0 ? ` (+${guest.kids} ${guest.kids === 1 ? 'ילד' : 'ילדים'})` : '';
      
      if (guest.status === 'מאשר') {
        activities.push({
          id: `guest-${guest.id}`,
          type: "rsvp_yes",
          icon: "fa-user-check",
          text: `${guest.fullName} אישר/ה הגעה${kidsText}`,
          tag: "אישר הגעה",
          tone: "positive",
          timestamp: date
        });
      } else if (guest.status === 'מסרב') {
        activities.push({
          id: `guest-${guest.id}`,
          type: "rsvp_no",
          icon: "fa-user-xmark",
          text: `${guest.fullName} ביטל/ה הגעה`,
          tag: "ביטל הגעה",
          tone: "negative",
          timestamp: date
        });
      } else {
        activities.push({
          id: `guest-${guest.id}`,
          type: "guest_add",
          icon: "fa-user-plus",
          text: `${guest.fullName} נוסף/ה לרשימת האורחים`,
          tag: "אורח חדש",
          tone: "info",
          timestamp: date
        });
      }
    });

    // Add gift activities
    gifts.forEach(gift => {
      const date = gift.updatedAt?.toDate?.() || gift.createdAt?.toDate?.() || new Date();
      
      if (gift.status === 'שמור' || gift.status === 'נרכש') {
        const guestName = gift.reservedBy || 'אורח';
        activities.push({
          id: `gift-${gift.id}`,
          type: "gift_pick",
          icon: "fa-gift",
          text: `${guestName} בחר/ה את המתנה '${gift.giftName}'`,
          tag: "נבחרה מתנה",
          tone: "positive",
          timestamp: date
        });
      } else if (gift.status === 'זמין') {
        activities.push({
          id: `gift-${gift.id}`,
          type: "gift_add",
          icon: "fa-gift",
          text: `המתנה '${gift.giftName}' נוספה לרשימה`,
          tag: "מתנה חדשה",
          tone: "info",
          timestamp: date
        });
      }
    });

    // Add task activities
    tasks.forEach(task => {
      const date = task.updatedAt?.toDate?.() || task.createdAt?.toDate?.() || new Date();
      
      if (task.status === 'הושלם') {
        activities.push({
          id: `task-${task.id}`,
          type: "task_complete",
          icon: "fa-check-circle",
          text: `המשימה '${task.title}' הושלמה`,
          tag: "משימה הושלמה",
          tone: "positive",
          timestamp: date
        });
      } else if (task.status === 'בביצוע') {
        activities.push({
          id: `task-${task.id}`,
          type: "task_progress",
          icon: "fa-tasks",
          text: `העבודה על '${task.title}' החלה`,
          tag: "משימה בתהליך",
          tone: "info",
          timestamp: date
        });
      } else {
        activities.push({
          id: `task-${task.id}`,
          type: "task_add",
          icon: "fa-plus-circle",
          text: `משימה חדשה: '${task.title}'`,
          tag: "משימה חדשה",
          tone: "info",
          timestamp: date
        });
      }
    });

    // Add vendor activities
    vendors.forEach(vendor => {
      const date = vendor.updatedAt?.toDate?.() || vendor.createdAt?.toDate?.() || new Date();
      
      if (vendor.status === 'מאושר') {
        activities.push({
          id: `vendor-${vendor.id}`,
          type: "vendor_approve",
          icon: "fa-check",
          text: `הספק '${vendor.name}' אושר`,
          tag: "ספק אושר",
          tone: "positive",
          timestamp: date
        });
      } else {
        activities.push({
          id: `vendor-${vendor.id}`,
          type: "vendor_add",
          icon: "fa-truck",
          text: `ספק חדש: '${vendor.name}'`,
          tag: "ספק חדש",
          tone: "info",
          timestamp: date
        });
      }
    });

    // Sort by timestamp (most recent first) and take top 5
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5)
      .map(activity => ({
        ...activity,
        time: formatRelativeTime(activity.timestamp)
      }));
  }, [guests, tasks, vendors, gifts]);

  if (activity.length === 0) {
    return (
      <div className="card glass activity">
        <div className="card-head">
          <h3><i className="fa-solid fa-clock-rotate-left"></i> פעילות אחרונה</h3>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <i className="fa-solid fa-inbox" style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }}></i>
          <p>אין פעילות עדיין</p>
        </div>
      </div>
    );
  }

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

// Helper function to format relative time
function formatRelativeTime(date) {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'עכשיו';
  if (minutes < 60) return `לפני ${minutes} דק'`;
  if (hours < 24) return `לפני ${hours} שעות`;
  if (days === 1) return 'אתמול';
  if (days < 7) return `לפני ${days} ימים`;
  
  return date.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
}
