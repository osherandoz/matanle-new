import React, { useState, useEffect } from "react";

// Mock gifts data
const mockGifts = [
  {
    id: 1,
    name: "מכונת קפה דלונגי",
    purchaseLink: "https://www.amazon.com/delonghi-coffee-machine",
    price: 899,
    image: "https://via.placeholder.com/300x200?text=מכונת+קפה",
    reservedBy: "יוסי כהן", // This will come from guest DB later
    reservedById: 1, // Guest ID for future integration
    isReserved: true,
    isPurchased: false,
    reservedDate: "2024-01-15"
  },
  {
    id: 2,
    name: "סט כלים 24 חלקים",
    purchaseLink: "https://www.ikea.com/cutlery-set",
    price: 299,
    image: "https://via.placeholder.com/300x200?text=סט+כלים",
    reservedBy: null,
    reservedById: null,
    isReserved: false,
    isPurchased: false,
    reservedDate: null
  },
  {
    id: 3,
    name: "מיקסר קיטצ'נאייד",
    purchaseLink: "https://www.kitchenaid.com/mixer",
    price: 1299,
    image: "https://via.placeholder.com/300x200?text=מיקסר",
    reservedBy: "רחל לוי",
    reservedById: 2,
    isReserved: true,
    isPurchased: true,
    reservedDate: "2024-01-10"
  },
  {
    id: 4,
    name: "מערכת סאונד בלוטוס",
    purchaseLink: "https://www.bose.com/bluetooth-speaker",
    price: 599,
    image: "https://via.placeholder.com/300x200?text=רמקול",
    reservedBy: "דני ופטרה גרין",
    reservedById: 3,
    isReserved: true,
    isPurchased: false,
    reservedDate: "2024-01-20"
  },
  {
    id: 5,
    name: "מצעים איכותיים",
    purchaseLink: "https://www.bedding.com/luxury-sheets",
    price: 399,
    image: "https://via.placeholder.com/300x200?text=מצעים",
    reservedBy: null,
    reservedById: null,
    isReserved: false,
    isPurchased: false,
    reservedDate: null
  },
  {
    id: 6,
    name: "מעבד מזון",
    purchaseLink: "https://www.cuisinart.com/food-processor",
    price: 449,
    image: "https://via.placeholder.com/300x200?text=מעבד+מזון",
    reservedBy: "סבתא שרה",
    reservedById: 6,
    isReserved: true,
    isPurchased: true,
    reservedDate: "2024-01-08"
  },
  {
    id: 7,
    name: "שואב אבק רובוטי",
    purchaseLink: "https://www.irobot.com/roomba",
    price: 899,
    image: "https://via.placeholder.com/300x200?text=רומבה",
    reservedBy: null,
    reservedById: null,
    isReserved: false,
    isPurchased: false,
    reservedDate: null
  },
  {
    id: 8,
    name: "סט מחבתות איכותיות",
    purchaseLink: "https://www.tefal.com/pan-set",
    price: 299,
    image: "https://via.placeholder.com/300x200?text=מחבתות",
    reservedBy: "חברי העבודה",
    reservedById: 8,
    isReserved: true,
    isPurchased: false,
    reservedDate: "2024-01-25"
  }
];

const statusFilters = ["הכל", "זמין", "שמור", "נרכש"];
const priceRanges = ["הכל", "עד 200₪", "200-500₪", "500-1000₪", "מעל 1000₪"];

export default function GiftsPage() {
  const [gifts, setGifts] = useState(mockGifts);
  const [viewMode, setViewMode] = useState("grid"); // "table" or "grid"
  const [filterStatus, setFilterStatus] = useState("הכל");
  const [filterPriceRange, setFilterPriceRange] = useState("הכל");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter and sort gifts
  const filteredGifts = gifts
    .filter(gift => {
      const matchesStatus = filterStatus === "הכל" || 
        (filterStatus === "זמין" && !gift.isReserved) ||
        (filterStatus === "שמור" && gift.isReserved && !gift.isPurchased) ||
        (filterStatus === "נרכש" && gift.isPurchased);
      
      const matchesPriceRange = filterPriceRange === "הכל" ||
        (filterPriceRange === "עד 200₪" && gift.price <= 200) ||
        (filterPriceRange === "200-500₪" && gift.price > 200 && gift.price <= 500) ||
        (filterPriceRange === "500-1000₪" && gift.price > 500 && gift.price <= 1000) ||
        (filterPriceRange === "מעל 1000₪" && gift.price > 1000);
      
      const matchesSearch = gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (gift.reservedBy && gift.reservedBy.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesStatus && matchesPriceRange && matchesSearch;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'price') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Calculate stats
  const totalGifts = gifts.length;
  const availableGifts = gifts.filter(g => !g.isReserved).length;
  const reservedGifts = gifts.filter(g => g.isReserved && !g.isPurchased).length;
  const purchasedGifts = gifts.filter(g => g.isPurchased).length;
  const totalValue = gifts.reduce((sum, g) => sum + g.price, 0);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getStatusClass = (gift) => {
    if (gift.isPurchased) return "status-purchased";
    if (gift.isReserved) return "status-reserved";
    return "status-available";
  };

  const getStatusText = (gift) => {
    if (gift.isPurchased) return "נרכש";
    if (gift.isReserved) return "שמור";
    return "זמין";
  };

  const handleReserveGift = (giftId) => {
    // TODO: In the future, this will show a modal to select a guest
    const guestName = prompt("שם המוזמן ששומר את המתנה:");
    if (guestName) {
      setGifts(prevGifts => 
        prevGifts.map(gift => 
          gift.id === giftId 
            ? { 
                ...gift, 
                isReserved: true, 
                reservedBy: guestName,
                reservedDate: new Date().toISOString().split('T')[0]
              }
            : gift
        )
      );
    }
  };

  const handleReleaseGift = (giftId) => {
    if (confirm("האם אתה בטוח שברצונך לשחרר את המתנה?")) {
      setGifts(prevGifts => 
        prevGifts.map(gift => 
          gift.id === giftId 
            ? { 
                ...gift, 
                isReserved: false, 
                reservedBy: null,
                reservedById: null,
                reservedDate: null,
                isPurchased: false
              }
            : gift
        )
      );
    }
  };

  const handleTogglePurchased = (giftId) => {
    setGifts(prevGifts => 
      prevGifts.map(gift => 
        gift.id === giftId 
          ? { ...gift, isPurchased: !gift.isPurchased }
          : gift
      )
    );
  };

  return (
    <div className="gifts-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <h1>
              <i className="fa-solid fa-gifts"></i>
              רשימת מתנות
            </h1>
            <p>נהל את רשימת המתנות לאירוע שלך</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            <i className="fa-solid fa-plus"></i>
            הוספת מתנה
          </button>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card glass">
            <div className="card-icon total">
              <i className="fa-solid fa-gifts"></i>
            </div>
            <div className="card-info">
              <h3>סה"כ מתנות</h3>
              <p className="amount">{totalGifts}</p>
            </div>
          </div>
          <div className="summary-card glass">
            <div className="card-icon available">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className="card-info">
              <h3>זמינות</h3>
              <p className="amount">{availableGifts}</p>
            </div>
          </div>
          <div className="summary-card glass">
            <div className="card-icon reserved">
              <i className="fa-solid fa-bookmark"></i>
            </div>
            <div className="card-info">
              <h3>שמורות</h3>
              <p className="amount">{reservedGifts}</p>
            </div>
          </div>
          <div className="summary-card glass">
            <div className="card-icon purchased">
              <i className="fa-solid fa-shopping-cart"></i>
            </div>
            <div className="card-info">
              <h3>נרכשו</h3>
              <p className="amount">{purchasedGifts}</p>
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
                placeholder="חיפוש לפי שם מתנה או שם שומר..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-group">
            <label>סטטוס</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              {statusFilters.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>טווח מחיר</label>
            <select value={filterPriceRange} onChange={(e) => setFilterPriceRange(e.target.value)}>
              {priceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="view-controls">
          <div className="total-value">
            <span className="value-label">סה"כ שווי:</span>
            <span className="value-amount">₪{totalValue.toLocaleString()}</span>
          </div>
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
              <table className="gifts-table">
                <thead>
                  <tr>
                    <th>תמונה</th>
                    <th onClick={() => handleSort("name")}>
                      שם המתנה
                      {sortBy === "name" && (
                        <i className={`fa-solid fa-chevron-${sortOrder === "asc" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th onClick={() => handleSort("price")}>
                      מחיר
                      {sortBy === "price" && (
                        <i className={`fa-solid fa-chevron-${sortOrder === "asc" ? "up" : "down"}`}></i>
                      )}
                    </th>
                    <th>שמור על ידי</th>
                    <th>סטטוס</th>
                    <th>לינק רכישה</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGifts.map(gift => (
                    <tr key={gift.id}>
                      <td>
                        <div className="gift-image-cell">
                          <img src={gift.image} alt={gift.name} className="gift-thumbnail" />
                        </div>
                      </td>
                      <td>
                        <div className="gift-name">
                          <strong>{gift.name}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="price-badge">₪{gift.price.toLocaleString()}</span>
                      </td>
                      <td>
                        <div className="reserved-by">
                          {gift.reservedBy ? (
                            <span className="reserver-name">{gift.reservedBy}</span>
                          ) : (
                            <span className="no-reserver">-</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(gift)}`}>
                          {getStatusText(gift)}
                        </span>
                      </td>
                      <td>
                        <a 
                          href={gift.purchaseLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="purchase-link"
                        >
                          <i className="fa-solid fa-external-link"></i>
                          קישור רכישה
                        </a>
                      </td>
                      <td>
                        <div className="actions">
                          {!gift.isReserved ? (
                            <button 
                              className="action-btn reserve"
                              onClick={() => handleReserveGift(gift.id)}
                              title="שמירת מתנה"
                            >
                              <i className="fa-solid fa-bookmark"></i>
                            </button>
                          ) : (
                            <button 
                              className="action-btn release"
                              onClick={() => handleReleaseGift(gift.id)}
                              title="שחרור מתנה"
                            >
                              <i className="fa-solid fa-bookmark-slash"></i>
                            </button>
                          )}
                          {gift.isReserved && (
                            <button 
                              className={`action-btn purchase ${gift.isPurchased ? 'purchased' : ''}`}
                              onClick={() => handleTogglePurchased(gift.id)}
                              title={gift.isPurchased ? "סמן כלא נרכש" : "סמן כנרכש"}
                            >
                              <i className={`fa-solid ${gift.isPurchased ? 'fa-check-circle' : 'fa-shopping-cart'}`}></i>
                            </button>
                          )}
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
            {filteredGifts.map(gift => (
              <div key={gift.id} className="gift-card glass">
                <div className="card-image">
                  <img src={gift.image} alt={gift.name} />
                  <div className="card-overlay">
                    <span className={`status-badge ${getStatusClass(gift)}`}>
                      {getStatusText(gift)}
                    </span>
                  </div>
                </div>
                
                <div className="card-content">
                  <div className="card-header">
                    <h3 className="gift-name">{gift.name}</h3>
                    <span className="price-badge">₪{gift.price.toLocaleString()}</span>
                  </div>
                  
                  <div className="card-body">
                    {gift.reservedBy && (
                      <div className="reserved-info">
                        <div className="reserved-header">
                          <i className="fa-solid fa-user"></i>
                          <span>שמור על ידי</span>
                        </div>
                        <p className="reserver-name">{gift.reservedBy}</p>
                        {gift.reservedDate && (
                          <p className="reserved-date">
                            <i className="fa-solid fa-calendar"></i>
                            {new Date(gift.reservedDate).toLocaleDateString('he-IL')}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="purchase-link-section">
                      <a 
                        href={gift.purchaseLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="purchase-link-card"
                      >
                        <i className="fa-solid fa-external-link"></i>
                        רכישה באתר
                      </a>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    {!gift.isReserved ? (
                      <button 
                        className="action-btn reserve primary"
                        onClick={() => handleReserveGift(gift.id)}
                      >
                        <i className="fa-solid fa-bookmark"></i>
                        שמירה
                      </button>
                    ) : (
                      <button 
                        className="action-btn release secondary"
                        onClick={() => handleReleaseGift(gift.id)}
                      >
                        <i className="fa-solid fa-bookmark-slash"></i>
                        שחרור
                      </button>
                    )}
                    
                    {gift.isReserved && (
                      <button 
                        className={`action-btn purchase ${gift.isPurchased ? 'purchased' : 'secondary'}`}
                        onClick={() => handleTogglePurchased(gift.id)}
                      >
                        <i className={`fa-solid ${gift.isPurchased ? 'fa-check-circle' : 'fa-shopping-cart'}`}></i>
                        {gift.isPurchased ? 'נרכש' : 'סמן כנרכש'}
                      </button>
                    )}
                    
                    <div className="secondary-actions">
                      <button className="action-btn edit small">
                        <i className="fa-solid fa-edit"></i>
                      </button>
                      <button className="action-btn delete small">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .gifts-page {
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

        .card-icon.available {
          background: rgba(30, 190, 126, 0.2);
          color: #1ebe7e;
        }

        .card-icon.reserved {
          background: rgba(241, 180, 76, 0.2);
          color: #f1b44c;
        }

        .card-icon.purchased {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
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
          align-items: center;
          gap: var(--space-lg);
        }

        .total-value {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-xs);
        }

        .value-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .value-amount {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--brand);
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

        .gifts-table {
          width: 100%;
          border-collapse: collapse;
        }

        .gifts-table th,
        .gifts-table td {
          padding: var(--space-md);
          text-align: right;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .gifts-table th {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          user-select: none;
        }

        .gifts-table th:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text);
        }

        .gifts-table th i {
          margin-right: var(--space-xs);
        }

        .gifts-table td {
          color: var(--text);
        }

        .gift-image-cell {
          width: 60px;
          height: 60px;
        }

        .gift-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: var(--radius-md);
        }

        .gift-name strong {
          font-size: 1rem;
        }

        .price-badge {
          display: inline-flex;
          align-items: center;
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 600;
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.4);
        }

        .reserved-by {
          font-size: 0.9rem;
        }

        .reserver-name {
          color: var(--text);
          font-weight: 500;
        }

        .no-reserver {
          color: var(--text-secondary);
          font-style: italic;
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

        .status-badge.status-purchased {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          border-color: rgba(59, 130, 246, 0.4);
        }

        .purchase-link {
          color: var(--brand);
          text-decoration: none;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .purchase-link:hover {
          text-decoration: underline;
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

        .action-btn.reserve {
          background: rgba(241, 180, 76, 0.2);
          color: #f1b44c;
        }

        .action-btn.reserve:hover {
          background: rgba(241, 180, 76, 0.3);
        }

        .action-btn.release {
          background: rgba(156, 163, 175, 0.2);
          color: #9ca3af;
        }

        .action-btn.release:hover {
          background: rgba(156, 163, 175, 0.3);
        }

        .action-btn.purchase {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .action-btn.purchase:hover {
          background: rgba(59, 130, 246, 0.3);
        }

        .action-btn.purchase.purchased {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
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

        .gift-card {
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .card-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-overlay {
          position: absolute;
          top: var(--space-sm);
          right: var(--space-sm);
        }

        .card-content {
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          flex: 1;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--space-sm);
        }

        .gift-card .gift-name {
          margin: 0;
          font-size: 1.3rem;
          color: var(--text);
          font-weight: 600;
          flex: 1;
        }

        .card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .reserved-info {
          padding: var(--space-sm);
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .reserved-header {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          margin-bottom: var(--space-xs);
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .reserved-info .reserver-name {
          margin: 0;
          font-size: 0.95rem;
          color: var(--text);
          font-weight: 500;
        }

        .reserved-date {
          margin: var(--space-xs) 0 0 0;
          font-size: 0.8rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .purchase-link-section {
          margin-top: auto;
        }

        .purchase-link-card {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-xs);
          padding: var(--space-sm);
          background: rgba(124, 92, 255, 0.1);
          border: 1px solid rgba(124, 92, 255, 0.3);
          border-radius: var(--radius-md);
          color: var(--brand);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all var(--transition);
        }

        .purchase-link-card:hover {
          background: rgba(124, 92, 255, 0.2);
          transform: translateY(-1px);
        }

        .card-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          padding-top: var(--space-md);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .card-actions .action-btn {
          width: 100%;
          height: auto;
          padding: var(--space-sm) var(--space-md);
          gap: var(--space-xs);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .card-actions .action-btn.primary {
          background: var(--brand);
          color: white;
        }

        .card-actions .action-btn.primary:hover {
          background: var(--brand-hover);
        }

        .card-actions .action-btn.secondary {
          background: rgba(156, 163, 175, 0.2);
          color: #9ca3af;
        }

        .card-actions .action-btn.secondary:hover {
          background: rgba(156, 163, 175, 0.3);
        }

        .card-actions .action-btn.purchased {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .secondary-actions {
          display: flex;
          gap: var(--space-sm);
        }

        .secondary-actions .action-btn {
          flex: 1;
        }

        .secondary-actions .action-btn.small {
          width: auto;
          height: 36px;
          padding: var(--space-xs) var(--space-sm);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .gifts-page {
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
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-sm);
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

          .gifts-table th,
          .gifts-table td {
            padding: var(--space-sm);
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

          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-sm);
          }
        }
      `}</style>
    </div>
  );
}
