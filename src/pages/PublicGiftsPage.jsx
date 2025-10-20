import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, getDocs, collection, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useToast } from "../components/Toast/Toast";

export default function PublicGiftsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [event, setEvent] = useState(null);
  const [gifts, setGifts] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPhoneForm, setShowPhoneForm] = useState(true);
  const [filterStatus, setFilterStatus] = useState("זמין");

  // Load event and gifts data
  useEffect(() => {
    const loadData = async () => {
      if (!eventId) {
        showError('מזהה אירוע לא תקין');
        navigate('/');
        return;
      }

      try {
        setLoading(true);

        // Find the event by ID
        const eventSnapshot = await getDocs(collection(db, 'users'));
        let foundEvent = null;
        let eventOwnerId = null;

        for (const userDoc of eventSnapshot.docs) {
          const eventsSnapshot = await getDocs(collection(db, 'users', userDoc.id, 'events'));
          for (const eventDoc of eventsSnapshot.docs) {
            if (eventDoc.id === eventId) {
              foundEvent = { id: eventDoc.id, ...eventDoc.data() };
              eventOwnerId = userDoc.id;
              break;
            }
          }
          if (foundEvent) break;
        }

        if (!foundEvent) {
          showError('אירוע לא נמצא');
          navigate('/');
          return;
        }

        setEvent(foundEvent);

        // Load gifts and guests
        const [giftsSnapshot, guestsSnapshot] = await Promise.all([
          getDocs(collection(db, 'users', eventOwnerId, 'events', eventId, 'gifts')),
          getDocs(collection(db, 'users', eventOwnerId, 'events', eventId, 'guests'))
        ]);

        const giftsData = [];
        giftsSnapshot.forEach((doc) => {
          giftsData.push({ id: doc.id, ...doc.data() });
        });

        const guestsData = [];
        guestsSnapshot.forEach((doc) => {
          guestsData.push({ id: doc.id, ...doc.data() });
        });

        setGifts(giftsData);
        setGuests(guestsData);

      } catch (error) {
        console.error('Error loading data:', error);
        showError('שגיאה בטעינת נתוני האירוע');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventId, navigate, showError]);

  // Filter gifts
  const filteredGifts = gifts.filter(gift => {
    if (filterStatus === "זמין") return !gift.isReserved;
    if (filterStatus === "שמור") return gift.isReserved && !gift.isPurchased;
    if (filterStatus === "נרכש") return gift.isPurchased;
    return true;
  });

  // Handle phone number lookup
  const handlePhoneLookup = () => {
    if (!phoneNumber.trim()) {
      showError('אנא הכנס מספר טלפון');
      return;
    }

    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Find guest by phone number
    const guest = guests.find(g => {
      const guestCleanPhone = g.phone.replace(/[\s\-\(\)]/g, '');
      return guestCleanPhone === cleanPhone;
    });

    if (guest) {
      setSelectedGuest(guest);
      setShowPhoneForm(false);
      showSuccess(`שלום ${guest.fullName}!`);
    } else {
      showError('מספר הטלפון לא נמצא ברשימת המוזמנים');
    }
  };

  // Handle gift reservation
  const handleReserveGift = async (giftId) => {
    if (!selectedGuest || !eventId) return;

    try {
      // Find the event owner ID
      const eventSnapshot = await getDocs(collection(db, 'users'));
      let eventOwnerId = null;

      for (const userDoc of eventSnapshot.docs) {
        const eventsSnapshot = await getDocs(collection(db, 'users', userDoc.id, 'events'));
        for (const eventDoc of eventsSnapshot.docs) {
          if (eventDoc.id === eventId) {
            eventOwnerId = userDoc.id;
            break;
          }
        }
        if (eventOwnerId) break;
      }

      if (!eventOwnerId) {
        showError('שגיאה במציאת האירוע');
        return;
      }

      // Update gift in database
      const giftRef = doc(db, 'users', eventOwnerId, 'events', eventId, 'gifts', giftId);
      await updateDoc(giftRef, {
        isReserved: true,
        reservedBy: selectedGuest.fullName,
        reservedById: selectedGuest.id,
        reservedDate: new Date().toISOString(),
        updatedAt: new Date()
      });

      // Update local state
      setGifts(prevGifts =>
        prevGifts.map(gift =>
          gift.id === giftId
            ? {
                ...gift,
                isReserved: true,
                reservedBy: selectedGuest.fullName,
                reservedById: selectedGuest.id,
                reservedDate: new Date().toISOString()
              }
            : gift
        )
      );

      showSuccess(`המתנה נשמרה עבורך בהצלחה!`);
    } catch (error) {
      console.error('Error reserving gift:', error);
      showError('שגיאה בשמירת המתנה');
    }
  };

  // Handle gift release
  const handleReleaseGift = async (giftId) => {
    if (!selectedGuest || !eventId) return;

    if (!window.confirm('האם אתה בטוח שברצונך לשחרר את המתנה?')) {
      return;
    }

    try {
      // Find the event owner ID
      const eventSnapshot = await getDocs(collection(db, 'users'));
      let eventOwnerId = null;

      for (const userDoc of eventSnapshot.docs) {
        const eventsSnapshot = await getDocs(collection(db, 'users', userDoc.id, 'events'));
        for (const eventDoc of eventsSnapshot.docs) {
          if (eventDoc.id === eventId) {
            eventOwnerId = userDoc.id;
            break;
          }
        }
        if (eventOwnerId) break;
      }

      if (!eventOwnerId) {
        showError('שגיאה במציאת האירוע');
        return;
      }

      // Update gift in database
      const giftRef = doc(db, 'users', eventOwnerId, 'events', eventId, 'gifts', giftId);
      await updateDoc(giftRef, {
        isReserved: false,
        reservedBy: null,
        reservedById: null,
        reservedDate: null,
        updatedAt: new Date()
      });

      // Update local state
      setGifts(prevGifts =>
        prevGifts.map(gift =>
          gift.id === giftId
            ? {
                ...gift,
                isReserved: false,
                reservedBy: null,
                reservedById: null,
                reservedDate: null
              }
            : gift
        )
      );

      showSuccess('המתנה שוחררה בהצלחה');
    } catch (error) {
      console.error('Error releasing gift:', error);
      showError('שגיאה בשחרור המתנה');
    }
  };

  const getStatusText = (gift) => {
    if (gift.isPurchased) return "נרכש";
    if (gift.isReserved) {
      if (gift.reservedById === selectedGuest?.id) return "שמור על ידך";
      return "שמור";
    }
    return "זמין";
  };

  const getStatusClass = (gift) => {
    if (gift.isPurchased) return "status-purchased";
    if (gift.isReserved) {
      if (gift.reservedById === selectedGuest?.id) return "status-reserved-by-me";
      return "status-reserved";
    }
    return "status-available";
  };

  if (loading) {
    return (
      <div className="public-gifts-page">
        <div className="loading-container">
          <i className="fa-solid fa-spinner fa-spin"></i>
          <p>טוען נתונים...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="public-gifts-page">
        <div className="error-container">
          <i className="fa-solid fa-exclamation-triangle"></i>
          <h2>אירוע לא נמצא</h2>
          <p>האירוע שחיפשת לא קיים או נמחק</p>
        </div>
      </div>
    );
  }

  return (
    <div className="public-gifts-page">
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div className="event-info">
            <h1>
              <i className="fa-solid fa-gift"></i>
              {event.eventName}
            </h1>
            <p className="event-subtitle">בחר מתנה מהרשימה</p>
            {event.eventDate && (
              <p className="event-date">
                <i className="fa-solid fa-calendar"></i>
                {new Date(event.eventDate).toLocaleDateString('he-IL')}
              </p>
            )}
          </div>
        </div>

        {/* Phone Number Form */}
        {showPhoneForm ? (
          <div className="phone-form-container glass">
            <div className="phone-form">
              <h2>
                <i className="fa-solid fa-phone"></i>
                הזן מספר טלפון
              </h2>
              <p>אנא הזן את מספר הטלפון שלך כדי לזהות אותך</p>
              
              <div className="form-group">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="לדוגמה: 052-1234567"
                  className="phone-input"
                  onKeyPress={(e) => e.key === 'Enter' && handlePhoneLookup()}
                />
                <button 
                  className="btn btn-primary"
                  onClick={handlePhoneLookup}
                >
                  <i className="fa-solid fa-search"></i>
                  חפש
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="guest-welcome glass">
            <div className="welcome-content">
              <h2>
                <i className="fa-solid fa-user-check"></i>
                שלום {selectedGuest.fullName}!
              </h2>
              <p>כעת תוכל לבחור מתנה מהרשימה</p>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowPhoneForm(true);
                  setSelectedGuest(null);
                  setPhoneNumber("");
                }}
              >
                <i className="fa-solid fa-arrow-left"></i>
                חזור
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        {!showPhoneForm && (
          <div className="filters-container glass">
            <div className="filter-group">
              <label>סטטוס</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="זמין">זמין</option>
                <option value="שמור">שמור</option>
                <option value="נרכש">נרכש</option>
                <option value="הכל">הכל</option>
              </select>
            </div>
          </div>
        )}

        {/* Gifts Grid */}
        {!showPhoneForm && (
          <div className="gifts-grid">
            {filteredGifts.length === 0 ? (
              <div className="empty-state glass">
                <i className="fa-solid fa-gift"></i>
                <h3>אין מתנות זמינות</h3>
                <p>כל המתנות כבר נבחרו או נרכשו</p>
              </div>
            ) : (
              filteredGifts.map(gift => (
                <div key={gift.id} className="gift-card glass">
                  <div className="gift-image">
                    <img src={gift.image} alt={gift.giftName || 'מתנה'} />
                    <div className="gift-overlay">
                      <span className={`status-badge ${getStatusClass(gift)}`}>
                        {getStatusText(gift)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="gift-content">
                    <h3 className="gift-name">{gift.giftName || 'ללא שם'}</h3>
                    <div className="gift-price">₪{(gift.estimatedPrice || 0).toLocaleString()}</div>
                    
                    {gift.reservedBy && gift.reservedById !== selectedGuest?.id && (
                      <div className="reserved-info">
                        <i className="fa-solid fa-user"></i>
                        <span>שמור על ידי {gift.reservedBy}</span>
                      </div>
                    )}

                    {gift.reservedDate && gift.reservedById === selectedGuest?.id && (
                      <div className="reserved-date">
                        <i className="fa-solid fa-calendar"></i>
                        <span>נשמר ב-{new Date(gift.reservedDate).toLocaleDateString('he-IL')}</span>
                      </div>
                    )}

                    <div className="gift-actions">
                      {!gift.isReserved ? (
                        <button 
                          className="btn btn-primary reserve-btn"
                          onClick={() => handleReserveGift(gift.id)}
                        >
                          <i className="fa-solid fa-bookmark"></i>
                          שמור מתנה
                        </button>
                      ) : gift.reservedById === selectedGuest?.id ? (
                        <button 
                          className="btn btn-secondary release-btn"
                          onClick={() => handleReleaseGift(gift.id)}
                        >
                          <i className="fa-solid fa-bookmark-slash"></i>
                          שחרר מתנה
                        </button>
                      ) : (
                        <button 
                          className="btn btn-disabled"
                          disabled
                        >
                          <i className="fa-solid fa-lock"></i>
                          שמור על ידי אחר
                        </button>
                      )}
                      
                      <a 
                        href={gift.purchaseLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-outline purchase-link"
                      >
                        <i className="fa-solid fa-external-link"></i>
                        קנה עכשיו
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <style>{`
        .public-gifts-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: var(--space-lg);
        }

        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
          color: white;
        }

        .loading-container i {
          font-size: 3rem;
          margin-bottom: var(--space-md);
        }

        .error-container i {
          font-size: 4rem;
          margin-bottom: var(--space-md);
          color: #fbbf24;
        }

        .page-header {
          text-align: center;
          color: white;
        }

        .event-info h1 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          font-size: 2.5rem;
          margin: 0 0 var(--space-sm) 0;
          font-weight: 700;
        }

        .event-subtitle {
          font-size: 1.2rem;
          margin: 0 0 var(--space-xs) 0;
          opacity: 0.9;
        }

        .event-date {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-xs);
          font-size: 1rem;
          margin: 0;
          opacity: 0.8;
        }

        .phone-form-container,
        .guest-welcome,
        .filters-container {
          padding: var(--space-xl);
          border-radius: var(--radius-lg);
          text-align: center;
        }

        .phone-form h2 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          margin: 0 0 var(--space-sm) 0;
          color: var(--text);
        }

        .phone-form p {
          margin: 0 0 var(--space-lg) 0;
          color: var(--text-secondary);
        }

        .form-group {
          display: flex;
          gap: var(--space-md);
          max-width: 400px;
          margin: 0 auto;
        }

        .phone-input {
          flex: 1;
          padding: var(--space-md);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
          font-size: 1rem;
        }

        .phone-input:focus {
          outline: none;
          border-color: var(--brand);
          box-shadow: 0 0 0 2px rgba(124, 92, 255, 0.3);
        }

        .phone-input::placeholder {
          color: var(--text-secondary);
        }

        .welcome-content h2 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          margin: 0 0 var(--space-sm) 0;
          color: var(--text);
        }

        .welcome-content p {
          margin: 0 0 var(--space-lg) 0;
          color: var(--text-secondary);
        }

        .filters-container {
          display: flex;
          justify-content: center;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .filter-group label {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .filter-group select {
          padding: var(--space-sm) var(--space-md);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
          font-size: 1rem;
        }

        .filter-group select:focus {
          outline: none;
          border-color: var(--brand);
          box-shadow: 0 0 0 2px rgba(124, 92, 255, 0.3);
        }

        .gifts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--space-lg);
        }

        .empty-state {
          grid-column: 1 / -1;
          padding: var(--space-xl);
          text-align: center;
          color: var(--text-secondary);
        }

        .empty-state i {
          font-size: 3rem;
          margin-bottom: var(--space-md);
          opacity: 0.5;
        }

        .gift-card {
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .gift-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .gift-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gift-overlay {
          position: absolute;
          top: var(--space-sm);
          right: var(--space-sm);
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 500;
          border: 1px solid;
        }

        .status-badge.status-available {
          background: rgba(30, 190, 126, 0.2);
          color: #1ebe7e;
          border-color: rgba(30, 190, 126, 0.4);
        }

        .status-badge.status-reserved {
          background: rgba(241, 180, 76, 0.2);
          color: #f1b44c;
          border-color: rgba(241, 180, 76, 0.4);
        }

        .status-badge.status-reserved-by-me {
          background: rgba(124, 92, 255, 0.2);
          color: var(--brand);
          border-color: rgba(124, 92, 255, 0.4);
        }

        .status-badge.status-purchased {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          border-color: rgba(59, 130, 246, 0.4);
        }

        .gift-content {
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          flex: 1;
        }

        .gift-name {
          margin: 0;
          font-size: 1.3rem;
          color: var(--text);
          font-weight: 600;
        }

        .gift-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--brand);
        }

        .reserved-info,
        .reserved-date {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .gift-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          margin-top: auto;
        }

        .btn {
          padding: var(--space-sm) var(--space-md);
          border: none;
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-xs);
          text-decoration: none;
        }

        .btn-primary {
          background: var(--brand);
          color: white;
        }

        .btn-primary:hover {
          background: var(--brand-hover);
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: rgba(156, 163, 175, 0.2);
          color: #9ca3af;
        }

        .btn-secondary:hover {
          background: rgba(156, 163, 175, 0.3);
          color: var(--text);
        }

        .btn-outline {
          background: transparent;
          color: var(--brand);
          border: 1px solid var(--brand);
        }

        .btn-outline:hover {
          background: var(--brand);
          color: white;
        }

        .btn-disabled {
          background: rgba(156, 163, 175, 0.1);
          color: #9ca3af;
          cursor: not-allowed;
          opacity: 0.6;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .public-gifts-page {
            padding: var(--space-md);
          }

          .event-info h1 {
            font-size: 2rem;
          }

          .gifts-grid {
            grid-template-columns: 1fr;
          }

          .form-group {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

