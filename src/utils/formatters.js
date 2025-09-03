// Number formatting
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatCurrency = (amount, currency = '₪') => {
  return `${currency}${amount.toLocaleString('he-IL')}`;
};

export const formatPercentage = (value) => {
  return `${value}%`;
};

// Date formatting
export const formatDate = (date) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'Asia/Jerusalem'
  };
  return new Date(date).toLocaleDateString('he-IL', options);
};

export const formatTime = (date) => {
  const options = { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'Asia/Jerusalem'
  };
  return new Date(date).toLocaleTimeString('he-IL', options);
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `לפני ${days} ימים`;
  } else if (hours > 0) {
    return `לפני ${hours} שעות`;
  } else if (minutes > 0) {
    return `לפני ${minutes} דקות`;
  } else {
    return 'עכשיו';
  }
};

// Text formatting
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Status formatting
export const getStatusColor = (status) => {
  const statusMap = {
    'active': 'success',
    'pending': 'warning',
    'inactive': 'dim',
    'error': 'danger',
    'success': 'success',
    'warning': 'warning',
    'danger': 'danger',
    'dim': 'dim'
  };
  return statusMap[status] || 'dim';
};

export const getStatusText = (status) => {
  const statusMap = {
    'active': 'פעיל',
    'pending': 'ממתין',
    'inactive': 'לא פעיל',
    'error': 'שגיאה',
    'success': 'הצלחה',
    'warning': 'אזהרה',
    'danger': 'סכנה',
    'dim': 'עמום'
  };
  return statusMap[status] || status;
};

