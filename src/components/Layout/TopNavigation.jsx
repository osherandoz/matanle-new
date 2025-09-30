import React from "react";
import { NavLink } from "react-router-dom";
import UserProfile from "./UserProfile";
import "./TopNavigation.css";

export default function TopNavigation() {
  const links = [
    { icon: "fa-gauge", label: "דשבורד", path: "/dashboard" },
    { icon: "fa-users", label: "מוזמנים", path: "/guests" },
    { icon: "fa-list-check", label: "משימות", path: "/tasks" },
    { icon: "fa-gifts", label: "מתנות", path: "/gifts" },
    { icon: "fa-calendar-days", label: "פרטי אירוע", path: "/event" },
    { icon: "fa-chart-line", label: "מעקב הוצאות", path: "/expenses" },
    { icon: "fa-gear", label: "הגדרות", path: "/settings" },
  ];

  return (
    <nav className="top-navigation">
      <div className="nav-container">
        {/* Brand/Logo */}
        <div className="nav-brand">
          <div className="logo">🤍</div>
          <div className="brand-name">מתנל׳ה</div>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          {links.map((link, i) => (
            <NavLink 
              key={i} 
              to={link.path}
              className={({ isActive }) => 
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <i className={`fa-solid ${link.icon}`}></i>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Right side actions */}
        <div className="nav-actions">
          <UserProfile />
        </div>
      </div>
    </nav>
  );
}
