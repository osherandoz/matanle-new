import React from "react";

export default function Topbar({ isSidebarOpen, onToggleSidebar }) {
  return (
    <header className="topbar">
      <div className="left-actions">
        <button className="btn ghost" aria-label="פתח/סגור תפריט" onClick={onToggleSidebar}>
          <i className="fa-solid fa-bars"></i>
        </button>
        <div className="page-title">
          <h1>דשבורד</h1>
          <p className="muted">סקירה מהירה של כל מה שקורה סביב האירוע</p>
        </div>
      </div>
      <div className="top-actions">
        <div className="search glass">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input placeholder="חיפוש מהיר (דמה)" />
        </div>
        <button className="btn primary">
          <i className="fa-solid fa-share-from-square"></i> שתף אירוע
        </button>
      </div>
    </header>
  );
}
