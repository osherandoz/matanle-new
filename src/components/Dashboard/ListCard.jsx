import React from "react";
import { useNavigate } from "react-router-dom";

export default function ListCard({ title, icon, headers, rows, rowFormatter, linkTo }) {
  const navigate = useNavigate();

  return (
    <div className="card glass list-card">
      <div className="card-head">
        <h3><i className={`fa-solid ${icon}`}></i> {title}</h3>
        {linkTo && (
          <button className="btn ghost" onClick={() => navigate(linkTo)}>
            <i className="fa-solid fa-up-right-from-square"></i> לכל הרשומות
          </button>
        )}
      </div>
      <div className="table">
        <div className="thead">
          {headers.map((h, i) => <div key={i} className="th">{h}</div>)}
        </div>
        <div className="tbody">
          {rows.map((r, i) => (
            <div key={i} className="tr">
              {rowFormatter
                ? rowFormatter(r)
                : headers.map((_, j) => <div key={j} className="td">{Array.isArray(r) ? r[j] : ""}</div>)
              }
            </div>
          ))}
        </div>
        {rows.length === 0 && <div className="empty">אין נתונים עדיין</div>}
      </div>
    </div>
  );
}
