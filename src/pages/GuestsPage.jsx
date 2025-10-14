import React, { useState, useEffect } from "react";
import { useEventCheck } from "../hooks/useEventCheck";
import { useEventSubcollections } from "../hooks/useEventSubcollections";
import { useToast } from "../components/Toast/Toast";

const relatives = ["הכל", "צד אמא", "צד אבא", "חברים", "אחר"];
const statuses = ["הכל", "מאשר", "לא מגיע", "לא החזיר תשובה"];

export default function GuestsPage() {
  const { currentEvent } = useEventCheck();
  const { getGuests, addGuest, updateGuest, deleteGuest } = useEventSubcollections(currentEvent?.id);
  const { showSuccess, showError } = useToast();
  
  const [guests, setGuests] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // "table" or "grid"
  const [filterRelative, setFilterRelative] = useState("הכל");
  const [filterStatus, setFilterStatus] = useState("הכל");
  const [sortBy, setSortBy] = useState("fullName");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null); // ID of guest whose status is being edited
  const [editingGuest, setEditingGuest] = useState(null); // Guest being edited
  const [newGuest, setNewGuest] = useState({
    fullName: "",
    phone: "",
    adults: 1,
    kids: 0,
    relative: "צד אמא",
    notes: ""
  });

  // Load guests when component mounts or currentEvent changes
  useEffect(() => {
    const loadGuests = async () => {
      if (!currentEvent?.id) {
        setGuests([]);
        return;
      }

      try {
        const guestsData = await getGuests();
        setGuests(guestsData);
      } catch (error) {
        console.error('Error loading guests:', error);
        // Silent error - don't show to user, just keep empty state
      }
    };

    loadGuests();
  }, [currentEvent?.id, getGuests]);

  // Filter and sort guests
  const filteredGuests = guests
    .filter(guest => {
      const matchesRelative = filterRelative === "הכל" || guest.relative === filterRelative;
      const matchesStatus = filterStatus === "הכל" || guest.status === filterStatus;
      const matchesSearch = guest.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           guest.phone.includes(searchTerm) ||
                           guest.relative.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           guest.notes.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRelative && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Calculate stats - using all guests from the database (not filtered)
  const confirmedGuests = guests.filter(g => g.status === "מאשר").length;
  const totalAdults = guests.reduce((sum, g) => sum + (g.adults || 0), 0);
  const totalKids = guests.reduce((sum, g) => sum + (g.kids || 0), 0);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "מאשר": return "status-confirmed";
      case "לא מגיע": return "status-declined";
      case "לא החזיר תשובה": return "status-no-response";
      default: return "";
    }
  };

  const handleStatusChange = async (guestId, newStatus) => {
    if (!currentEvent?.id) {
      showError('אין אירוע פעיל');
      return;
    }

    try {
      // Update in database
      await updateGuest(guestId, { status: newStatus });
      
      // Update local state
      setGuests(prevGuests => 
        prevGuests.map(guest => 
          guest.id === guestId ? { ...guest, status: newStatus } : guest
        )
      );
      setEditingStatus(null);
    } catch (error) {
      console.error('Error updating guest status:', error);
      showError('שגיאה בעדכון סטטוס המוזמן');
    }
  };

  const handleStatusClick = (guestId) => {
    setEditingStatus(editingStatus === guestId ? null : guestId);
  };

  // Close status dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editingStatus && !event.target.closest('.status-cell')) {
        setEditingStatus(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingStatus]);

  const handleAddGuest = async (e) => {
    e.preventDefault();
    
    if (!currentEvent?.id) {
      showError('אין אירוע פעיל');
      return;
    }
    
    // Basic validation
    if (!newGuest.fullName.trim() || !newGuest.phone.trim()) {
      showError("אנא מלא את השם המלא ומספר הטלפון");
      return;
    }

    // Validate phone number (basic Israeli phone validation)
    const phoneRegex = /^(\+972|0)?[2-9]\d{1,2}-?\d{7}$/;
    if (!phoneRegex.test(newGuest.phone.replace(/\s/g, ''))) {
      showError("אנא הכנס מספר טלפון תקין");
      return;
    }

    try {
      // Create guest data for database
      const guestData = {
        fullName: newGuest.fullName.trim(),
        phone: newGuest.phone.trim(),
        adults: parseInt(newGuest.adults),
        kids: parseInt(newGuest.kids),
        relative: newGuest.relative,
        notes: newGuest.notes.trim(),
        status: "לא החזיר תשובה"
      };

      // Add to database
      const newGuestDoc = await addGuest(guestData);
      
      // Update local state
      setGuests(prevGuests => [...prevGuests, newGuestDoc]);
      
      // Show success message
      showSuccess(`המוזמן "${guestData.fullName}" נוסף בהצלחה!`);
      
      // Reset form and close modal
      setNewGuest({
        fullName: "",
        phone: "",
        adults: 1,
        kids: 0,
        relative: "צד אמא",
        notes: ""
      });
      setShowAddForm(false);
      
    } catch (error) {
      console.error('Error adding guest:', error);
      showError('שגיאה בהוספת המוזמן');
    }
  };

  const handleEditGuest = (guest) => {
    setEditingGuest(guest);
    setNewGuest({
      fullName: guest.fullName,
      phone: guest.phone,
      adults: guest.adults,
      kids: guest.kids,
      relative: guest.relative,
      notes: guest.notes || ""
    });
    setShowAddForm(true);
  };

  const handleUpdateGuest = async (e) => {
    e.preventDefault();
    
    if (!currentEvent?.id || !editingGuest) {
      showError('שגיאה בעדכון המוזמן');
      return;
    }
    
    // Basic validation
    if (!newGuest.fullName.trim() || !newGuest.phone.trim()) {
      showError("אנא מלא את השם המלא ומספר הטלפון");
      return;
    }

    // Validate phone number
    const phoneRegex = /^(\+972|0)?[2-9]\d{1,2}-?\d{7}$/;
    if (!phoneRegex.test(newGuest.phone.replace(/\s/g, ''))) {
      showError("אנא הכנס מספר טלפון תקין");
      return;
    }

    try {
      // Create updated guest data
      const updatedData = {
        fullName: newGuest.fullName.trim(),
        phone: newGuest.phone.trim(),
        adults: parseInt(newGuest.adults),
        kids: parseInt(newGuest.kids),
        relative: newGuest.relative,
        notes: newGuest.notes.trim()
      };

      // Update in database
      const updatedGuestDoc = await updateGuest(editingGuest.id, updatedData);
      
      // Update local state
      setGuests(prevGuests => 
        prevGuests.map(guest => 
          guest.id === editingGuest.id ? updatedGuestDoc : guest
        )
      );
      
      // Show success message
      showSuccess('המוזמן עודכן בהצלחה!');
      
      // Reset form and close modal
      setNewGuest({
        fullName: "",
        phone: "",
        adults: 1,
        kids: 0,
        relative: "צד אמא",
        notes: ""
      });
      setEditingGuest(null);
      setShowAddForm(false);
      
    } catch (error) {
      console.error('Error updating guest:', error);
      showError('שגיאה בעדכון המוזמן');
    }
  };

  const handleDeleteGuest = async (guestId) => {
    if (!currentEvent?.id) {
      showError('שגיאה במחיקת המוזמן');
      return;
    }

    const guest = guests.find(g => g.id === guestId);

    // Show confirmation dialog
    if (!window.confirm(`האם אתה בטוח שברצונך למחוק את "${guest?.fullName}"?`)) {
      return;
    }

    try {
      // Delete from database
      await deleteGuest(guestId);
      
      // Update local state
      setGuests(prevGuests => 
        prevGuests.filter(guest => guest.id !== guestId)
      );
      
      // Show success message
      showSuccess('המוזמן נמחק בהצלחה');
      
    } catch (error) {
      console.error('Error deleting guest:', error);
      showError('שגיאה במחיקת המוזמן');
    }
  };

  const handleCancelAdd = () => {
    setNewGuest({
      fullName: "",
      phone: "",
      adults: 1,
      kids: 0,
      relative: "צד אמא",
      notes: ""
    });
    setEditingGuest(null);
    setShowAddForm(false);
  };

  const handleInputChange = (field, value) => {
    setNewGuest(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle keyboard shortcuts for modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showAddForm) {
        handleCancelAdd();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAddForm]);

  const getWhatsAppLink = (phone) => {
    const cleanPhone = phone.replace(/[-\s]/g, '');
    const internationalPhone = cleanPhone.startsWith('0') ? '972' + cleanPhone.substring(1) : cleanPhone;
    return `https://wa.me/${internationalPhone}`;
  };

  return (
    <div className="guests-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <h1>
              <i className="fa-solid fa-users"></i>
              מוזמנים
            </h1>
            <p>נהל את רשימת המוזמנים שלך לאירוע</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            <i className="fa-solid fa-plus"></i>
            הוספת מוזמן
          </button>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card glass">
            <div className="card-icon total">
              <i className="fa-solid fa-users"></i>
            </div>
            <div className="card-info">
              <h3>סה"כ מוזמנים</h3>
              <p className="amount">{filteredGuests.length}</p>
            </div>
          </div>
          <div className="summary-card glass">
            <div className="card-icon confirmed">
              <i className="fa-solid fa-check-circle"></i>
            </div>
            <div className="card-info">
              <h3>מאשרים</h3>
              <p className="amount">{confirmedGuests}</p>
            </div>
          </div>
          <div className="summary-card glass">
            <div className="card-icon adults">
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="card-info">
              <h3>מבוגרים</h3>
              <p className="amount">{totalAdults}</p>
            </div>
          </div>
          <div className="summary-card glass">
            <div className="card-icon kids">
              <i className="fa-solid fa-child"></i>
            </div>
            <div className="card-info">
              <h3>ילדים</h3>
              <p className="amount">{totalKids}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="controls-section glass">
        <div className="filters">
          <div className="filter-group">
            <label>חיפוש</label>
            <div className="search-input">
              <i className="fa-solid fa-search"></i>
              <input
                type="text"
                placeholder="חיפוש לפי שם, טלפון או הערות..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-group">
            <label>קבוצה</label>
            <select value={filterRelative} onChange={(e) => setFilterRelative(e.target.value)}>
              {relatives.map(rel => (
                <option key={rel} value={rel}>{rel}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>סטטוס</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="view-controls">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
            >
              <i className="fa-solid fa-table"></i>
              טבלה
            </button>
            <button 
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <i className="fa-solid fa-th-large"></i>
              כרטיסים
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content-section">
        {viewMode === "table" ? (
          <div className="table-view glass">
            <div className="table-container">
              <table className="guests-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("fullName")}>
                      שם מלא
                      {sortBy === "fullName" && (
                        <i className={`fa-solid fa-chevron-${sortOrder === "asc" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th>פרטי קשר</th>
                    <th onClick={() => handleSort("adults")}>
                      מבוגרים
                      {sortBy === "adults" && (
                        <i className={`fa-solid fa-chevron-${sortOrder === "asc" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th onClick={() => handleSort("kids")}>
                      ילדים
                      {sortBy === "kids" && (
                        <i className={`fa-solid fa-chevron-${sortOrder === "asc" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th onClick={() => handleSort("relative")}>
                      קבוצה
                      {sortBy === "relative" && (
                        <i className={`fa-solid fa-chevron-${sortOrder === "asc" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th>סטטוס</th>
                    <th>הערות</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map(guest => (
                    <tr key={guest.id}>
                      <td>
                        <div className="guest-name">
                          <strong>{guest.fullName}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div className="contact-item">
                            <i className="fa-solid fa-phone"></i>
                            <a href={`tel:${guest.phone}`}>{guest.phone}</a>
                          </div>
                          <div className="contact-item">
                            <i className="fa-brands fa-whatsapp"></i>
                            <a href={getWhatsAppLink(guest.phone)} target="_blank" rel="noopener noreferrer">
                              WhatsApp
                            </a>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="count-badge adults-count">{guest.adults}</span>
                      </td>
                      <td>
                        <span className="count-badge kids-count">{guest.kids}</span>
                      </td>
                      <td>
                        <span className="relative-badge">{guest.relative}</span>
                      </td>
                      <td>
                        <div className="status-cell">
                          {editingStatus === guest.id ? (
                            <select 
                              value={guest.status} 
                              onChange={(e) => handleStatusChange(guest.id, e.target.value)}
                              onBlur={() => setEditingStatus(null)}
                              onKeyDown={(e) => e.key === 'Escape' && setEditingStatus(null)}
                              autoFocus
                              className="status-select"
                            >
                              <option value="מאשר">מאשר</option>
                              <option value="לא מגיע">לא מגיע</option>
                              <option value="לא החזיר תשובה">לא החזיר תשובה</option>
                            </select>
                          ) : (
                            <span 
                              className={`status-badge ${getStatusClass(guest.status)} clickable`}
                              onClick={() => handleStatusClick(guest.id)}
                            >
                              {guest.status}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="notes-cell" title={guest.notes}>
                          {guest.notes ? (
                            guest.notes.length > 30 ? 
                              guest.notes.substring(0, 30) + "..." : 
                              guest.notes
                          ) : "-"}
                        </div>
                      </td>
                      <td>
                        <div className="actions">
                          <button 
                            className="action-btn edit"
                            onClick={() => handleEditGuest(guest)}
                          >
                            <i className="fa-solid fa-edit"></i>
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDeleteGuest(guest.id)}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid-view">
            {filteredGuests.map(guest => (
              <div key={guest.id} className="guest-card glass">
                <div className="card-header">
                  <div className="guest-info">
                    <h3 className="guest-name">{guest.fullName}</h3>
                    <span className="relative-badge">{guest.relative}</span>
                  </div>
                  <div className="status-cell">
                    {editingStatus === guest.id ? (
                      <select 
                        value={guest.status} 
                        onChange={(e) => handleStatusChange(guest.id, e.target.value)}
                        onBlur={() => setEditingStatus(null)}
                        onKeyDown={(e) => e.key === 'Escape' && setEditingStatus(null)}
                        autoFocus
                        className="status-select"
                      >
                        <option value="מאשר">מאשר</option>
                        <option value="לא מגיע">לא מגיע</option>
                        <option value="לא החזיר תשובה">לא החזיר תשובה</option>
                      </select>
                    ) : (
                      <span 
                        className={`status-badge ${getStatusClass(guest.status)} clickable`}
                        onClick={() => handleStatusClick(guest.id)}
                      >
                        {guest.status}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="contact-section">
                    <div className="contact-item">
                      <i className="fa-solid fa-phone"></i>
                      <a href={`tel:${guest.phone}`}>{guest.phone}</a>
                    </div>
                    <div className="contact-item whatsapp-link">
                      <i className="fa-brands fa-whatsapp"></i>
                      <a href={getWhatsAppLink(guest.phone)} target="_blank" rel="noopener noreferrer">
                        WhatsApp
                      </a>
                    </div>
                  </div>
                  
                  <div className="counts-section">
                    <div className="count-item">
                      <div className="count-icon adults">
                        <i className="fa-solid fa-user"></i>
                      </div>
                      <div className="count-info">
                        <span className="count-label">מבוגרים</span>
                        <span className="count-value">{guest.adults}</span>
                      </div>
                    </div>
                    <div className="count-item">
                      <div className="count-icon kids">
                        <i className="fa-solid fa-child"></i>
                      </div>
                      <div className="count-info">
                        <span className="count-label">ילדים</span>
                        <span className="count-value">{guest.kids}</span>
                      </div>
                    </div>
                  </div>
                  
                  {guest.notes && (
                    <div className="notes-section">
                      <div className="notes-header">
                        <i className="fa-solid fa-sticky-note"></i>
                        <span>הערות</span>
                      </div>
                      <p className="notes-text">{guest.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="card-actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditGuest(guest)}
                  >
                    <i className="fa-solid fa-edit"></i>
                    עריכה
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteGuest(guest.id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                    מחיקה
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Guest Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={handleCancelAdd}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className={`fa-solid ${editingGuest ? 'fa-user-edit' : 'fa-user-plus'}`}></i>
                {editingGuest ? 'עריכת מוזמן' : 'הוספת מוזמן חדש'}
              </h2>
              <button className="modal-close" onClick={handleCancelAdd}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={editingGuest ? handleUpdateGuest : handleAddGuest} className="guest-form">
              <div className="form-group">
                <label htmlFor="guestName">
                  <i className="fa-solid fa-user"></i>
                  שם מלא *
                </label>
                <input
                  id="guestName"
                  type="text"
                  value={newGuest.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="לדוגמה: יוסי כהן"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="guestPhone">
                  <i className="fa-solid fa-phone"></i>
                  מספר טלפון *
                </label>
                <input
                  id="guestPhone"
                  type="tel"
                  value={newGuest.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="052-1234567"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="adultsCount">
                    <i className="fa-solid fa-user"></i>
                    מספר מבוגרים
                  </label>
                  <input
                    id="adultsCount"
                    type="number"
                    min="0"
                    value={newGuest.adults}
                    onChange={(e) => handleInputChange("adults", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="kidsCount">
                    <i className="fa-solid fa-child"></i>
                    מספר ילדים
                  </label>
                  <input
                    id="kidsCount"
                    type="number"
                    min="0"
                    value={newGuest.kids}
                    onChange={(e) => handleInputChange("kids", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="guestRelative">
                  <i className="fa-solid fa-users"></i>
                  קבוצה
                </label>
                <select
                  id="guestRelative"
                  value={newGuest.relative}
                  onChange={(e) => handleInputChange("relative", e.target.value)}
                >
                  <option value="צד אמא">צד אמא</option>
                  <option value="צד אבא">צד אבא</option>
                  <option value="חברים">חברים</option>
                  <option value="אחר">אחר</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="guestNotes">
                  <i className="fa-solid fa-sticky-note"></i>
                  הערות (אופציונלי)
                </label>
                <textarea
                  id="guestNotes"
                  value={newGuest.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="הערות מיוחדות, דרישות תזונתיות, נגישות וכו'"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <i className={`fa-solid ${editingGuest ? 'fa-save' : 'fa-user-plus'}`}></i>
                  {editingGuest ? 'עדכן מוזמן' : 'הוסף מוזמן'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancelAdd}>
                  <i className="fa-solid fa-times"></i>
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .guests-page {
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
          min-height: 100vh;
        }

        .page-header {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--space-md);
        }

        .header-info h1 {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin: 0 0 var(--space-xs) 0;
          font-size: 2rem;
          color: var(--text);
          font-weight: 700;
        }

        .header-info p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 1.1rem;
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

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-md);
        }

        .summary-card {
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .card-icon {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .card-icon.total {
          background: rgba(124, 92, 255, 0.2);
          color: var(--brand);
        }

        .card-icon.confirmed {
          background: rgba(30, 190, 126, 0.2);
          color: #1ebe7e;
        }

        .card-icon.adults {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .card-icon.kids {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .card-info h3 {
          margin: 0 0 var(--space-xs) 0;
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .card-info .amount {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
        }

        .controls-section {
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: var(--space-lg);
          flex-wrap: wrap;
        }

        .filters {
          display: flex;
          gap: var(--space-md);
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .filter-group label {
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .search-input {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input i {
          position: absolute;
          right: var(--space-sm);
          color: var(--text-secondary);
          pointer-events: none;
        }

        .search-input input,
        .filter-group select {
          padding: var(--space-sm) var(--space-md);
          padding-right: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
          font-size: 0.95rem;
          min-width: 180px;
        }

        .search-input input:focus,
        .filter-group select:focus {
          outline: none;
          border-color: var(--brand);
          box-shadow: 0 0 0 2px rgba(124, 92, 255, 0.3);
        }

        .view-controls {
          display: flex;
          gap: var(--space-sm);
        }

        .view-toggle {
          display: flex;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .view-btn {
          padding: var(--space-sm) var(--space-md);
          border: none;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition);
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .view-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text);
        }

        .view-btn.active {
          background: var(--brand);
          color: white;
        }

        .content-section {
          flex: 1;
        }

        .table-view {
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
        }

        .table-container {
          overflow-x: auto;
        }

        .guests-table {
          width: 100%;
          border-collapse: collapse;
        }

        .guests-table th,
        .guests-table td {
          padding: var(--space-md);
          text-align: right;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .guests-table th {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          user-select: none;
        }

        .guests-table th:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text);
        }

        .guests-table th i {
          margin-right: var(--space-xs);
        }

        .guests-table td {
          color: var(--text);
        }

        .guest-name strong {
          display: block;
          margin-bottom: var(--space-xs);
        }

        .contact-info {
          font-size: 0.85rem;
        }

        .contact-item {
          margin-bottom: var(--space-xs);
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .contact-item i {
          width: 12px;
          color: var(--text-secondary);
        }

        .contact-item a {
          color: var(--brand);
          text-decoration: none;
        }

        .contact-item a:hover {
          text-decoration: underline;
        }

        .contact-item.whatsapp-link a {
          color: #25d366;
        }

        .count-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .count-badge.adults-count {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .count-badge.kids-count {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .relative-badge {
          display: inline-flex;
          align-items: center;
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 500;
          background: rgba(156, 163, 175, 0.2);
          color: #9ca3af;
          border: 1px solid rgba(156, 163, 175, 0.4);
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

        .status-badge.status-confirmed {
          background: rgba(30, 190, 126, 0.2);
          color: #1ebe7e;
          border-color: rgba(30, 190, 126, 0.4);
        }

        .status-badge.status-declined {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.4);
        }

        .status-badge.status-no-response {
          background: rgba(156, 163, 175, 0.2);
          color: #9ca3af;
          border-color: rgba(156, 163, 175, 0.4);
        }

        .status-badge.clickable {
          cursor: pointer;
          transition: all var(--transition);
        }

        .status-badge.clickable:hover {
          opacity: 0.8;
          transform: scale(1.05);
        }

        .status-cell {
          position: relative;
        }

        .status-select {
          padding: var(--space-xs) var(--space-sm);
          border: 1px solid var(--brand);
          border-radius: var(--radius-sm);
          background: var(--text-light);
          color: var(--text);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          min-width: 120px;
        }

        .status-select:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(124, 92, 255, 0.3);
        }

        .notes-cell {
          max-width: 200px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          cursor: help;
        }

        .actions {
          display: flex;
          gap: var(--space-xs);
        }

        .action-btn {
          padding: var(--space-xs);
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
        }

        .action-btn.edit {
          background: rgba(124, 92, 255, 0.2);
          color: var(--brand);
        }

        .action-btn.edit:hover {
          background: rgba(124, 92, 255, 0.3);
        }

        .action-btn.delete {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .action-btn.delete:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        .grid-view {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: var(--space-lg);
        }

        .guest-card {
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .guest-card .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .guest-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .guest-card .guest-name {
          margin: 0;
          font-size: 1.3rem;
          color: var(--text);
          font-weight: 600;
        }

        .guest-card .card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .contact-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .guest-card .contact-item {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .guest-card .contact-item i {
          width: 14px;
          color: var(--text-secondary);
        }

        .guest-card .contact-item a {
          color: var(--brand);
          text-decoration: none;
        }

        .guest-card .contact-item a:hover {
          text-decoration: underline;
        }

        .guest-card .contact-item.whatsapp-link a {
          color: #25d366;
        }

        .counts-section {
          display: flex;
          gap: var(--space-md);
        }

        .count-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          flex: 1;
        }

        .count-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .count-icon.adults {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .count-icon.kids {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .count-info {
          display: flex;
          flex-direction: column;
        }

        .count-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .count-value {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text);
        }

        .notes-section {
          padding: var(--space-sm);
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .notes-header {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          margin-bottom: var(--space-xs);
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .notes-text {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .card-actions {
          display: flex;
          gap: var(--space-sm);
          padding-top: var(--space-md);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .card-actions .action-btn {
          flex: 1;
          width: auto;
          height: auto;
          padding: var(--space-sm) var(--space-md);
          gap: var(--space-xs);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--space-md);
        }

        .modal-content {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-lg);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .modal-close {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.2rem;
          cursor: pointer;
          padding: var(--space-xs);
          border-radius: var(--radius-sm);
          transition: all var(--transition);
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text);
        }

        .guest-form {
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
        }

        .form-group label {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .form-group label i {
          width: 16px;
          color: var(--brand);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: var(--space-sm) var(--space-md);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
          font-size: 1rem;
          transition: all var(--transition);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--brand);
          box-shadow: 0 0 0 2px rgba(124, 92, 255, 0.3);
          background: rgba(255, 255, 255, 0.08);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: var(--text-secondary);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-actions {
          display: flex;
          gap: var(--space-md);
          padding-top: var(--space-md);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .form-actions .btn {
          flex: 1;
          justify-content: center;
        }

        .btn-secondary {
          background: rgba(156, 163, 175, 0.2);
          color: #9ca3af;
          border: 1px solid rgba(156, 163, 175, 0.4);
        }

        .btn-secondary:hover {
          background: rgba(156, 163, 175, 0.3);
          color: var(--text);
          transform: translateY(-1px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .guests-page {
            padding: var(--space-md);
          }

          .header-content {
            flex-direction: column;
            align-items: stretch;
          }

          .controls-section {
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-md);
          }

          .filters {
            flex-direction: column;
          }

          .view-controls {
            align-self: stretch;
          }

          .view-toggle {
            width: 100%;
          }

          .view-btn {
            flex: 1;
            justify-content: center;
          }

          .grid-view {
            grid-template-columns: 1fr;
          }

          .table-container {
            font-size: 0.9rem;
          }

          .guests-table th,
          .guests-table td {
            padding: var(--space-sm);
          }

          .counts-section {
            flex-direction: column;
            gap: var(--space-sm);
          }
        }

        @media (max-width: 480px) {
          .summary-cards {
            grid-template-columns: repeat(2, 1fr);
          }

          .header-info h1 {
            font-size: 1.5rem;
          }

          .card-info .amount {
            font-size: 1.2rem;
          }

          .guest-card .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-sm);
          }

          .modal-overlay {
            padding: var(--space-sm);
          }

          .modal-content {
            max-height: 95vh;
          }

          .modal-header {
            padding: var(--space-md);
          }

          .guest-form {
            padding: var(--space-md);
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: var(--space-sm);
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
