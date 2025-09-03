import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Toast/Toast";

export default function QuickActions() {
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useToast();

  const handleEditEvent = () => {
    navigate('/event');
    showInfo('עבר לעמוד פרטי האירוע');
  };

  const handleAddVendor = () => {
    navigate('/vendors');
    showInfo('עבר לעמוד הספקים');
  };

  const handleAddTask = () => {
    navigate('/tasks');
    showInfo('עבר לעמוד המשימות');
  };

  const handleAddExpense = () => {
    navigate('/expenses');
    showInfo('עבר לעמוד מעקב ההוצאות');
  };

  const handleViewGuests = () => {
    navigate('/guests');
    showInfo('עמוד המוזמנים בפיתוח');
  };

  const handleShareEvent = () => {
    showSuccess('קישור האירוע הועתק ללוח');
  };

  return (
    <div className="card glass quick">
      <div className="card-head">
        <h3><i className="fa-solid fa-bolt"></i> פעולות מהירות</h3>
        <p>גישה מהירה לפעולות נפוצות</p>
      </div>
      <div className="quick-grid">
        <button className="btn primary" onClick={handleEditEvent}>
          <i className="fa-solid fa-calendar-days"></i> 
          <span>עריכת פרטי אירוע</span>
        </button>
        <button className="btn secondary" onClick={handleAddTask}>
          <i className="fa-solid fa-plus-circle"></i> 
          <span>הוספת משימה</span>
        </button>
        <button className="btn secondary" onClick={handleAddVendor}>
          <i className="fa-solid fa-truck-fast"></i> 
          <span>הוספת ספק</span>
        </button>
        <button className="btn secondary" onClick={handleAddExpense}>
          <i className="fa-solid fa-plus"></i> 
          <span>הוספת הוצאה</span>
        </button>
        <button className="btn tertiary" onClick={handleViewGuests}>
          <i className="fa-solid fa-users"></i> 
          <span>ניהול מוזמנים</span>
        </button>
        <button className="btn tertiary" onClick={handleShareEvent}>
          <i className="fa-solid fa-share-from-square"></i> 
          <span>שיתוף אירוע</span>
        </button>
      </div>

      <style jsx>{`
        .card-head p {
          margin: var(--space-xs) 0 0 0;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .quick-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-sm);
        }

        .btn {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-lg);
          border: none;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition);
          text-align: right;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.1);
        }

        .btn.primary {
          background: var(--brand);
          color: white;
          border-color: var(--brand);
        }

        .btn.primary:hover {
          background: var(--brand-hover);
          border-color: var(--brand-hover);
        }

        .btn.secondary {
          background: rgba(30, 190, 126, 0.1);
          color: #1ebe7e;
          border-color: rgba(30, 190, 126, 0.2);
        }

        .btn.secondary:hover {
          background: rgba(30, 190, 126, 0.2);
          border-color: rgba(30, 190, 126, 0.3);
        }

        .btn.tertiary {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border-color: rgba(59, 130, 246, 0.2);
        }

        .btn.tertiary:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .btn i {
          font-size: 1.1rem;
          min-width: 20px;
        }

        .btn span {
          flex: 1;
        }

        @media (max-width: 768px) {
          .quick-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
