import React, { useState, useEffect } from "react";
import { useEventCheck } from "../hooks/useEventCheck";
import { useEventSubcollections } from "../hooks/useEventSubcollections";
import { useToast } from "../components/Toast/Toast";

const categories = ["הכל", "מקום", "צילום", "קייטרינג", "פרחים", "בידור", "אופנה", "אחר"];
const statuses = ["הכל", "מאושר", "בהמתנה", "בבדיקה", "נדחה"];

export default function VendorsPage() {
  const { currentEvent } = useEventCheck();
  const { getItems, addItem, updateItem, deleteItem } = useEventSubcollections(currentEvent?.id);
  const { showSuccess, showInfo, showError } = useToast();

  const [vendors, setVendors] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // "table" or "grid"
  const [filterCategory, setFilterCategory] = useState("הכל");
  const [filterStatus, setFilterStatus] = useState("הכל");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [newVendor, setNewVendor] = useState({
    name: "",
    category: "מקום",
    phone: "",
    email: "",
    address: "",
    status: "בהמתנה"
  });

  // Load vendors when component mounts or currentEvent changes
  useEffect(() => {
    const loadVendors = async () => {
      if (!currentEvent?.id) {
        setVendors([]);
        return;
      }

      try {
        const vendorsData = await getItems('vendors');
        setVendors(vendorsData);
      } catch (error) {
        console.error('Error loading vendors:', error);
        // Silent error - don't show to user, just keep empty state
      }
    };

    loadVendors();
  }, [currentEvent?.id, getItems]);

  // Filter and sort vendors
  const filteredVendors = vendors
    .filter(vendor => {
      const matchesCategory = filterCategory === "הכל" || vendor.category === filterCategory;
      const matchesStatus = filterStatus === "הכל" || vendor.status === filterStatus;
      const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vendor.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesStatus && matchesSearch;
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

  const approvedVendors = filteredVendors.filter(v => v.status === "מאושר").length;
  const pendingVendors = filteredVendors.filter(v => v.status === "בהמתנה").length;

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
      case "מאושר": return "status-approved";
      case "בהמתנה": return "status-pending";
      case "בבדיקה": return "status-review";
      case "נדחה": return "status-rejected";
      default: return "";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "מקום": return "fa-building";
      case "צילום": return "fa-camera";
      case "קייטרינג": return "fa-utensils";
      case "פרחים": return "fa-seedling";
      case "בידור": return "fa-music";
      case "אופנה": return "fa-shirt";
      default: return "fa-store";
    }
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    
    if (!currentEvent?.id) {
      showError('אין אירוע פעיל');
      return;
    }

    // Basic validation
    if (!newVendor.name.trim() || !newVendor.phone.trim() || !newVendor.email.trim()) {
      showError("אנא מלא את כל השדות הנדרשים");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newVendor.email)) {
      showError("אנא הכנס כתובת אימייל תקינה");
      return;
    }

    try {
      // Create new vendor object
      const vendorData = {
        name: newVendor.name.trim(),
        category: newVendor.category,
        phone: newVendor.phone.trim(),
        email: newVendor.email.trim(),
        address: newVendor.address.trim() || "",
        status: newVendor.status || "בהמתנה"
      };

      const addedVendor = await addItem('vendors', vendorData);
      
      // Add to local state
      setVendors(prevVendors => [...prevVendors, addedVendor]);
      
      // Reset form and close modal
      setNewVendor({
        name: "",
        category: "מקום",
        phone: "",
        email: "",
        address: "",
        status: "בהמתנה"
      });
      setShowAddForm(false);
      showSuccess('הספק נוסף בהצלחה!');
    } catch (error) {
      console.error('Error adding vendor:', error);
      showError('שגיאה בהוספת ספק');
    }
  };

  const handleEditVendor = (vendor) => {
    setEditingVendor(vendor);
    setNewVendor({
      name: vendor.name || "",
      category: vendor.category || "מקום",
      phone: vendor.phone || "",
      email: vendor.email || "",
      address: vendor.address || "",
      status: vendor.status || "בהמתנה"
    });
    setShowAddForm(true);
  };

  const handleUpdateVendor = async (e) => {
    e.preventDefault();
    
    if (!currentEvent?.id) {
      showError('אין אירוע פעיל');
      return;
    }

    if (!editingVendor?.id) {
      showError('שגיאה בעדכון ספק');
      return;
    }

    // Basic validation
    if (!newVendor.name.trim() || !newVendor.phone.trim() || !newVendor.email.trim()) {
      showError("אנא מלא את כל השדות הנדרשים");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newVendor.email)) {
      showError("אנא הכנס כתובת אימייל תקינה");
      return;
    }

    try {
      const updatedData = {
        name: newVendor.name.trim(),
        category: newVendor.category,
        phone: newVendor.phone.trim(),
        email: newVendor.email.trim(),
        address: newVendor.address.trim() || "",
        status: newVendor.status
      };

      await updateItem('vendors', editingVendor.id, updatedData);
      
      // Update local state
      setVendors(prevVendors =>
        prevVendors.map(v =>
          v.id === editingVendor.id ? { ...v, ...updatedData } : v
        )
      );
      
      // Reset form and close modal
      setNewVendor({
        name: "",
        category: "מקום",
        phone: "",
        email: "",
        address: "",
        status: "בהמתנה"
      });
      setEditingVendor(null);
      setShowAddForm(false);
      showSuccess('הספק עודכן בהצלחה!');
    } catch (error) {
      console.error('Error updating vendor:', error);
      showError('שגיאה בעדכון ספק');
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    if (!currentEvent?.id) {
      showError('אין אירוע פעיל');
      return;
    }

    if (!window.confirm('האם אתה בטוח שברצונך למחוק ספק זה?')) {
      return;
    }

    try {
      await deleteItem('vendors', vendorId);
      
      // Remove from local state
      setVendors(prevVendors => prevVendors.filter(v => v.id !== vendorId));
      
      showInfo('הספק נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting vendor:', error);
      showError('שגיאה במחיקת ספק');
    }
  };

  const handleStatusChange = async (vendorId, newStatus) => {
    if (!currentEvent?.id) {
      showError('אין אירוע פעיל');
      return;
    }

    try {
      await updateItem('vendors', vendorId, { status: newStatus });
      
      // Update local state
      setVendors(prevVendors =>
        prevVendors.map(v =>
          v.id === vendorId ? { ...v, status: newStatus } : v
        )
      );
      
      showSuccess('סטטוס הספק עודכן');
    } catch (error) {
      console.error('Error updating vendor status:', error);
      showError('שגיאה בעדכון סטטוס');
    }
  };

  const handleCancelAdd = () => {
    setNewVendor({
      name: "",
      category: "מקום",
      phone: "",
      email: "",
      address: "",
      status: "בהמתנה"
    });
    setEditingVendor(null);
    setShowAddForm(false);
  };

  const handleInputChange = (field, value) => {
    setNewVendor(prev => ({
      ...prev,
      [field]: value
    }));
  };



  return (
    <div className="vendors-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <h1>
              <i className="fa-solid fa-truck-fast"></i>
              ספקים
            </h1>
            <p>נהל את כל הספקים שלך במקום אחד</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            <i className="fa-solid fa-plus"></i>
            הוספת ספק
          </button>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card glass">
            <div className="card-icon total">
              <i className="fa-solid fa-users"></i>
            </div>
            <div className="card-info">
              <h3>סה"כ ספקים</h3>
              <p className="amount">{filteredVendors.length}</p>
            </div>
          </div>
          <div className="summary-card glass">
            <div className="card-icon approved">
              <i className="fa-solid fa-check-circle"></i>
            </div>
            <div className="card-info">
              <h3>מאושרים</h3>
              <p className="amount">{approvedVendors}</p>
            </div>
          </div>
          <div className="summary-card glass">
            <div className="card-icon pending">
              <i className="fa-solid fa-clock"></i>
            </div>
            <div className="card-info">
              <h3>בהמתנה</h3>
              <p className="amount">{pendingVendors}</p>
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
                placeholder="חיפוש לפי שם או קטגוריה..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-group">
            <label>קטגוריה</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
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
        {filteredVendors.length === 0 ? (
          <div className="empty-state glass">
            <div className="empty-icon">
              <i className="fa-solid fa-truck-fast"></i>
            </div>
            <h3>אין ספקים</h3>
            <p>התחל בהוספת ספקים כדי לנהל את הספקים שלך לאירוע</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              <i className="fa-solid fa-plus"></i>
              הוסף ספק ראשון
            </button>
          </div>
        ) : viewMode === "table" ? (
          <div className="table-view glass">
            <div className="table-container">
              <table className="vendors-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("name")}>
                      שם הספק
                      {sortBy === "name" && (
                        <i className={`fa-solid fa-chevron-${sortOrder === "asc" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th onClick={() => handleSort("category")}>
                      קטגוריה
                      {sortBy === "category" && (
                        <i className={`fa-solid fa-chevron-${sortOrder === "asc" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th>פרטי קשר</th>
                    <th>סטטוס</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map(vendor => (
                    <tr key={vendor.id}>
                      <td>
                        <div className="vendor-name">
                          <strong>{vendor.name}</strong>
                          <small>{vendor.address}</small>
                        </div>
                      </td>
                      <td>
                        <div className="category-cell">
                          <i className={`fa-solid ${getCategoryIcon(vendor.category)}`}></i>
                          {vendor.category}
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div><i className="fa-solid fa-phone"></i> {vendor.phone}</div>
                          <div><i className="fa-solid fa-envelope"></i> {vendor.email}</div>
                        </div>
                      </td>
                      <td>
                        <select
                          value={vendor.status}
                          onChange={(e) => handleStatusChange(vendor.id, e.target.value)}
                          className={`status-select ${getStatusClass(vendor.status)}`}
                        >
                          <option value="מאושר">מאושר</option>
                          <option value="בהמתנה">בהמתנה</option>
                          <option value="בבדיקה">בבדיקה</option>
                          <option value="נדחה">נדחה</option>
                        </select>
                      </td>
                      <td>
                        <div className="actions">
                          <button 
                            className="action-btn edit"
                            onClick={() => handleEditVendor(vendor)}
                          >
                            <i className="fa-solid fa-edit"></i>
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDeleteVendor(vendor.id)}
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
            {filteredVendors.map(vendor => (
              <div key={vendor.id} className="vendor-card glass">
                <div className="card-header">
                  <div className="category-info">
                    <i className={`fa-solid ${getCategoryIcon(vendor.category)}`}></i>
                    <span className="category">{vendor.category}</span>
                  </div>
                  <select
                    value={vendor.status}
                    onChange={(e) => handleStatusChange(vendor.id, e.target.value)}
                    className={`status-select ${getStatusClass(vendor.status)}`}
                  >
                    <option value="מאושר">מאושר</option>
                    <option value="בהמתנה">בהמתנה</option>
                    <option value="בבדיקה">בבדיקה</option>
                    <option value="נדחה">נדחה</option>
                  </select>
                </div>
                <div className="card-body">
                  <h3 className="vendor-name">{vendor.name}</h3>
                  <div className="contact">
                    <div className="contact-item">
                      <i className="fa-solid fa-phone"></i>
                      <a href={`tel:${vendor.phone}`}>{vendor.phone}</a>
                    </div>
                    <div className="contact-item">
                      <i className="fa-solid fa-envelope"></i>
                      <a href={`mailto:${vendor.email}`}>{vendor.email}</a>
                    </div>
                  </div>
                </div>
                <div className="card-actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditVendor(vendor)}
                  >
                    <i className="fa-solid fa-edit"></i>
                    עריכה
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteVendor(vendor.id)}
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

      {/* Add Vendor Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={handleCancelAdd}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className={`fa-solid ${editingVendor ? 'fa-edit' : 'fa-plus'}`}></i>
                {editingVendor ? 'עריכת ספק' : 'הוספת ספק חדש'}
              </h2>
              <button className="modal-close" onClick={handleCancelAdd}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={editingVendor ? handleUpdateVendor : handleAddVendor} className="vendor-form">
              <div className="form-group">
                <label htmlFor="vendorName">
                  <i className="fa-solid fa-store"></i>
                  שם הספק *
                </label>
                <input
                  id="vendorName"
                  type="text"
                  value={newVendor.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="לדוגמה: אולם אגדות"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="vendorCategory">
                    <i className="fa-solid fa-tag"></i>
                    קטגוריה
                  </label>
                  <select
                    id="vendorCategory"
                    value={newVendor.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                  >
                    <option value="מקום">מקום</option>
                    <option value="צילום">צילום</option>
                    <option value="קייטרינג">קייטרינג</option>
                    <option value="פרחים">פרחים</option>
                    <option value="בידור">בידור</option>
                    <option value="אופנה">אופנה</option>
                    <option value="אחר">אחר</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="vendorPhone">
                    <i className="fa-solid fa-phone"></i>
                    מספר טלפון *
                  </label>
                  <input
                    id="vendorPhone"
                    type="tel"
                    value={newVendor.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="03-1234567"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="vendorEmail">
                  <i className="fa-solid fa-envelope"></i>
                  כתובת אימייל *
                </label>
                <input
                  id="vendorEmail"
                  type="email"
                  value={newVendor.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="info@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="vendorAddress">
                  <i className="fa-solid fa-location-dot"></i>
                  כתובת (אופציונלי)
                </label>
                <textarea
                  id="vendorAddress"
                  value={newVendor.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="כתובת הספק..."
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="vendorStatus">
                  <i className="fa-solid fa-info-circle"></i>
                  סטטוס
                </label>
                <select
                  id="vendorStatus"
                  value={newVendor.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                >
                  <option value="מאושר">מאושר</option>
                  <option value="בהמתנה">בהמתנה</option>
                  <option value="בבדיקה">בבדיקה</option>
                  <option value="נדחה">נדחה</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <i className={`fa-solid ${editingVendor ? 'fa-save' : 'fa-plus'}`}></i>
                  {editingVendor ? 'עדכן ספק' : 'הוסף ספק'}
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
        .vendors-page {
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

        .card-icon.approved {
          background: rgba(30, 190, 126, 0.2);
          color: #1ebe7e;
        }

        .card-icon.pending {
          background: rgba(241, 180, 76, 0.2);
          color: #f1b44c;
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

        .vendors-table {
          width: 100%;
          border-collapse: collapse;
        }

        .vendors-table th,
        .vendors-table td {
          padding: var(--space-md);
          text-align: right;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .vendors-table th {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          user-select: none;
        }

        .vendors-table th:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text);
        }

        .vendors-table th i {
          margin-right: var(--space-xs);
        }

        .vendors-table td {
          color: var(--text);
        }

        .vendor-name strong {
          display: block;
          margin-bottom: var(--space-xs);
        }

        .vendor-name small {
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .category-cell {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .contact-info {
          font-size: 0.85rem;
        }

        .contact-info div {
          margin-bottom: var(--space-xs);
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .contact-info i {
          width: 12px;
          color: var(--text-secondary);
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

        .status-badge.status-approved {
          background: rgba(30, 190, 126, 0.2);
          color: #1ebe7e;
          border-color: rgba(30, 190, 126, 0.4);
        }

        .status-badge.status-pending {
          background: rgba(241, 180, 76, 0.2);
          color: #f1b44c;
          border-color: rgba(241, 180, 76, 0.4);
        }

        .status-badge.status-review {
          background: rgba(124, 92, 255, 0.2);
          color: var(--brand);
          border-color: rgba(124, 92, 255, 0.4);
        }

        .status-badge.status-rejected {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.4);
        }

        .status-select {
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 500;
          border: 1px solid;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
          cursor: pointer;
          transition: all var(--transition);
        }

        .status-select.status-approved {
          background: rgba(30, 190, 126, 0.2);
          color: #1ebe7e;
          border-color: rgba(30, 190, 126, 0.4);
        }

        .status-select.status-pending {
          background: rgba(241, 180, 76, 0.2);
          color: #f1b44c;
          border-color: rgba(241, 180, 76, 0.4);
        }

        .status-select.status-review {
          background: rgba(124, 92, 255, 0.2);
          color: var(--brand);
          border-color: rgba(124, 92, 255, 0.4);
        }

        .status-select.status-rejected {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.4);
        }

        .status-select:hover {
          opacity: 0.8;
        }

        .status-select:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(124, 92, 255, 0.3);
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

        .vendor-card {
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .vendor-card .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .category-info {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .vendor-card .card-body {
          flex: 1;
        }

        .vendor-card .vendor-name {
          margin: 0 0 var(--space-sm) 0;
          font-size: 1.3rem;
          color: var(--text);
          font-weight: 600;
        }

        .contact {
          margin-bottom: var(--space-md);
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          margin-bottom: var(--space-xs);
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .contact-item i {
          width: 14px;
          color: var(--text-secondary);
        }

        .contact-item a {
          color: var(--brand);
          text-decoration: none;
        }

        .contact-item a:hover {
          text-decoration: underline;
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

        /* Empty State */
        .empty-state {
          padding: var(--space-xl);
          border-radius: var(--radius-lg);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .empty-icon {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(124, 92, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-lg);
        }

        .empty-icon i {
          font-size: 3rem;
          color: var(--brand);
        }

        .empty-state h3 {
          margin: 0 0 var(--space-sm) 0;
          font-size: 1.5rem;
          color: var(--text);
        }

        .empty-state p {
          margin: 0 0 var(--space-lg) 0;
          color: var(--text-secondary);
          font-size: 1.1rem;
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

        .vendor-form {
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
          min-height: 60px;
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
          .vendors-page {
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

          .vendors-table th,
          .vendors-table td {
            padding: var(--space-sm);
          }
        }

        @media (max-width: 480px) {
          .summary-cards {
            grid-template-columns: 1fr;
          }

          .header-info h1 {
            font-size: 1.5rem;
          }

          .card-info .amount {
            font-size: 1.2rem;
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

          .vendor-form {
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
