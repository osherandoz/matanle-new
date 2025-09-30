import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useEventCheck } from '../../hooks/useEventCheck';
import { useToast } from '../Toast/Toast';
import './UserProfile.css';

const UserProfile = () => {
  const { user, userProfile, logout, isAuthenticated } = useAuth();
  const { currentEvent } = useEventCheck();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Don't render if user is not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      showSuccess('התנתקת בהצלחה');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      showError('שגיאה בהתנתקות');
    }
  };

  const handleSettingsClick = () => {
    setIsDropdownOpen(false);
    navigate('/settings');
  };

  const handleCreateEventClick = () => {
    setIsDropdownOpen(false);
    navigate('/create-event');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const getUserDisplayName = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    if (user.displayName) {
      return user.displayName;
    }
    if (userProfile?.firstName) {
      return userProfile.firstName;
    }
    return user.email?.split('@')[0] || 'משתמש';
  };

  const getCurrentEventName = () => {
    if (currentEvent?.eventName) {
      return currentEvent.eventName;
    }
    return 'אין אירוע פעיל';
  };

  return (
    <div className="user-profile" ref={dropdownRef}>
      {/* User Info Display */}
      <div 
        className="user-info"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {/* User Avatar */}
        <div className="user-avatar">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="User Avatar" 
              className="avatar-image"
            />
          ) : (
            <div className="avatar-initials">
              {getInitials(getUserDisplayName())}
            </div>
          )}
        </div>

        {/* User Details */}
        <div className="user-details">
          <div className="user-name">{getUserDisplayName()}</div>
          <div className="current-event">{getCurrentEventName()}</div>
        </div>

        {/* Dropdown Arrow */}
        <div className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>
          <i className="fa-solid fa-chevron-down"></i>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="user-dropdown">
          {/* User Info Section */}
          <div className="dropdown-section">
            <div className="dropdown-header">
              <div className="dropdown-avatar">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="User Avatar" 
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-initials">
                    {getInitials(getUserDisplayName())}
                  </div>
                )}
              </div>
              <div className="dropdown-user-info">
                <div className="dropdown-name">{getUserDisplayName()}</div>
                <div className="dropdown-email">{user.email}</div>
              </div>
            </div>
          </div>

          {/* Event Info Section */}
          {currentEvent && (
            <div className="dropdown-section">
              <div className="dropdown-divider"></div>
              <div className="event-info">
                <div className="event-label">אירוע נוכחי:</div>
                <div className="event-name">{currentEvent.eventName}</div>
                {currentEvent.eventDate && (
                  <div className="event-date">
                    <i className="fa-solid fa-calendar"></i>
                    {new Date(currentEvent.eventDate).toLocaleDateString('he-IL')}
                  </div>
                )}
                {currentEvent.eventType && (
                  <div className="event-type">
                    <i className="fa-solid fa-tag"></i>
                    {currentEvent.eventType}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="dropdown-section">
            <div className="dropdown-divider"></div>
            <div className="dropdown-actions">
              <button 
                className="dropdown-action"
                onClick={handleSettingsClick}
              >
                <i className="fa-solid fa-user-cog"></i>
                <span>הגדרות פרופיל</span>
              </button>
              
              <button 
                className="dropdown-action"
                onClick={handleCreateEventClick}
              >
                <i className="fa-solid fa-plus"></i>
                <span>צור אירוע חדש</span>
              </button>
              
              <button 
                className="dropdown-action logout"
                onClick={handleLogout}
              >
                <i className="fa-solid fa-sign-out-alt"></i>
                <span>התנתק</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
