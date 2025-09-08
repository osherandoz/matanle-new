import React from "react";

export default function Topbar({ title, subtitle }) {
  return (
    <header className="topbar">
      <div className="page-title">
        <h1>{title || "דשבורד"}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
    </header>
  );
}
