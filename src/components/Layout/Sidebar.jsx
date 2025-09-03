import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen = true }) {
  const location = useLocation();
  
  const links = [
    { icon: "fa-gauge",        label: "דשבורד", path: "/dashboard" },
    { icon: "fa-users",        label: "מוזמנים", path: "/guests" },
    { icon: "fa-list-check",   label: "משימות", path: "/tasks" },
    { icon: "fa-truck-fast",   label: "ספקים", path: "/vendors" },
    { icon: "fa-gifts",        label: "מתנות", path: "/gifts" },
    { icon: "fa-calendar-days",label: "פרטי אירוע", path: "/event" },
    { icon: "fa-chart-line",   label: "מעקב הוצאות", path: "/expenses" },
    { icon: "fa-gear",         label: "הגדרות", path: "/settings" },
  ];

  return (
    <aside className={`sidebar glass ${isOpen ? "" : "collapsed"}`}>
      <div className="brand">
        <div className="logo">🤍</div>
        <div className="name">מתנל׳ה</div>
      </div>
      <nav className="nav">
        {links.map((link, i) => (
          <NavLink 
            key={i} 
            to={link.path}
            className={({ isActive }) => 
              `nav-link ${isActive || (link.path === "/dashboard" && location.pathname === "/") ? "active" : ""}`
            }
          >
            <i className={`fa-solid ${link.icon}`}></i>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
