import React, { useState, useEffect } from "react";
import { useEventCheck } from "../hooks/useEventCheck";
import { useToast } from "../components/Toast/Toast";

export default function EventDetailsPage() {
  const { currentEvent, updateEvent, loading: eventLoading } = useEventCheck();
  const { showError } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Update editData when currentEvent changes
  useEffect(() => {
    if (currentEvent) {
      setEditData({
        eventName: currentEvent.eventName || "",
        eventType: currentEvent.eventType || "חתונה",
        eventDate: currentEvent.eventDate || "",
        eventTime: currentEvent.eventTime || "",
        location: currentEvent.location || "",
        status: currentEvent.status || "בתכנון"
      });
    }
  }, [currentEvent]);

  const handleEdit = () => {
    setIsEditing(true);
    if (currentEvent) {
      setEditData({
        eventName: currentEvent.eventName || "",
        eventType: currentEvent.eventType || "חתונה",
        eventDate: currentEvent.eventDate || "",
        eventTime: currentEvent.eventTime || "",
        location: currentEvent.location || "",
        address: currentEvent.address || "",
        status: currentEvent.status || "בתכנון"
      });
    }
  };

  const handleSave = async () => {
    if (!currentEvent?.id) {
      showError('אין אירוע פעיל');
      return;
    }

    // Basic validation
    if (!editData.eventName?.trim()) {
      showError("אנא מלא את שם האירוע");
      return;
    }

    if (!editData.eventDate) {
      showError("אנא בחר תאריך לאירוע");
      return;
    }

    try {
      // Update event in database
      await updateEvent(currentEvent.id, {
        eventName: editData.eventName.trim(),
        eventType: editData.eventType,
        eventDate: editData.eventDate,
        eventTime: editData.eventTime,
        location: editData.location?.trim() || "",
        address: editData.address?.trim() || "",
        status: editData.status
      });

      // Show success message
      setSuccessMessage('האירוע עודכן בהצלחה!');
      
      // Close edit mode after a short delay
      setTimeout(() => {
        setSuccessMessage("");
        setIsEditing(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error updating event:', error);
      showError('שגיאה בעדכון האירוע');
    }
  };

  const handleCancel = () => {
    if (currentEvent) {
      setEditData({
        eventName: currentEvent.eventName || "",
        eventType: currentEvent.eventType || "חתונה",
        eventDate: currentEvent.eventDate || "",
        eventTime: currentEvent.eventTime || "",
        location: currentEvent.location || "",
        address: currentEvent.address || "",
        status: currentEvent.status || "בתכנון"
      });
    }
    setSuccessMessage("");
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Loading state
  if (eventLoading) {
    return (
      <div className="event-details-page">
        <div className="loading-container">
          <div className="loading-spinner">
            <i className="fa-solid fa-spinner fa-spin"></i>
          </div>
          <p>טוען פרטי אירוע...</p>
        </div>
      </div>
    );
  }

  // No event state
  if (!currentEvent) {
    return (
      <div className="event-details-page">
        <div className="empty-state glass">
          <div className="empty-icon">
            <i className="fa-solid fa-calendar-xmark"></i>
          </div>
          <h3>אין אירוע פעיל</h3>
          <p>אנא צור אירוע חדש כדי להתחיל</p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-details-page">
      <div className="event-details-container">
        {successMessage && (
          <div className="success-message">
            <i className="fa-solid fa-check-circle"></i>
            {successMessage}
          </div>
        )}
        
        <div className="event-header">
          <div className="header-content">
            <h1>
              <i className="fa-solid fa-calendar-days"></i>
              פרטי האירוע
            </h1>
            <div className="header-actions">
              {!isEditing ? (
                <button className="btn btn-primary" onClick={handleEdit}>
                  <i className="fa-solid fa-pen"></i>
                  עריכה
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="btn btn-outline" onClick={handleCancel}>
                    ביטול
                  </button>
                  <button className="btn btn-primary" onClick={handleSave}>
                    <i className="fa-solid fa-check"></i>
                    שמור
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="event-content">
          <div className="event-card glass">
            <div className="card-header">
              <h2>
                <i className="fa-solid fa-calendar-days"></i>
                פרטי האירוע
              </h2>
              <span className={`status-badge ${currentEvent.status === 'בתכנון' ? 'planning' : 'active'}`}>
                {currentEvent.status}
              </span>
            </div>
            <div className="card-body">
              <div className="event-grid">
                <div className="event-field">
                  <label>שם האירוע</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="eventName"
                      value={editData.eventName || ""}
                      onChange={handleInputChange}
                      className="edit-input"
                      required
                    />
                  ) : (
                    <span className="field-value">{currentEvent.eventName}</span>
                  )}
                </div>

                <div className="event-field">
                  <label>סוג האירוע</label>
                  {isEditing ? (
                    <select
                      name="eventType"
                      value={editData.eventType || "חתונה"}
                      onChange={handleInputChange}
                      className="edit-input"
                    >
                      <option value="בר מצווה">בר מצווה</option>
                      <option value="בת מצווה">בת מצווה</option>
                      <option value="יום הולדת">יום הולדת</option>
                      <option value="ברית">ברית</option>
                      <option value="בריתה">בריתה</option>
                      <option value="אחר">אחר</option>
                    </select>
                  ) : (
                    <span className="field-value">{currentEvent.eventType}</span>
                  )}
                </div>

                <div className="event-field">
                  <label>תאריך האירוע</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="eventDate"
                      value={editData.eventDate || ""}
                      onChange={handleInputChange}
                      className="edit-input"
                      required
                    />
                  ) : (
                    <span className="field-value">
                      {currentEvent.eventDate ? new Date(currentEvent.eventDate).toLocaleDateString('he-IL') : 'לא הוגדר'}
                    </span>
                  )}
                </div>

                <div className="event-field">
                  <label>שעת האירוע</label>
                  {isEditing ? (
                    <input
                      type="time"
                      name="eventTime"
                      value={editData.eventTime || ""}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <span className="field-value">{currentEvent.eventTime || 'לא הוגדר'}</span>
                  )}
                </div>

                <div className="event-field">
                  <label>מיקום</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={editData.location || ""}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <span className="field-value">{currentEvent.location || 'לא הוגדר'}</span>
                  )}
                </div>


                {isEditing && (
                  <div className="event-field">
                    <label>סטטוס</label>
                    <select
                      name="status"
                      value={editData.status || "בתכנון"}
                      onChange={handleInputChange}
                      className="edit-input"
                    >
                      <option value="בתכנון">בתכנון</option>
                      <option value="פעיל">פעיל</option>
                      <option value="הסתיים">הסתיים</option>
                      <option value="בוטל">בוטל</option>
                    </select>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .event-details-page {
          padding: var(--space-lg);
          max-width: 1200px;
          margin: 0 auto;
          min-height: 100vh;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-xl);
          gap: var(--space-md);
        }

        .loading-spinner {
          font-size: 3rem;
          color: var(--brand);
        }

        .loading-container p {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        .empty-state {
          padding: var(--space-xl);
          text-align: center;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-lg);
          margin-top: var(--space-xl);
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          color: #ef4444;
        }

        .empty-state h3 {
          margin: 0;
          font-size: 1.5rem;
          color: var(--text);
          font-weight: 600;
        }

        .empty-state p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 1.1rem;
          max-width: 400px;
          line-height: 1.6;
        }

        .event-details-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .success-message {
          background: rgba(30, 190, 126, 0.2);
          border: 1px solid rgba(30, 190, 126, 0.4);
          color: #1ebe7e;
          padding: var(--space-md);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-weight: 500;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .event-header {
          margin-bottom: var(--space-md);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-md);
        }

        .header-content h1 {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin: 0;
          font-size: 2rem;
          color: var(--text);
          font-weight: 600;
        }

        .edit-actions {
          display: flex;
          gap: var(--space-sm);
        }

        .event-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .event-card {
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-md);
          padding-bottom: var(--space-sm);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .card-header h2 {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin: 0;
          font-size: 1.4rem;
          color: var(--text);
          font-weight: 600;
        }

        .event-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-md);
        }

        .event-field {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .event-field.full-width {
          grid-column: 1 / -1;
        }

        .event-field label {
          font-weight: 600;
          color: var(--text-dim);
          font-size: 0.9rem;
        }

        .field-value {
          color: var(--text);
          font-size: 1rem;
          padding: var(--space-sm) 0;
        }



        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 600;
          width: fit-content;
        }

        .status-badge.planning {
          background: rgba(241, 180, 76, 0.2);
          color: #f1b44c;
          border: 1px solid rgba(241, 180, 76, 0.4);
        }

        .status-badge.active {
          background: rgba(30, 190, 126, 0.2);
          color: #1ebe7e;
          border: 1px solid rgba(30, 190, 126, 0.4);
        }

        .edit-input {
          padding: var(--space-sm) var(--space-md);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
          font-family: inherit;
          font-size: 1rem;
          transition: all var(--transition);
        }

        .edit-input:focus {
          outline: none;
          border-color: var(--brand);
          box-shadow: 0 0 0 2px rgba(124, 92, 255, 0.3);
        }

        .btn {
          padding: var(--space-sm) var(--space-lg);
          border: none;
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .btn-primary {
          background: var(--brand);
          color: white;
        }

        .btn-primary:hover {
          background: var(--brand-hover);
          transform: translateY(-1px);
        }

        .btn-outline {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text);
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .event-details-page {
            padding: var(--space-md);
          }

          .header-content {
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-md);
          }

          .header-content h1 {
            font-size: 1.5rem;
          }

          .edit-actions {
            justify-content: center;
          }

          .event-grid {
            grid-template-columns: 1fr;
            gap: var(--space-md);
          }

          .event-card {
            padding: var(--space-md);
          }
        }
      `}</style>
    </div>
  );
}
