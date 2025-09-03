import React, { useState, useEffect, createContext, useContext } from 'react';

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message, duration) => addToast(message, 'success', duration);
  const showError = (message, duration) => addToast(message, 'error', duration);
  const showWarning = (message, duration) => addToast(message, 'warning', duration);
  const showInfo = (message, duration) => addToast(message, 'info', duration);

  return (
    <ToastContext.Provider value={{
      addToast,
      showSuccess,
      showError,
      showWarning,
      showInfo
    }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container
const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={() => onRemove(toast.id)}
        />
      ))}
      <style jsx>{`
        .toast-container {
          position: fixed;
          top: var(--space-lg);
          left: 50%;
          transform: translateX(-50%);
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .toast-container {
            top: var(--space-md);
            right: var(--space-md);
            left: var(--space-md);
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

// Individual Toast Component
const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return 'fa-check-circle';
      case 'error': return 'fa-times-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'info': return 'fa-info-circle';
      default: return 'fa-info-circle';
    }
  };

  return (
    <div 
      className={`toast toast-${toast.type} ${isVisible ? 'visible' : ''} ${isRemoving ? 'removing' : ''}`}
      onClick={handleRemove}
    >
      <div className="toast-icon">
        <i className={`fa-solid ${getIcon()}`}></i>
      </div>
      <div className="toast-content">
        <p>{toast.message}</p>
      </div>
      <button className="toast-close" onClick={handleRemove}>
        <i className="fa-solid fa-times"></i>
      </button>

      <style jsx>{`
        .toast {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-lg);
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          min-width: 300px;
          max-width: 500px;
          cursor: pointer;
          pointer-events: all;
          transform: translateY(-20px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .toast.visible {
          transform: translateY(0);
          opacity: 1;
        }

        .toast.removing {
          transform: translateY(-20px);
          opacity: 0;
        }

        .toast-success {
          border-left: 4px solid #1ebe7e;
        }

        .toast-error {
          border-left: 4px solid #ef4444;
        }

        .toast-warning {
          border-left: 4px solid #f1b44c;
        }

        .toast-info {
          border-left: 4px solid var(--brand);
        }

        .toast-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          font-size: 1.2rem;
        }

        .toast-success .toast-icon {
          color: #1ebe7e;
        }

        .toast-error .toast-icon {
          color: #ef4444;
        }

        .toast-warning .toast-icon {
          color: #f1b44c;
        }

        .toast-info .toast-icon {
          color: var(--brand);
        }

        .toast-content {
          flex: 1;
        }

        .toast-content p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.4;
          font-weight: 500;
        }

        .toast-close {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          padding: var(--space-xs);
          border-radius: var(--radius-sm);
          transition: all var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toast-close:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .toast {
            min-width: unset;
            max-width: unset;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
