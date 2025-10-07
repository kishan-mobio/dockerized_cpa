// src/lib/auth.js
"use client";

import Cookies from "js-cookie";

const TOKEN_KEY = "authToken";

/**
 * Save token in cookies (works for SSR + Client)
 *
 * @param {string} token
 * @param {number} days - expiry days
 */
export const setToken = (token, days = 7) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: days,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
};

/**
 * Get token from cookies
 *
 * @returns {string|null}
 */
export const getToken = () => {
  return Cookies.get(TOKEN_KEY) || null;
};

/**
 * Remove token from cookies
 */
export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};

/**
 * Check if user is authenticated
 *
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!getToken();
};
