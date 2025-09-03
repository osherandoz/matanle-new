import React from "react";

export default function StatsCard({ iconClass, title, value, subtext }) {
  return (
    <div className="card stat glass">
      <div className="stat-icon">
        <i className={`fa-solid ${iconClass}`} aria-hidden="true"></i>
      </div>
      <div className="stat-body">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-sub">{subtext}</div>
      </div>
    </div>
  );
}
