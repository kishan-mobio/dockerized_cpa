export const API_CONFIG = {
  // Default pagination settings
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // Request timeouts
  DEFAULT_TIMEOUT: 10000,
  UPLOAD_TIMEOUT: 60000,

  // Retry settings
  DEFAULT_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,

  // Cache settings
  DEFAULT_CACHE_TIME: 5 * 60 * 1000, // 5 minutes
  DEFAULT_STALE_TIME: 2 * 60 * 1000, // 2 minutes
};