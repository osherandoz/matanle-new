import React, { useState, useEffect } from "react";
import { useEventCheck } from "../hooks/useEventCheck";
import { useEventSubcollections } from "../hooks/useEventSubcollections";
import { useToast } from "../components/Toast/Toast";

// No mock data - expenses will start empty

const categories = ["הכל", "מקום", "צילום", "קייטרינג", "פרחים", "בידור", "שמלה", "אחר"];
const statuses = ["הכל", "שולם", "בהמתנה", "בוטל"];

export default function ExpenseTrackingPage() {
  const { currentEvent } = useEventCheck();
  const { getExpenses, addExpense, updateExpense, deleteExpense } = useEventSubcollections(currentEvent?.id);
  const { showError, showSuccess } = useToast();

  const [expenses, setExpenses] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [filterCategory, setFilterCategory] = useState("הכל");
  const [filterStatus, setFilterStatus] = useState("הכל");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [newExpense, setNewExpense] = useState({
    category: "מקום",
    description: "",
    vendor: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    paymentMethod: "אשראי"
  });

  // Load expenses when component mounts or currentEvent changes
  useEffect(() => {
    const loadExpenses = async () => {
      if (!currentEvent?.id) {
        setExpenses([]);
        return;
      }

      try {
        const expensesData = await getExpenses();
        setExpenses(expensesData);
      } catch (error) {
        console.error('Error loading expenses:', error);
        // Silent error - don't show to user, just keep empty state
      }
    };

    loadExpenses();
  }, [currentEvent?.id, getExpenses]);

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

  const handleAddExpense = async (e) => {
    e.preventDefault();
    
    if (!currentEvent?.id) {
      showError('אין אירוע פעיל');
      return;
    }
    
    // Basic validation
    if (!newExpense.description.trim() || !newExpense.vendor.trim() || !newExpense.amount || !newExpense.date) {
      showError("אנא מלא את כל השדות הנדרשים");
      return;
    }

    // Amount validation
    const amount = parseFloat(newExpense.amount);
    if (amount <= 0) {
      showError("אנא הכנס סכום תקין");
      return;
    }

    try {
      // Create expense data for database
      const expenseData = {
        category: newExpense.category,
        description: newExpense.description.trim(),
        vendor: newExpense.vendor.trim(),
        amount: amount,
        date: newExpense.date,
        status: "בהמתנה",
        paymentMethod: newExpense.paymentMethod
      };

      // Add to database
      const newExpenseDoc = await addExpense(expenseData);
      
      // Update local state
      setExpenses(prevExpenses => [...prevExpenses, newExpenseDoc]);
      
      // Show success message
      setSuccessMessage('ההוצאה נוספה בהצלחה!');
      
      // Reset form and close modal after a short delay
      setTimeout(() => {
        setNewExpense({
          category: "מקום",
          description: "",
          vendor: "",
          amount: "",
          date: new Date().toISOString().split('T')[0],
          paymentMethod: "אשראי"
        });
        setSuccessMessage("");
        setShowAddForm(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error adding expense:', error);
      showError('שגיאה בהוספת ההוצאה');
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setNewExpense({
      category: expense.category,
      description: expense.description,
      vendor: expense.vendor,
      amount: expense.amount.toString(),
      date: expense.date,
      status: expense.status,
      paymentMethod: expense.paymentMethod
    });
    setShowAddForm(true);
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    
    if (!currentEvent?.id || !editingExpense) {
      showError('שגיאה בעדכון ההוצאה');
      return;
    }
    
    // Basic validation
    if (!newExpense.description.trim() || !newExpense.vendor.trim() || !newExpense.amount || !newExpense.date) {
      showError("אנא מלא את כל השדות הנדרשים");
      return;
    }

    const amount = parseFloat(newExpense.amount);
    if (amount <= 0) {
      showError("אנא הכנס סכום תקין");
      return;
    }

    try {
      // Create updated expense data
      const updatedData = {
        category: newExpense.category,
        description: newExpense.description.trim(),
        vendor: newExpense.vendor.trim(),
        amount: amount,
        date: newExpense.date,
        status: newExpense.status,
        paymentMethod: newExpense.paymentMethod
      };

      // Update in database
      const updatedExpense = await updateExpense(editingExpense.id, updatedData);
      
      // Update local state
      setExpenses(prevExpenses => 
        prevExpenses.map(expense => 
          expense.id === editingExpense.id ? updatedExpense : expense
        )
      );
      
      // Show success message
      setSuccessMessage('ההוצאה עודכנה בהצלחה!');
      
      // Reset form and close modal after a short delay
      setTimeout(() => {
        setNewExpense({
          category: "מקום",
          description: "",
          vendor: "",
          amount: "",
          date: new Date().toISOString().split('T')[0],
          paymentMethod: "אשראי"
        });
        setEditingExpense(null);
        setSuccessMessage("");
        setShowAddForm(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error updating expense:', error);
      showError('שגיאה בעדכון ההוצאה');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!currentEvent?.id) {
      showError('שגיאה במחיקת ההוצאה');
      return;
    }

    // Show confirmation dialog
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את ההוצאה?')) {
      return;
    }

    try {
      // Delete from database
      await deleteExpense(expenseId);
      
      // Update local state
      setExpenses(prevExpenses => 
        prevExpenses.filter(expense => expense.id !== expenseId)
      );
      
      // Show success message
      showSuccess('ההוצאה נמחקה בהצלחה');
      
    } catch (error) {
      console.error('Error deleting expense:', error);
      showError('שגיאה במחיקת ההוצאה');
    }
  };

  const handleCancelAdd = () => {
    setNewExpense({
      category: "מקום",
      description: "",
      vendor: "",
      amount: "",
      date: new Date().toISOString().split('T')[0],
      paymentMethod: "אשראי"
    });
    setEditingExpense(null);
    setSuccessMessage("");
    setShowAddForm(false);
  };

  const handleInputChange = (field, value) => {
    setNewExpense(prev => ({
      ...prev,
      [field]: value
    }));
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
        {expenses.length === 0 ? (
          <div className="empty-state glass">
            <div className="empty-icon">
              <i className="fa-solid fa-receipt"></i>
            </div>
            <h3>אין הוצאות עדיין</h3>
            <p>הוסף הוצאה ראשונה כדי להתחיל לעקוב אחר התקציב שלך</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              <i className="fa-solid fa-plus"></i>
              הוסף הוצאה ראשונה
            </button>
          </div>
        ) : viewMode === "table" ? (
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
                            <button 
                              className="action-btn edit"
                              onClick={() => handleEditExpense(expense)}
                            >
                              <i className="fa-solid fa-edit"></i>
                            </button>
                            <button 
                              className="action-btn delete"
                              onClick={() => handleDeleteExpense(expense.id)}
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
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditExpense(expense)}
                  >
                    <i className="fa-solid fa-edit"></i>
                    עריכה
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteExpense(expense.id)}
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

      {/* Add Expense Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={handleCancelAdd}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className={`fa-solid ${editingExpense ? 'fa-edit' : 'fa-plus'}`}></i>
                {editingExpense ? 'עריכת הוצאה' : 'הוספת הוצאה חדשה'}
              </h2>
              <button className="modal-close" onClick={handleCancelAdd}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
             <form onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense} className="expense-form">
               {successMessage && (
                 <div className="success-message">
                   <i className="fa-solid fa-check-circle"></i>
                   {successMessage}
                 </div>
               )}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expenseCategory">
                    <i className="fa-solid fa-tag"></i>
                    קטגוריה
                  </label>
                  <select
                    id="expenseCategory"
                    value={newExpense.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                  >
                    <option value="מקום">מקום</option>
                    <option value="צילום">צילום</option>
                    <option value="קייטרינג">קייטרינג</option>
                    <option value="פרחים">פרחים</option>
                    <option value="בידור">בידור</option>
                    <option value="שמלה">שמלה</option>
                    <option value="אחר">אחר</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="expenseAmount">
                    <i className="fa-solid fa-shekel-sign"></i>
                    סכום *
                  </label>
                  <input
                    id="expenseAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expenseStatus">
                    <i className="fa-solid fa-info-circle"></i>
                    סטטוס
                  </label>
                  <select
                    id="expenseStatus"
                    value={newExpense.status || "בהמתנה"}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                  >
                    <option value="בהמתנה">בהמתנה</option>
                    <option value="שולם">שולם</option>
                    <option value="בוטל">בוטל</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="expenseDescription">
                  <i className="fa-solid fa-align-left"></i>
                  תיאור ההוצאה *
                </label>
                <input
                  id="expenseDescription"
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="לדוגמה: הזמנת אולם לחתונה"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="expenseVendor">
                  <i className="fa-solid fa-store"></i>
                  ספק *
                </label>
                <input
                  id="expenseVendor"
                  type="text"
                  value={newExpense.vendor}
                  onChange={(e) => handleInputChange("vendor", e.target.value)}
                  placeholder="שם הספק או העסק"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expenseDate">
                    <i className="fa-solid fa-calendar"></i>
                    תאריך *
                  </label>
                  <input
                    id="expenseDate"
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expensePaymentMethod">
                    <i className="fa-solid fa-credit-card"></i>
                    אמצעי תשלום
                  </label>
                  <select
                    id="expensePaymentMethod"
                    value={newExpense.paymentMethod}
                    onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                  >
                    <option value="אשראי">אשראי</option>
                    <option value="מזומן">מזומן</option>
                    <option value="העברה">העברה</option>
                    <option value="צ'ק">צ'ק</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <i className={`fa-solid ${editingExpense ? 'fa-save' : 'fa-plus'}`}></i>
                  {editingExpense ? 'עדכן הוצאה' : 'הוסף הוצאה'}
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

         .empty-state {
           padding: var(--space-xl);
           text-align: center;
           border-radius: var(--radius-lg);
           display: flex;
           flex-direction: column;
           align-items: center;
           gap: var(--space-lg);
         }

         .empty-icon {
           width: 80px;
           height: 80px;
           border-radius: 50%;
           background: rgba(124, 92, 255, 0.2);
           display: flex;
           align-items: center;
           justify-content: center;
           font-size: 2.5rem;
           color: var(--brand);
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

         .expense-form {
           padding: var(--space-lg);
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
        .form-group select {
          padding: var(--space-sm) var(--space-md);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
          font-size: 1rem;
          transition: all var(--transition);
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--brand);
          box-shadow: 0 0 0 2px rgba(124, 92, 255, 0.3);
          background: rgba(255, 255, 255, 0.08);
        }

        .form-group input::placeholder {
          color: var(--text-secondary);
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

          .modal-overlay {
            padding: var(--space-sm);
          }

          .modal-content {
            max-height: 95vh;
          }

          .modal-header {
            padding: var(--space-md);
          }

          .expense-form {
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
