import React, { useState } from "react";
import { useToast } from "../components/Toast/Toast";

// Mock tasks data
const mockTasks = [
  {
    id: 1,
    title: "הזמנת אולם",
    description: "לחפש ולהזמין אולם לחתונה",
    priority: "גבוהה",
    dueDate: "2024-03-15",
    status: "חדש",
    category: "מקום",
    createdDate: "2024-01-10"
  },
  {
    id: 2,
    title: "הזמנת צלם",
    description: "למצוא צלם מקצועי לחתונה",
    priority: "גבוהה",
    dueDate: "2024-03-20",
    status: "בביצוע",
    category: "צילום",
    createdDate: "2024-01-12"
  },
  {
    id: 3,
    title: "בחירת תפריט",
    description: "לבחור תפריט עם הקייטרינג",
    priority: "בינונית",
    dueDate: "2024-04-01",
    status: "בביצוע",
    category: "קייטרינג",
    createdDate: "2024-01-15"
  },
  {
    id: 4,
    title: "הזמנת פרחים",
    description: "לבחור זרי פרחים לחתונה",
    priority: "נמוכה",
    dueDate: "2024-05-01",
    status: "חדש",
    category: "פרחים",
    createdDate: "2024-01-18"
  },
  {
    id: 5,
    title: "רשימת מוזמנים",
    description: "להכין רשימה סופית של המוזמנים",
    priority: "גבוהה",
    dueDate: "2024-04-15",
    status: "הושלם",
    category: "תכנון",
    createdDate: "2024-01-08"
  },
  {
    id: 6,
    title: "הזמנת DJ",
    description: "למצוא DJ למוזיקה בחתונה",
    priority: "בינונית",
    dueDate: "2024-04-10",
    status: "הושלם",
    category: "בידור",
    createdDate: "2024-01-20"
  },
  {
    id: 7,
    title: "בחירת שמלת כלה",
    description: "למצוא ולהזמין שמלת כלה",
    priority: "גבוהה",
    dueDate: "2024-03-30",
    status: "בביצוע",
    category: "אופנה",
    createdDate: "2024-01-25"
  },
  {
    id: 8,
    title: "הזמנת עוגת חתונה",
    description: "לבחור ולהזמין עוגת חתונה",
    priority: "בינונית",
    dueDate: "2024-04-20",
    status: "חדש",
    category: "קייטרינג",
    createdDate: "2024-01-30"
  }
];

const priorities = ["הכל", "גבוהה", "בינונית", "נמוכה"];
const categories = ["הכל", "מקום", "צילום", "קייטרינג", "פרחים", "בידור", "אופנה", "תכנון"];

export default function TasksPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const { showSuccess, showInfo } = useToast();
  const [activeTab, setActiveTab] = useState("חדש"); // "חדש", "בביצוע", "הושלם"
  const [filterPriority, setFilterPriority] = useState("הכל");
  const [filterCategory, setFilterCategory] = useState("הכל");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "בינונית",
    category: "תכנון",
    dueDate: ""
  });

  // Filter tasks by active tab and filters
  const filteredTasks = tasks
    .filter(task => task.status === activeTab)
    .filter(task => {
      const matchesPriority = filterPriority === "הכל" || task.priority === filterPriority;
      const matchesCategory = filterCategory === "הכל" || task.category === filterCategory;
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPriority && matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      // Sort by priority first, then by due date
      const priorityOrder = { "גבוהה": 3, "בינונית": 2, "נמוכה": 1 };
      const aPriority = priorityOrder[a.priority] || 0;
      const bPriority = priorityOrder[b.priority] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority; // Higher priority first
      }
      
      return new Date(a.dueDate) - new Date(b.dueDate); // Earlier due date first
    });

  // Get task counts for each tab
  const newTasks = tasks.filter(t => t.status === "חדש").length;
  const pendingTasks = tasks.filter(t => t.status === "בביצוע").length;
  const completedTasks = tasks.filter(t => t.status === "הושלם").length;

  const handleStatusChange = (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    );
    
    // Show success message based on status change
    if (newStatus === "בביצוע") {
      showInfo(`המשימה "${task?.title}" הועברה לביצוע`);
    } else if (newStatus === "הושלם") {
      showSuccess(`המשימה "${task?.title}" הושלמה בהצלחה!`);
    } else if (newStatus === "חדש") {
      showInfo(`המשימה "${task?.title}" הועברה חזרה למשימות חדשות`);
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "גבוהה": return "priority-high";
      case "בינונית": return "priority-medium";
      case "נמוכה": return "priority-low";
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
      case "תכנון": return "fa-list-check";
      default: return "fa-tasks";
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newTask.title.trim() || !newTask.description.trim() || !newTask.dueDate) {
      alert("אנא מלא את כל השדות הנדרשים");
      return;
    }

    // Create new task object
    const task = {
      id: Math.max(...tasks.map(t => t.id)) + 1,
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      status: "חדש",
      category: newTask.category,
      createdDate: new Date().toISOString().split('T')[0]
    };

    // Add to tasks list
    setTasks(prevTasks => [...prevTasks, task]);
    
    // Show success message
    showSuccess(`המשימה "${task.title}" נוספה בהצלחה!`);
    
    // Reset form and close modal
    setNewTask({
      title: "",
      description: "",
      priority: "בינונית",
      category: "תכנון",
      dueDate: ""
    });
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    setNewTask({
      title: "",
      description: "",
      priority: "בינונית",
      category: "תכנון",
      dueDate: ""
    });
    setShowAddForm(false);
  };

  const handleInputChange = (field, value) => {
    setNewTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="tasks-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <h1>
              <i className="fa-solid fa-list-check"></i>
              משימות
            </h1>
            <p>נהל את כל המשימות שלך לאירוע</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            <i className="fa-solid fa-plus"></i>
            הוספת משימה
          </button>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card glass">
            <div className="card-icon total">
              <i className="fa-solid fa-clipboard-list"></i>
            </div>
            <div className="card-info">
              <h3>סה"כ משימות</h3>
              <p className="amount">{tasks.length}</p>
            </div>
          </div>
          <div className="summary-card glass">
            <div className="card-icon new">
              <i className="fa-solid fa-plus-circle"></i>
            </div>
            <div className="card-info">
              <h3>משימות חדשות</h3>
              <p className="amount">{newTasks}</p>
            </div>
          </div>
          <div className="summary-card glass">
            <div className="card-icon pending">
              <i className="fa-solid fa-clock"></i>
            </div>
            <div className="card-info">
              <h3>בביצוע</h3>
              <p className="amount">{pendingTasks}</p>
            </div>
          </div>
          <div className="summary-card glass">
            <div className="card-icon completed">
              <i className="fa-solid fa-check-circle"></i>
            </div>
            <div className="card-info">
              <h3>הושלמו</h3>
              <p className="amount">{completedTasks}</p>
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
                placeholder="חיפוש משימות..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-group">
            <label>עדיפות</label>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>קטגוריה</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-section glass">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === "חדש" ? "active" : ""}`}
            onClick={() => setActiveTab("חדש")}
          >
            <i className="fa-solid fa-plus-circle"></i>
            משימות חדשות
            <span className="count">{newTasks}</span>
          </button>
          <button 
            className={`tab ${activeTab === "בביצוע" ? "active" : ""}`}
            onClick={() => setActiveTab("בביצוע")}
          >
            <i className="fa-solid fa-clock"></i>
            בביצוע
            <span className="count">{pendingTasks}</span>
          </button>
          <button 
            className={`tab ${activeTab === "הושלם" ? "active" : ""}`}
            onClick={() => setActiveTab("הושלם")}
          >
            <i className="fa-solid fa-check-circle"></i>
            הושלמו
            <span className="count">{completedTasks}</span>
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="tasks-section glass">
        <div className="tasks-header">
          <h2>
            {activeTab === "חדש" && "משימות חדשות"}
            {activeTab === "בביצוע" && "משימות בביצוע"}
            {activeTab === "הושלם" && "משימות שהושלמו"}
          </h2>
          <span className="tasks-count">{filteredTasks.length} משימות</span>
        </div>
        
        <div className="tasks-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <i className="fa-solid fa-clipboard-list"></i>
              <h3>אין משימות</h3>
              <p>
                {activeTab === "חדש" && "אין משימות חדשות כרגע"}
                {activeTab === "בביצוע" && "אין משימות בביצוע כרגע"}
                {activeTab === "הושלם" && "אין משימות שהושלמו עדיין"}
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className={`task-card ${isOverdue(task.dueDate) && task.status !== "הושלם" ? "overdue" : ""}`}>
                <div className="task-header">
                  <div className="task-title">
                    <div className="category-icon">
                      <i className={`fa-solid ${getCategoryIcon(task.category)}`}></i>
                    </div>
                    <h3>{task.title}</h3>
                  </div>
                  <div className="task-meta">
                    <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                      {task.priority}
                    </span>
                    {isOverdue(task.dueDate) && task.status !== "הושלם" && (
                      <span className="overdue-badge">
                        <i className="fa-solid fa-exclamation-triangle"></i>
                        באיחור
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="task-body">
                  <p className="task-description">{task.description}</p>
                  <div className="task-details">
                    <div className="detail">
                      <i className="fa-solid fa-calendar"></i>
                      <span>תאריך יעד: {new Date(task.dueDate).toLocaleDateString('he-IL')}</span>
                    </div>
                    <div className="detail">
                      <i className="fa-solid fa-tag"></i>
                      <span>{task.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="task-actions">
                  <div className="status-controls">
                    {task.status === "חדש" && (
                      <>
                        <button 
                          className="status-btn start"
                          onClick={() => handleStatusChange(task.id, "בביצוע")}
                        >
                          <i className="fa-solid fa-play"></i>
                          התחל
                        </button>
                        <button 
                          className="status-btn complete"
                          onClick={() => handleStatusChange(task.id, "הושלם")}
                        >
                          <i className="fa-solid fa-check"></i>
                          סיים
                        </button>
                      </>
                    )}
                    {task.status === "בביצוע" && (
                      <>
                        <button 
                          className="status-btn back"
                          onClick={() => handleStatusChange(task.id, "חדש")}
                        >
                          <i className="fa-solid fa-undo"></i>
                          חזור
                        </button>
                        <button 
                          className="status-btn complete"
                          onClick={() => handleStatusChange(task.id, "הושלם")}
                        >
                          <i className="fa-solid fa-check"></i>
                          סיים
                        </button>
                      </>
                    )}
                    {task.status === "הושלם" && (
                      <button 
                        className="status-btn reopen"
                        onClick={() => handleStatusChange(task.id, "בביצוע")}
                      >
                        <i className="fa-solid fa-redo"></i>
                        פתח מחדש
                      </button>
                    )}
                  </div>
                  <div className="action-buttons">
                    <button className="action-btn edit">
                      <i className="fa-solid fa-edit"></i>
                    </button>
                    <button className="action-btn delete">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={handleCancelAdd}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fa-solid fa-plus"></i>
                הוספת משימה חדשה
              </h2>
              <button className="modal-close" onClick={handleCancelAdd}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleAddTask} className="task-form">
              <div className="form-group">
                <label htmlFor="taskTitle">
                  <i className="fa-solid fa-heading"></i>
                  כותרת המשימה *
                </label>
                <input
                  id="taskTitle"
                  type="text"
                  value={newTask.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="לדוגמה: הזמנת אולם לחתונה"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="taskDescription">
                  <i className="fa-solid fa-align-left"></i>
                  תיאור המשימה *
                </label>
                <textarea
                  id="taskDescription"
                  value={newTask.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="פרטים נוספים על המשימה..."
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="taskPriority">
                    <i className="fa-solid fa-exclamation"></i>
                    עדיפות
                  </label>
                  <select
                    id="taskPriority"
                    value={newTask.priority}
                    onChange={(e) => handleInputChange("priority", e.target.value)}
                  >
                    <option value="נמוכה">נמוכה</option>
                    <option value="בינונית">בינונית</option>
                    <option value="גבוהה">גבוהה</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="taskCategory">
                    <i className="fa-solid fa-tag"></i>
                    קטגוריה
                  </label>
                  <select
                    id="taskCategory"
                    value={newTask.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                  >
                    <option value="מקום">מקום</option>
                    <option value="צילום">צילום</option>
                    <option value="קייטרינג">קייטרינג</option>
                    <option value="פרחים">פרחים</option>
                    <option value="בידור">בידור</option>
                    <option value="אופנה">אופנה</option>
                    <option value="תכנון">תכנון</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="taskDueDate">
                  <i className="fa-solid fa-calendar"></i>
                  תאריך יעד *
                </label>
                <input
                  id="taskDueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <i className="fa-solid fa-plus"></i>
                  הוסף משימה
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
        .tasks-page {
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

        .card-icon.new {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .card-icon.pending {
          background: rgba(241, 180, 76, 0.2);
          color: #f1b44c;
        }

        .card-icon.completed {
          background: rgba(30, 190, 126, 0.2);
          color: #1ebe7e;
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

        .tabs-section {
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
        }

        .tabs {
          display: flex;
          gap: var(--space-sm);
          flex-wrap: wrap;
        }

        .tab {
          padding: var(--space-md) var(--space-lg);
          border: none;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition);
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: 1rem;
          font-weight: 500;
        }

        .tab:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text);
        }

        .tab.active {
          background: var(--brand);
          color: white;
        }

        .tab .count {
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .tab.active .count {
          background: rgba(255, 255, 255, 0.3);
        }

        .tasks-section {
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          flex: 1;
        }

        .tasks-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tasks-header h2 {
          margin: 0;
          font-size: 1.4rem;
          color: var(--text);
          font-weight: 600;
        }

        .tasks-count {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .empty-state {
          text-align: center;
          padding: var(--space-xl);
          color: var(--text-secondary);
        }

        .empty-state i {
          font-size: 3rem;
          margin-bottom: var(--space-md);
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 var(--space-sm) 0;
          font-size: 1.2rem;
        }

        .empty-state p {
          margin: 0;
          font-size: 0.95rem;
        }

        .task-card {
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all var(--transition);
        }

        .task-card:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-1px);
        }

        .task-card.overdue {
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.05);
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-md);
        }

        .task-title {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .category-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: rgba(124, 92, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand);
        }

        .task-title h3 {
          margin: 0;
          font-size: 1.2rem;
          color: var(--text);
          font-weight: 600;
        }

        .task-meta {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .priority-badge {
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 500;
          border: 1px solid;
        }

        .priority-badge.priority-high {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.4);
        }

        .priority-badge.priority-medium {
          background: rgba(241, 180, 76, 0.2);
          color: #f1b44c;
          border-color: rgba(241, 180, 76, 0.4);
        }

        .priority-badge.priority-low {
          background: rgba(30, 190, 126, 0.2);
          color: #1ebe7e;
          border-color: rgba(30, 190, 126, 0.4);
        }

        .overdue-badge {
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 500;
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.4);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .task-body {
          margin-bottom: var(--space-md);
        }

        .task-description {
          margin: 0 0 var(--space-md) 0;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .task-details {
          display: flex;
          gap: var(--space-lg);
          flex-wrap: wrap;
        }

        .detail {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .detail i {
          width: 14px;
        }

        .task-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--space-md);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .status-controls {
          display: flex;
          gap: var(--space-sm);
        }

        .status-btn {
          padding: var(--space-xs) var(--space-md);
          border: none;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition);
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .status-btn.start {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.4);
        }

        .status-btn.start:hover {
          background: rgba(59, 130, 246, 0.3);
        }

        .status-btn.complete {
          background: rgba(30, 190, 126, 0.2);
          color: #1ebe7e;
          border: 1px solid rgba(30, 190, 126, 0.4);
        }

        .status-btn.complete:hover {
          background: rgba(30, 190, 126, 0.3);
        }

        .status-btn.back,
        .status-btn.reopen {
          background: rgba(156, 163, 175, 0.2);
          color: #9ca3af;
          border: 1px solid rgba(156, 163, 175, 0.4);
        }

        .status-btn.back:hover,
        .status-btn.reopen:hover {
          background: rgba(156, 163, 175, 0.3);
        }

        .action-buttons {
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

        .task-form {
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
          .tasks-page {
            padding: var(--space-md);
          }

          .header-content {
            flex-direction: column;
            align-items: stretch;
          }

          .controls-section .filters {
            flex-direction: column;
          }

          .tabs {
            flex-direction: column;
          }

          .task-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-sm);
          }

          .task-details {
            flex-direction: column;
            gap: var(--space-sm);
          }

          .task-actions {
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-md);
          }

          .status-controls {
            justify-content: center;
          }

          .action-buttons {
            justify-content: center;
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

          .task-title {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-xs);
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

          .task-form {
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
