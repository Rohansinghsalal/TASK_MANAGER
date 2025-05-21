/**
 * Format a date to the local date string (MM/DD/YYYY)
 * @param {string|Date} date - The date to format
 * @param {boolean} includeTime - Whether to include time in the output
 * @returns {string} The formatted date string or 'N/A' if input is invalid
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) {
    console.log("Date formatting received null/undefined value");
    return 'N/A';
  }
  
  try {
    // Handle ISO string format from backend
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      console.log(`Invalid date format received: ${date}`);
      return 'N/A';
    }
    
    const options = includeTime 
      ? { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      : { year: 'numeric', month: 'short', day: 'numeric' };
    
    return dateObj.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting date:', error, 'Original value:', date);
    return 'N/A';
  }
};

/**
 * Convert a date to ISO string format for API requests
 * @param {string|Date} date - The date to convert
 * @returns {string|null} The ISO string or null if input is invalid
 */
export const toISOString = (date) => {
  if (!date) return null;
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return null;
    
    // Format as yyyy-MM-dd'T'HH:mm:ss to match backend expected format
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('Error converting to ISO:', error);
    return null;
  }
};

/**
 * Format a datetime string to local date-time format for form inputs
 * @param {string|Date} datetime - The datetime to format
 * @returns {string} The formatted datetime string for datetime-local inputs or empty string
 */
export const formatForDateTimeInput = (datetime) => {
  if (!datetime) return '';
  
  try {
    const dateObj = new Date(datetime);
    if (isNaN(dateObj.getTime())) return '';
    
    // Format as YYYY-MM-DDThh:mm
    return dateObj.toISOString().slice(0, 16);
  } catch (error) {
    console.error('Error formatting for input:', error);
    return '';
  }
};

/**
 * Get a relative time string (e.g., "2 days ago")
 * @param {string|Date} datetime - The datetime to format
 * @returns {string} The relative time string or 'N/A' if input is invalid
 */
export const getRelativeTimeString = (datetime) => {
  if (!datetime) return 'N/A';
  
  try {
    const dateObj = new Date(datetime);
    if (isNaN(dateObj.getTime())) return 'N/A';
    
    // Use RelativeTimeFormat if available
    if (typeof Intl !== 'undefined' && Intl.RelativeTimeFormat) {
      const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
      const now = new Date();
      const diffInSeconds = Math.floor((dateObj - now) / 1000);
      
      // Determine the appropriate unit
      if (Math.abs(diffInSeconds) < 60) {
        return rtf.format(diffInSeconds, 'second');
      } else if (Math.abs(diffInSeconds) < 3600) {
        return rtf.format(Math.floor(diffInSeconds / 60), 'minute');
      } else if (Math.abs(diffInSeconds) < 86400) {
        return rtf.format(Math.floor(diffInSeconds / 3600), 'hour');
      } else if (Math.abs(diffInSeconds) < 2592000) {
        return rtf.format(Math.floor(diffInSeconds / 86400), 'day');
      } else if (Math.abs(diffInSeconds) < 31536000) {
        return rtf.format(Math.floor(diffInSeconds / 2592000), 'month');
      } else {
        return rtf.format(Math.floor(diffInSeconds / 31536000), 'year');
      }
    }
    
    // Fallback to standard format
    return dateObj.toLocaleString();
  } catch (error) {
    console.error('Error getting relative time:', error);
    return 'N/A';
  }
}; 