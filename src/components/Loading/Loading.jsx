import React from 'react';

// Skeleton loader for cards
export const SkeletonCard = ({ height = '200px' }) => (
  <div className="skeleton-card" style={{ height }}>
    <div className="skeleton-header">
      <div className="skeleton-circle"></div>
      <div className="skeleton-lines">
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
      </div>
    </div>
    <div className="skeleton-content">
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
    </div>

    <style jsx>{`
      .skeleton-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: var(--radius-lg);
        padding: var(--space-lg);
        border: 1px solid rgba(255, 255, 255, 0.1);
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      .skeleton-header {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        margin-bottom: var(--space-lg);
      }

      .skeleton-circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
      }

      .skeleton-lines {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
      }

      .skeleton-content {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
      }

      .skeleton-line {
        height: 12px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-sm);
        width: 100%;
      }

      .skeleton-line.short {
        width: 60%;
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `}</style>
  </div>
);

// Skeleton loader for table rows
export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="skeleton-table">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="skeleton-row">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div key={colIndex} className="skeleton-cell">
            <div className="skeleton-line"></div>
          </div>
        ))}
      </div>
    ))}

    <style jsx>{`
      .skeleton-table {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
      }

      .skeleton-row {
        display: grid;
        grid-template-columns: repeat(${columns}, 1fr);
        gap: var(--space-md);
        padding: var(--space-md);
        background: rgba(255, 255, 255, 0.05);
        border-radius: var(--radius-md);
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      .skeleton-cell {
        display: flex;
        align-items: center;
      }

      .skeleton-line {
        height: 12px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-sm);
        width: 80%;
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `}</style>
  </div>
);

// Spinner loader
export const Spinner = ({ size = '40px', color = 'var(--brand)' }) => (
  <div className="spinner" style={{ width: size, height: size }}>
    <div className="spinner-ring" style={{ borderTopColor: color }}></div>
    
    <style jsx>{`
      .spinner {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .spinner-ring {
        width: 100%;
        height: 100%;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top: 3px solid ${color};
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </div>
);

// Full page loading overlay
export const LoadingOverlay = ({ message = 'טוען...' }) => (
  <div className="loading-overlay">
    <div className="loading-content">
      <Spinner size="60px" />
      <p>{message}</p>
    </div>

    <style jsx>{`
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }

      .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-lg);
        padding: var(--space-xl);
        background: rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-xl);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .loading-content p {
        margin: 0;
        color: var(--text);
        font-size: 1.1rem;
        font-weight: 500;
      }
    `}</style>
  </div>
);

// Button loading state
export const ButtonLoader = ({ size = '16px' }) => (
  <Spinner size={size} color="currentColor" />
);

// Page loading component
export const PageLoader = ({ message = 'טוען תוכן...' }) => (
  <div className="page-loader">
    <div className="loader-content">
      <Spinner size="50px" />
      <h3>{message}</h3>
    </div>

    <style jsx>{`
      .page-loader {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        padding: var(--space-xl);
      }

      .loader-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-lg);
        text-align: center;
      }

      .loader-content h3 {
        margin: 0;
        color: var(--text-secondary);
        font-size: 1.1rem;
        font-weight: 500;
      }
    `}</style>
  </div>
);

export default {
  SkeletonCard,
  SkeletonTable,
  Spinner,
  LoadingOverlay,
  ButtonLoader,
  PageLoader
};
