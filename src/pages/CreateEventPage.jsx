import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEventCheck } from "../hooks/useEventCheck";
import './LoginPage.css'; // Using the same styles as login page

const CreateEventPage = () => {
    const [eventName, setEventName] = useState('');
    const [eventType, setEventType] = useState('חתונה');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const { createEvent, loading } = useEventCheck();

    const eventTypes = [
        'בר מצווה',
        'בת מצווה',
        'ברית',
        'בריתה',
        'יום הולדת',
        'אחר'
    ];

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setError(null);
        
        // Basic validation
        if (!eventName.trim()) {
            setError('שם האירוע הוא שדה חובה');
            return;
        }
        
        if (!eventDate) {
            setError('תאריך האירוע הוא שדה חובה');
            return;
        }
        
        if (!eventTime) {
            setError('שעת האירוע היא שדה חובה');
            return;
        }
        
        if (!location.trim()) {
            setError('מקום האירוע הוא שדה חובה');
            return;
        }

        // Validate date is in the future
        const selectedDate = new Date(`${eventDate}T${eventTime}`);
        const now = new Date();
        if (selectedDate <= now) {
            setError('תאריך ושעת האירוע חייבים להיות בעתיד');
            return;
        }
        
        try {
            const eventData = {
                eventName: eventName.trim(),
                eventType,
                eventDate,
                eventTime,
                location: location.trim()
            };
            
            await createEvent(eventData);
            // Redirect to dashboard after successful creation
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'שגיאה ביצירת האירוע');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Header */}
                <div className="login-header">
                    <i className="fa-solid fa-calendar-plus logo-icon"></i>
                    <h2>צור את האירוע שלך</h2>
                    <p>בואו נתחיל לתכנן את האירוע המושלם</p>
                </div>

                <form onSubmit={handleCreateEvent}>
                    {/* Event Name */}
                    <div className="input-group">
                        <i className="fa-solid fa-calendar input-icon"></i>
                        <input
                            type="text"
                            id="eventName"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            required
                        />
                        <label htmlFor="eventName">שם האירוע</label>
                    </div>

                    {/* Event Type */}
                    <div className="input-group">
                        <i className="fa-solid fa-tag input-icon"></i>
                        <select
                            id="eventType"
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                            className="select-input"
                        >
                            {eventTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <label htmlFor="eventType" className="select-label">סוג האירוע</label>
                    </div>

                    {/* Event Date */}
                    <div className="input-group">
                        <i className="fa-solid fa-calendar-day input-icon"></i>
                        <input
                            type="date"
                            id="eventDate"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            required
                        />
                        <label htmlFor="eventDate">תאריך האירוע</label>
                    </div>

                    {/* Event Time */}
                    <div className="input-group">
                        <i className="fa-solid fa-clock input-icon"></i>
                        <input
                            type="time"
                            id="eventTime"
                            value={eventTime}
                            onChange={(e) => setEventTime(e.target.value)}
                            required
                        />
                        <label htmlFor="eventTime">שעת האירוע</label>
                    </div>

                    {/* Location */}
                    <div className="input-group">
                        <i className="fa-solid fa-location-dot input-icon"></i>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                        <label htmlFor="location">מקום האירוע</label>
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'יוצר אירוע...' : 'צור אירוע'}
                    </button>
                    
                    {error && <p className="error-message">{error}</p>}

                    <div className="signup-prompt">
                        <span>רוצה לחזור לדשבורד?</span>
                        <button 
                            type="button" 
                            className="signup-link"
                            onClick={() => navigate('/dashboard')}
                        >
                            דשבורד
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .select-input {
                    width: 100%;
                    padding: 12px 45px 12px 15px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text);
                    font-size: 16px;
                    appearance: none;
                    cursor: pointer;
                }

                .select-input:focus {
                    outline: none;
                    border-color: var(--brand);
                    box-shadow: 0 0 0 2px rgba(124, 92, 255, 0.3);
                }

                .select-label {
                    position: absolute;
                    top: 50%;
                    right: 45px;
                    transform: translateY(-50%);
                    color: var(--text-secondary);
                    font-size: 16px;
                    pointer-events: none;
                    transition: all 0.3s ease;
                }

                .input-group:focus-within .select-label,
                .select-input:not(:invalid) + .select-label {
                    top: 8px;
                    font-size: 12px;
                    color: var(--brand);
                }

                .login-header p {
                    margin: 8px 0 0 0;
                    color: var(--text-secondary);
                    font-size: 14px;
                }
            `}</style>
        </div>
    );
};

export default CreateEventPage;
