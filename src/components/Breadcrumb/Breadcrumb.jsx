import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  
  const getBreadcrumbs = (pathname) => {
    const routes = {
      '/dashboard': { name: 'דשבורד', icon: 'fa-gauge' },
      '/event': { name: 'פרטי אירוע', icon: 'fa-calendar-days' },
      '/expenses': { name: 'מעקב הוצאות', icon: 'fa-chart-line' },
      '/tasks': { name: 'משימות', icon: 'fa-list-check' },
      '/guests': { name: 'מוזמנים', icon: 'fa-users' },
      '/gifts': { name: 'מתנות', icon: 'fa-gifts' },
      '/settings': { name: 'הגדרות', icon: 'fa-gear' }
    };

    const breadcrumbs = [];
    
    // Always add home (dashboard) if not on dashboard
    if (pathname !== '/dashboard') {
      breadcrumbs.push({
        path: '/dashboard',
        name: 'דשבורד',
        icon: 'fa-gauge',
        isActive: false
      });
    }
    
    // Add current page
    const currentRoute = routes[pathname];
    if (currentRoute) {
      breadcrumbs.push({
        path: pathname,
        name: currentRoute.name,
        icon: currentRoute.icon,
        isActive: true
      });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(location.pathname);

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs on dashboard or single-level pages
  }

  return (
    <div className="breadcrumb">
      <nav className="breadcrumb-nav">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            {index > 0 && (
              <span className="breadcrumb-separator">
                <i className="fa-solid fa-chevron-left"></i>
              </span>
            )}
            {crumb.isActive ? (
              <span className="breadcrumb-item active">
                <i className={`fa-solid ${crumb.icon}`}></i>
                {crumb.name}
              </span>
            ) : (
              <Link to={crumb.path} className="breadcrumb-item">
                <i className={`fa-solid ${crumb.icon}`}></i>
                {crumb.name}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      <style jsx>{`
        .breadcrumb {
          margin-bottom: var(--space-lg);
        }

        .breadcrumb-nav {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-lg);
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all var(--transition);
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-sm);
        }

        .breadcrumb-item:hover {
          color: var(--text);
          background: rgba(255, 255, 255, 0.1);
        }

        .breadcrumb-item.active {
          color: var(--brand);
          background: rgba(124, 92, 255, 0.1);
          cursor: default;
        }

        .breadcrumb-separator {
          color: var(--text-secondary);
          font-size: 0.8rem;
          opacity: 0.6;
        }

        .breadcrumb-item i {
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .breadcrumb-nav {
            padding: var(--space-sm) var(--space-md);
          }

          .breadcrumb-item {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Breadcrumb;
