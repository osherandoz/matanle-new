import React, { useState } from "react";

// Mock vendor data
const mockVendors = [
  {
    id: 1,
    name: "אולם אגדות",
    category: "מקום",
    phone: "03-1234567",
    email: "info@agadot-hall.co.il",
    status: "מאושר"
  },
  {
    id: 2,
    name: "סטודיו אור",
    category: "צילום",
    phone: "052-9876543",
    email: "contact@studio-or.com",
    status: "מאושר"
  },
  {
    id: 3,
    name: "שף דני",
    category: "קייטרינג",
    phone: "054-5555555",
    email: "danny@chef-danny.co.il",
    status: "בהמתנה"
  },
  {
    id: 4,
    name: "פרחי שרון",
    category: "פרחים",
    phone: "09-8887777",
    email: "sharon@flowers.co.il",
    status: "מאושר"
  },
  {
    id: 5,
    name: "מוזיקה בראש",
    category: "בידור",
    phone: "050-1111111",
    email: "info@music-head.com",
    status: "מאושר"
  },
  {
    id: 6,
    name: "בוטיק הכלה",
    category: "אופנה",
    phone: "03-6666666",
    email: "boutique@bride.co.il",
    status: "בבדיקה"
  }
];

const categories = ["הכל", "מקום", "צילום", "קייטרינג", "פרחים", "בידור", "אופנה", "אחר"];
const statuses = ["הכל", "מאושר", "בהמתנה", "בבדיקה", "נדחה"];

export default function VendorsPage() {
  const [vendors, setVendors] = useState(mockVendors);
  const [viewMode, setViewMode] = useState("grid"); // "table" or "grid"
  const [filterCategory, setFilterCategory] = useState("הכל");
  const [filterStatus, setFilterStatus] = useState("הכל");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

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
        {viewMode === "table" ? (
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
                        <span className={`status-badge ${getStatusClass(vendor.status)}`}>
                          {vendor.status}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button className="action-btn edit">
                            <i className="fa-solid fa-edit"></i>
                          </button>
                          <button className="action-btn delete">
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
                  <span className={`status-badge ${getStatusClass(vendor.status)}`}>
                    {vendor.status}
                  </span>
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
                  <button className="action-btn edit">
                    <i className="fa-solid fa-edit"></i>
                    עריכה
                  </button>
                  <button className="action-btn delete">
                    <i className="fa-solid fa-trash"></i>
                    מחיקה
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
        }
      `}</style>
    </div>
  );
}
