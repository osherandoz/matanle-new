import React, { useState, useEffect } from "react";
import StatsCard from "./StatsCard";
import ActivityFeed from "./ActivityFeed";
import QuickActions from "./QuickActions";
import ListCard from "./ListCard";
import { useEventCheck } from "../../hooks/useEventCheck";
import { useEventSubcollections } from "../../hooks/useEventSubcollections";
import "./Dashboard.css";

export default function Dashboard() {
  const { currentEvent } = useEventCheck();
  const { getItems } = useEventSubcollections(currentEvent?.id);

  const [guests, setGuests] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all data
  useEffect(() => {
    const loadAllData = async () => {
      if (!currentEvent?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [guestsData, tasksData, vendorsData, giftsData] = await Promise.all([
          getItems('guests').catch(() => []),
          getItems('tasks').catch(() => []),
          getItems('vendors').catch(() => []),
          getItems('gifts').catch(() => [])
        ]);

        setGuests(guestsData);
        setTasks(tasksData);
        setVendors(vendorsData);
        setGifts(giftsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEvent?.id]);

  // Calculate stats
  const reservedGifts = gifts.filter(g => g.status === 'שמור' || g.status === 'נרכש').length;
  const totalGifts = gifts.length;
  const confirmedGuests = guests.filter(g => g.status === 'מאשר').length;
  const totalKids = guests.reduce((sum, g) => sum + (parseInt(g.kids) || 0), 0);
  const totalGiftValue = gifts
    .filter(g => g.status === 'שמור' || g.status === 'נרכש')
    .reduce((sum, g) => sum + (parseFloat(g.estimatedPrice) || 0), 0);
  const completedTasks = tasks.filter(t => t.status === 'הושלם').length;
  const totalTasks = tasks.length;

  const stats = [
    { icon: "fa-gifts", title: "מתנות שנבחרו", value: `${reservedGifts} / ${totalGifts}`, sub: "נבחרו / סה\"כ" },
    { icon: "fa-users", title: "אורחים מאושרים", value: `${confirmedGuests} (${totalKids})`, sub: "סה\"כ (ילדים)" },
    { icon: "fa-sack-dollar", title: "סה\"כ שווי מתנות שנבחרו", value: `₪${totalGiftValue.toLocaleString()}`, sub: "עד עכשיו" },
    { icon: "fa-list-check", title: "משימות שהושלמו", value: `${completedTasks} / ${totalTasks}`, sub: "במהלך התכנון" },
  ];

  // Get recent items (sorted by updatedAt/createdAt)
  const lastGuests = guests
    .sort((a, b) => {
      const dateA = a.updatedAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.updatedAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    })
    .slice(0, 4);

  const lastTasks = tasks
    .sort((a, b) => {
      const dateA = a.updatedAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.updatedAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    })
    .slice(0, 4);

  const lastVendors = vendors
    .sort((a, b) => {
      const dateA = a.updatedAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.updatedAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    })
    .slice(0, 4);

  const lastGifts = gifts
    .sort((a, b) => {
      const dateA = a.updatedAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.updatedAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    })
    .slice(0, 4);

  const eventName = currentEvent?.eventName || "אירוע";

  if (loading) {
    return (
      <div className="dashboard">
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
          <p>טוען נתונים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* KPIs */}
      <section className="grid stats">
        {stats.map((s, i) => (
          <StatsCard
            key={i}
            iconClass={s.icon}
            title={s.title}
            value={s.value}
            subtext={s.sub}
          />
        ))}
      </section>

      {/* Activity + Quick Actions */}
      <section className="grid middle">
        <ActivityFeed guests={guests} tasks={tasks} vendors={vendors} gifts={gifts} />
        <QuickActions />
      </section>

      {/* 2x2 lists */}
      <section className="grid lists">
        <ListCard
          title="אישורי הגעה אחרונים"
          icon="fa-users"
          headers={["שם","סטטוס","מבוגרים","ילדים"]}
          rows={lastGuests}
          linkTo="/guests"
          rowFormatter={(g) => (
            <>
              <div className="td">
                <div className="row-title">{g.fullName}</div>
                <div className="row-sub">אורח ל־{eventName}</div>
              </div>
              <div className="td">{tagStatus(g.status)}</div>
              <div className="td">{g.adults}</div>
              <div className="td">{g.kids}</div>
            </>
          )}
        />
        <ListCard
          title="משימות אחרונות"
          icon="fa-list-check"
          headers={["כותרת","סטטוס","דדליין"]}
          linkTo="/tasks"
          rows={lastTasks.map(t => [
            t.title, 
            tagStatus(mapTaskStatus(t.status)), 
            t.dueDate ? new Date(t.dueDate).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }) : '-'
          ])}
        />
        <ListCard
          title="ספקים אחרונים"
          icon="fa-truck-fast"
          headers={["שם","קטגוריה","סטטוס"]}
          linkTo="/vendors"
          rows={lastVendors.map(v => [
            v.name, 
            v.category, 
            tagStatus(mapVendorStatus(v.status))
          ])}
        />
        <ListCard
          title="מתנות אחרונות"
          icon="fa-gift"
          headers={["שם","מחיר משוער","סטטוס"]}
          linkTo="/gifts"
          rows={lastGifts.map(g => [
            g.giftName, 
            `₪${parseFloat(g.estimatedPrice || 0).toLocaleString()}`, 
            tagStatus(mapGiftStatus(g.status))
          ])}
        />
      </section>
    </div>
  );
}

// Map statuses to dashboard-friendly labels
function mapTaskStatus(status) {
  const map = {
    "חדש": "פתוחה",
    "בביצוע": "בתהליך",
    "הושלם": "בוצעה"
  };
  return map[status] || status;
}

function mapVendorStatus(status) {
  const map = {
    "מאושר": "סגור",
    "בהמתנה": "בהצעת מחיר",
    "בבדיקה": "בדיקה",
    "נדחה": "נדחה"
  };
  return map[status] || status;
}

function mapGiftStatus(status) {
  const map = {
    "זמין": "פתוח",
    "שמור": "נבחרה",
    "נרכש": "נבחרה"
  };
  return map[status] || status;
}

function tagStatus(s) {
  const map = {
    "מאשר": "success",
    "מסרב": "danger",
    "לא השיב": "dim",
    "בהצעת מחיר": "dim",
    "טיוטה": "dim",
    "פתוח": "warning",
    "פתוחה": "warning",
    "בתהליך": "warning",
    "מוזמן": "warning",
    "סגור": "success",
    "בוצעה": "success",
    "נבחרה": "success",
    "בדיקה": "warning",
    "נדחה": "danger"
  };
  const tone = map[s] || "dim";
  return <span className={`tag ${tone}`}>{s}</span>;
}
