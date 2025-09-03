import React, { useState } from "react";

// Mock event data
const mockEventData = {
  id: 1,
  eventName: "חתונת דני ושירה",
  eventType: "חתונה",
  eventDate: "2024-08-15",
  eventTime: "19:30",
  location: "אולם אגדות, תל אביב",
  address: "רחוב הרצל 45, תל אביב",


  status: "בתכנון",
  createdDate: "2024-01-15"
};

export default function EventDetailsPage() {
  const [eventData, setEventData] = useState(mockEventData);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...mockEventData });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...eventData });
  };

  const handleSave = () => {
    setEventData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...eventData });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="event-details-page">
      <div className="event-details-container">
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
              <span className={`status-badge ${eventData.status === 'בתכנון' ? 'planning' : 'active'}`}>
                {eventData.status}
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
                      value={editData.eventName}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <span className="field-value">{eventData.eventName}</span>
                  )}
                </div>

                <div className="event-field">
                  <label>סוג האירוע</label>
                  {isEditing ? (
                    <select
                      name="eventType"
                      value={editData.eventType}
                      onChange={handleInputChange}
                      className="edit-input"
                    >
                      <option value="חתונה">חתונה</option>
                      <option value="בר מצווה">בר מצווה</option>
                      <option value="בת מצווה">בת מצווה</option>
                      <option value="יום הולדת">יום הולדת</option>
                      <option value="ברית">ברית</option>
                      <option value="אירוע עסקי">אירוע עסקי</option>
                      <option value="אחר">אחר</option>
                    </select>
                  ) : (
                    <span className="field-value">{eventData.eventType}</span>
                  )}
                </div>

                <div className="event-field">
                  <label>תאריך האירוע</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="eventDate"
                      value={editData.eventDate}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <span className="field-value">
                      {new Date(eventData.eventDate).toLocaleDateString('he-IL')}
                    </span>
                  )}
                </div>

                <div className="event-field">
                  <label>שעת האירוע</label>
                  {isEditing ? (
                    <input
                      type="time"
                      name="eventTime"
                      value={editData.eventTime}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <span className="field-value">{eventData.eventTime}</span>
                  )}
                </div>

                <div className="event-field">
                  <label>מיקום</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={editData.location}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <span className="field-value">{eventData.location}</span>
                  )}
                </div>

                <div className="event-field">
                  <label>כתובת</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={editData.address}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <span className="field-value">{eventData.address}</span>
                  )}
                </div>

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
        }

        .event-details-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
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
