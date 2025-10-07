import { STORAGE_KEYS } from "@/utils/constants/token";

/**
 * Check if localStorage is available (client-side only)
 * @returns {boolean} True if localStorage is available
 */
const isLocalStorageAvailable = () => {
  return typeof window !== "undefined" && window.localStorage;
};

/**
 * Token storage utility for localStorage operations
 */
export const tokenStorage = {
  /**
   * Store access token in localStorage
   * @param {string} token - Access token
   */
  setAccessToken: (token) => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      }
    } catch (error) {
      console.error("Error storing access token:", error);
    }
  },

  /**
   * Get access token from localStorage
   * @returns {string|null} Access token or null
   */
  getAccessToken: () => {
    try {
      if (isLocalStorageAvailable()) {
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      }
      return null;
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  },

  /**
   * Store refresh token in localStorage
   * @param {string} token - Refresh token
   */
  setRefreshToken: (token) => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
      }
    } catch (error) {
      console.error("Error storing refresh token:", error);
    }
  },

  /**
   * Get refresh token from localStorage
   * @returns {string|null} Refresh token or null
   */
  getRefreshToken: () => {
    try {
      if (isLocalStorageAvailable()) {
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      }
      return null;
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  },

  /**
   * Store reset token in localStorage
   * @param {string} token - Reset token
   */
  setResetToken: (token) => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(STORAGE_KEYS.RESET_TOKEN, token);
      }
    } catch (error) {
      console.error("Error storing reset token:", error);
    }
  },

  /**
   * Get reset token from localStorage
   * @returns {string|null} Reset token or null
   */
  getResetToken: () => {
    try {
      if (isLocalStorageAvailable()) {
        return localStorage.getItem(STORAGE_KEYS.RESET_TOKEN);
      }
      return null;
    } catch (error) {
      console.error("Error getting reset token:", error);
      return null;
    }
  },

  /**
   * Store user data in localStorage
   * @param {Object} userData - User data object
   */
  setUserData: (userData) => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  },

  /**
   * Get user data from localStorage
   * @returns {Object|null} User data object or null
   */
  getUserData: () => {
    try {
      if (isLocalStorageAvailable()) {
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        return userData ? JSON.parse(userData) : null;
      }
      return null;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  },

  /**
   * Store all authentication data
   * @param {Object} authData - Authentication data object
   */
  setAuthData: (authData) => {
    const { accessToken, refreshToken, user, resetToken } = authData;

    if (accessToken) {
      tokenStorage.setAccessToken(accessToken);
    }

    if (refreshToken) {
      tokenStorage.setRefreshToken(refreshToken);
    }

    if (resetToken) {
      tokenStorage.setResetToken(resetToken);
    }

    if (user) {
      tokenStorage.setUserData(user);
    }
  },

  /**
   * Get all authentication data
   * @returns {Object} Authentication data object
   */
  getAuthData: () => {
    return {
      accessToken: tokenStorage.getAccessToken(),
      refreshToken: tokenStorage.getRefreshToken(),
      resetToken: tokenStorage.getResetToken(),
      user: tokenStorage.getUserData(),
    };
  },

  /**
   * Clear all authentication data from localStorage
   */
  clearAuthData: () => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.RESET_TOKEN);
      }
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  isAuthenticated: () => {
    const accessToken = tokenStorage.getAccessToken();
    const user = tokenStorage.getUserData();
    return !!(accessToken && user);
  },

  /**
   * Get user role
   * @returns {string|null} User role or null
   */
  getUserRole: () => {
    const user = tokenStorage.getUserData();
    return user?.role?.name || null;
  },

  /**
   * Check if token is expired
   * @param {string} token - JWT token
   * @returns {boolean} True if token is expired
   */
  isTokenExpired: (token) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  },

  /**
   * Check if access token is expired
   * @returns {boolean} True if access token is expired
   */
  isAccessTokenExpired: () => {
    const accessToken = tokenStorage.getAccessToken();
    return tokenStorage.isTokenExpired(accessToken);
  },

  /**
   * Check if refresh token is expired
   * @returns {boolean} True if refresh token is expired
   */
  isRefreshTokenExpired: () => {
    const refreshToken = tokenStorage.getRefreshToken();
    return tokenStorage.isTokenExpired(refreshToken);
  },
};

export default tokenStorage;
