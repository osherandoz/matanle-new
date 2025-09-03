import React, { useState } from "react";

// Mock expense data
const mockExpenses = [
  {
    id: 1,
    category: "מקום",
    description: "אולם אגדות - מקדמה",
    amount: 15000,
    date: "2024-01-15",
    status: "שולם",
    vendor: "אולם אגדות",
    paymentMethod: "העברה בנקאית"
  },
  {
    id: 2,
    category: "צילום",
    description: "צלם לחתונה",
    amount: 8500,
    date: "2024-01-20",
    status: "בהמתנה",
    vendor: "סטודיו אור",
    paymentMethod: "צ'ק"
  },
  {
    id: 3,
    category: "קייטרינג",
    description: "ארוחת ערב - מקדמה",
    amount: 12000,
    date: "2024-02-01",
    status: "שולם",
    vendor: "שף דני",
    paymentMethod: "מזומן"
  },
  {
    id: 4,
    category: "פרחים",
    description: "זרי פרחים ועיטורים",
    amount: 3500,
    date: "2024-02-10",
    status: "בהמתנה",
    vendor: "פרחי שרון",
    paymentMethod: "אשראי"
  },
  {
    id: 5,
    category: "בידור",
    description: "DJ ומערכת קול",
    amount: 4500,
    date: "2024-02-15",
    status: "שולם",
    vendor: "מוזיקה בראש",
    paymentMethod: "העברה בנקאית"
  },
  {
    id: 6,
    category: "שמלה",
    description: "שמלת כלה",
    amount: 6000,
    date: "2024-01-30",
    status: "שולם",
    vendor: "בוטיק הכלה",
    paymentMethod: "אשראי"
  }
];

const categories = ["הכל", "מקום", "צילום", "קייטרינג", "פרחים", "בידור", "שמלה", "אחר"];
const statuses = ["הכל", "שולם", "בהמתנה", "בוטל"];

export default function ExpenseTrackingPage() {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [filterCategory, setFilterCategory] = useState("הכל");
  const [filterStatus, setFilterStatus] = useState("הכל");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter and sort expenses
  const filteredExpenses = expenses
    .filter(expense => {
      const matchesCategory = filterCategory === "הכל" || expense.category === filterCategory;
      const matchesStatus = filterStatus === "הכל" || expense.status === filterStatus;
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.vendor.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === "amount") {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortBy === "date") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = filteredExpenses.filter(e => e.status === "שולם").reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = filteredExpenses.filter(e => e.status === "בהמתנה").reduce((sum, expense) => sum + expense.amount, 0);

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
      case "שולם": return "status-paid";
      case "בהמתנה": return "status-pending";
      case "בוטל": return "status-cancelled";
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
      case "שמלה": return "fa-shirt";
      default: return "fa-receipt";
    }
  };

  return (
    <div className="expense-tracking-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <h1>
              <i className="fa-solid fa-chart-line"></i>
              מעקב הוצאות
            </h1>
            <p>נהל ועקוב אחר כל ההוצאות של האירוע שלך</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            <i className="fa-solid fa-plus"></i>
            הוספת הוצאה
          </button>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card glass">
            <div className="card-icon total">
              <i className="fa-solid fa-calculator"></i>
            </div>
            <div className="card-info">
              <h3>סה"כ הוצאות</h3>
              <p className="amount">₪{totalExpenses.toLocaleString()}</p>
            </div>
          </div>
          <div className="summary-card glass">
            <div className="card-icon paid">
              <i className="fa-solid fa-check-circle"></i>
            </div>
            <div className="card-info">
              <h3>שולם</h3>
              <p className="amount">₪{paidExpenses.toLocaleString()}</p>
            </div>
          </div>
          <div className="summary-card glass">
            <div className="card-icon pending">
              <i className="fa-solid fa-clock"></i>
            </div>
            <div className="card-info">
              <h3>בהמתנה</h3>
              <p className="amount">₪{pendingExpenses.toLocaleString()}</p>
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
                placeholder="חיפוש לפי תיאור או ספק..."
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
              <table className="expenses-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("category")}>
                      קטגוריה
                      {sortBy === "category" && (
                        <i className={`fa-solid fa-chevron-${sortOrder === "asc" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th onClick={() => handleSort("description")}>
                      תיאור
                      {sortBy === "description" && (
                        <i className={`fa-solid fa-chevron-${sortOrder === "asc" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th onClick={() => handleSort("vendor")}>
                      ספק
                      {sortBy === "vendor" && (
                        <i className={`fa-solid fa-chevron-${sortOrder === "asc" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th onClick={() => handleSort("amount")}>
                      סכום
                      {sortBy === "amount" && (
                        <i className={`fa-solid fa-chevron-${sortOrder === "asc" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th onClick={() => handleSort("date")}>
                      תאריך
                      {sortBy === "date" && (
                        <i className={`fa-solid fa-chevron-${sortOrder === "asc" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th>סטטוס</th>
                    <th>אמצעי תשלום</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map(expense => (
                    <tr key={expense.id}>
                      <td>
                        <div className="category-cell">
                          <i className={`fa-solid ${getCategoryIcon(expense.category)}`}></i>
                          {expense.category}
                        </div>
                      </td>
                      <td>{expense.description}</td>
                      <td>{expense.vendor}</td>
                      <td className="amount-cell">₪{expense.amount.toLocaleString()}</td>
                      <td>{new Date(expense.date).toLocaleDateString('he-IL')}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(expense.status)}`}>
                          {expense.status}
                        </span>
                      </td>
                      <td>{expense.paymentMethod}</td>
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
            {filteredExpenses.map(expense => (
              <div key={expense.id} className="expense-card glass">
                <div className="card-header">
                  <div className="category-info">
                    <i className={`fa-solid ${getCategoryIcon(expense.category)}`}></i>
                    <span className="category">{expense.category}</span>
                  </div>
                  <span className={`status-badge ${getStatusClass(expense.status)}`}>
                    {expense.status}
                  </span>
                </div>
                <div className="card-body">
                  <h3 className="description">{expense.description}</h3>
                  <p className="vendor">
                    <i className="fa-solid fa-store"></i>
                    {expense.vendor}
                  </p>
                  <div className="amount">₪{expense.amount.toLocaleString()}</div>
                  <div className="details">
                    <div className="detail">
                      <i className="fa-solid fa-calendar"></i>
                      {new Date(expense.date).toLocaleDateString('he-IL')}
                    </div>
                    <div className="detail">
                      <i className="fa-solid fa-credit-card"></i>
                      {expense.paymentMethod}
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
        .expense-tracking-page {
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

        .card-icon.paid {
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

        .expenses-table {
          width: 100%;
          border-collapse: collapse;
        }

        .expenses-table th,
        .expenses-table td {
          padding: var(--space-md);
          text-align: right;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .expenses-table th {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          user-select: none;
          position: relative;
        }

        .expenses-table th:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text);
        }

        .expenses-table th i {
          margin-right: var(--space-xs);
        }

        .expenses-table td {
          color: var(--text);
        }

        .category-cell {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .amount-cell {
          font-weight: 600;
          color: var(--brand);
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

        .status-badge.status-paid {
          background: rgba(30, 190, 126, 0.2);
          color: #1ebe7e;
          border-color: rgba(30, 190, 126, 0.4);
        }

        .status-badge.status-pending {
          background: rgba(241, 180, 76, 0.2);
          color: #f1b44c;
          border-color: rgba(241, 180, 76, 0.4);
        }

        .status-badge.status-cancelled {
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
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-lg);
        }

        .expense-card {
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .expense-card .card-header {
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

        .expense-card .card-body {
          flex: 1;
        }

        .expense-card .description {
          margin: 0 0 var(--space-sm) 0;
          font-size: 1.2rem;
          color: var(--text);
          font-weight: 600;
        }

        .expense-card .vendor {
          margin: 0 0 var(--space-md) 0;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .expense-card .amount {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--brand);
          margin-bottom: var(--space-md);
        }

        .details {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .detail {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--text-secondary);
          font-size: 0.9rem;
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
          .expense-tracking-page {
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

          .expenses-table th,
          .expenses-table td {
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
