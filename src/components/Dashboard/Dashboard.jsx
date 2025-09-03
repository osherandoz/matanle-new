import React from "react";
import StatsCard from "./StatsCard";
import ActivityFeed from "./ActivityFeed";
import QuickActions from "./QuickActions";
import ListCard from "./ListCard";
import "./Dashboard.css";

export default function Dashboard() {
  // KPIs (new spec)
  const stats = [
    { icon: "fa-gifts",       title: "מתנות שנבחרו",               value: "3 / 8",    sub: "נבחרו / סה\"כ" },
    { icon: "fa-users",       title: "אורחים מאושרים",             value: "156 (36)", sub: "סה\"כ (ילדים)" },
    { icon: "fa-sack-dollar", title: "סה\"כ שווי מתנות שנבחרו",     value: "₪5,430",   sub: "עד עכשיו" },
    { icon: "fa-list-check",  title: "משימות שהושלמו",             value: "12 / 20",  sub: "במהלך התכנון" },
  ];

  // Mock data
  const eventName = "שם אירוע (מ-Firebase בהמשך)";
  const lastGuests = [
    { name: "יובל כהן",   status: "מאשר",  adults: 2, kids: 2 },
    { name: "סיגל לוי",   status: "לא השיב", adults: 1, kids: 1 },
    { name: "נועם ישראלי",status: "מסרב",  adults: 1, kids: 0 },
    { name: "גילי כהן",   status: "מאשר",  adults: 2, kids: 0 },
  ];
  const lastTasks = [
    { title: "להזמין בלונים", status: "בוצעה",  due: "05.09" },
    { title: "לקבוע צלם",    status: "פתוחה",   due: "07.09" },
    { title: "לבדוק קינוחים", status: "בתהליך", due: "09.09" },
    { title: "לשלוח הזמנות", status: "פתוחה",   due: "10.09" },
  ];
  const lastVendors = [
    { name: "סטודיו רגעים", type: "צילום",   status: "בהצעת מחיר" },
    { name: "בלוניקו",      type: "בלונים",  status: "סגור" },
    { name: "שף עדן",       type: "קייטרינג",status: "מוזמן" },
    { name: "קוסם עידו",    type: "מופע",    status: "בדיקה" },
  ];
  const lastGifts = [
    { name: "רחפן לילדים", pooled: 420, contributors: 3, status: "פתוח" },
    { name: "תוף ביניים",  pooled: 180, contributors: 2, status: "פתוח" },
    { name: "לגו טכני",     pooled: 0,   contributors: 0, status: "טיוטה" },
    { name: "משחק קופסה",   pooled: 95,  contributors: 1, status: "פתוח" },
  ];

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
        <ActivityFeed />
        <QuickActions />
      </section>

      {/* 2x2 lists */}
      <section className="grid lists">
        <ListCard
          title="אישורי הגעה אחרונים"
          icon="fa-users"
          headers={["שם","סטטוס","מבוגרים","ילדים"]}
          rows={lastGuests}
          rowFormatter={(g) => (
            <>
              <div className="td">
                <div className="row-title">{g.name}</div>
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
          rows={lastTasks.map(t => [t.title, tagStatus(t.status), t.due])}
        />
        <ListCard
          title="ספקים אחרונים"
          icon="fa-truck-fast"
          headers={["שם","סוג","סטטוס"]}
          rows={lastVendors.map(v => [v.name, v.type, tagStatus(v.status)])}
        />
        <ListCard
          title="קבוצות מתנה"
          icon="fa-gift"
          headers={["שם","נאסף","משתתפים","סטטוס"]}
          rows={lastGifts.map(g => [g.name, `₪${g.pooled}`, g.contributors, tagStatus(g.status)])}
        />
      </section>
    </div>
  );
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
  };
  const tone = map[s] || "dim";
  return <span className={`tag ${tone}`}>{s}</span>;
}
