import { createLogger } from './logger.utils.js';
import { DATE_ERROR_MESSAGES } from './constants/error.constants.js';
import { LOGGER_NAMES } from './constants/messages.constants.js';

const _logger = createLogger(LOGGER_NAMES.DATE_UTILS);

/**
 * Check if date is valid
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is valid
 */
export const isValidDate = (date) => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

/**
 * Get last month's date range (start and end dates)
 * @param {Date|string} [baseDate] - Base date to calculate from (defaults to current date)
 * @returns {Object} Object with startDate and endDate of last month in YYYY-MM-DD format
 */
export const getLastMonthDateRange = (baseDate = new Date()) => {
  try {
    const currentDate = new Date(baseDate);
    if (!isValidDate(currentDate)) {
      throw new Error(DATE_ERROR_MESSAGES.INVALID_DATE_PROVIDED);
    }

    // Get the first day of current month, then subtract 1 day to get last day of previous month
    const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth);
    lastDayOfPreviousMonth.setDate(0); // This sets it to the last day of previous month

    // Get the first day of previous month
    const firstDayOfPreviousMonth = new Date(lastDayOfPreviousMonth.getFullYear(), lastDayOfPreviousMonth.getMonth(), 1);

    // Format dates as YYYY-MM-DD
    const startDate = formatDateOnly(firstDayOfPreviousMonth);
    const endDate = formatDateOnly(lastDayOfPreviousMonth);

    _logger.info(`Generated last month date range: ${startDate} to ${endDate}`);

    return {
      startDate,
      endDate,
      startDateObj: firstDayOfPreviousMonth,
      endDateObj: lastDayOfPreviousMonth
    };
  } catch (error) {
    _logger.error('Error generating last month date range:', error.message);
    throw error;
  }
};


/**
 * Format date to show only the date part (YYYY-MM-DD)
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateOnly = (date) => {
  if (!date) return null;
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    throw new Error(DATE_ERROR_MESSAGES.INVALID_DATE);
  }
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Create a validated date range from start and end dates
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {Object} Object with startDate and endDate
 */
export const createValidatedDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime())) {
    throw new Error(DATE_ERROR_MESSAGES.INVALID_START_DATE);
  }
  
  if (isNaN(end.getTime())) {
    throw new Error(DATE_ERROR_MESSAGES.INVALID_END_DATE);
  }
  
  if (start > end) {
    throw new Error(DATE_ERROR_MESSAGES.START_DATE_AFTER_END_DATE);
  }
  
  return {
    startDate: start,
    endDate: end
  };
};

export default {
  isValidDate,
  getLastMonthDateRange,
  formatDateOnly,
  createValidatedDateRange,
};
