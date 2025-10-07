import { COOKIE_CONFIG } from './constants/config.constants.js';

export const getSecureCookieOptions = (options = {}) => {
  const defaultOptions = {
    httpOnly: COOKIE_OPTIONS.HTTP_ONLY,
    secure: process.env.NODE_ENV === COOKIE_OPTIONS.SECURE,
    sameSite: COOKIE_OPTIONS.SAME_SITE,
    maxAge: COOKIE_CONFIG.MAX_AGE,
    path: COOKIE_STRINGS.PATH,
  };

  return { ...defaultOptions, ...options };
};

export const setAccessTokenCookie = (res, token, options = {}) => {
  const cookieOptions = getSecureCookieOptions({
    maxAge: COOKIE_CONFIG.ACCESS_MAX_AGE,
    ...options,
  });

  res.cookie(COOKIE_STRINGS.ACCESS_TOKEN, token, cookieOptions);
};

export const setRefreshTokenCookie = (res, token, options = {}) => {
  const cookieOptions = getSecureCookieOptions({
    maxAge: COOKIE_CONFIG.REFRESH_MAX_AGE,
    ...options,
  });

  res.cookie(COOKIE_STRINGS.REFRESH_TOKEN, token, cookieOptions);
};

export const clearAccessTokenCookie = (res) => {
  res.clearCookie(COOKIE_STRINGS.ACCESS_TOKEN, { path: COOKIE_STRINGS.PATH });
};

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie(COOKIE_STRINGS.REFRESH_TOKEN, { path: COOKIE_STRINGS.PATH });
};

export const clearAllAuthCookies = (res) => {
  clearAccessTokenCookie(res);
  clearRefreshTokenCookie(res);
};

export const getCookie = (req, name) => {
  return req.cookies?.[name] ? req.cookies[name] : req.signedCookies?.[name];
};

export const setCookie = (res, name, value, options = {}) => {
  const cookieOptions = getSecureCookieOptions(options);
  res.cookie(name, value, cookieOptions);
};

export const clearCookie = (res, name, options = {}) => {
  const cookieOptions = getSecureCookieOptions(options);
  res.clearCookie(name, cookieOptions);
};

export default {
  getSecureCookieOptions,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAccessTokenCookie,
  clearRefreshTokenCookie,
  clearAllAuthCookies,
  getCookie,
  setCookie,
  clearCookie
};
