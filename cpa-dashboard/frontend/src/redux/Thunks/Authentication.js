import { createAsyncThunk } from "@reduxjs/toolkit";
import tokenStorage from "@/lib/tokenStorage";
import { logoutSuccess } from "../Slice/Authentication";
import api from "../ApiService/ApiService";
import { AUTH_CONSTANTS } from "@/utils/constants/auth";

// 🔹 Login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      console.log(response);
      const { accessToken, refreshToken, user } = response.data.data;

      tokenStorage.setAuthData({ accessToken, refreshToken, user });
      return user;
    } catch (error) {
      let errorMessage = AUTH_CONSTANTS.ERRORS.LOGIN_FAILED;

      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            errorMessage = data.message || AUTH_CONSTANTS.ERRORS.LOGIN_FAILED;
            break;
          case 401:
            errorMessage = data.message || AUTH_CONSTANTS.ERRORS.LOGIN_FAILED;
            break;
          case 403:
            errorMessage =
              data.message ||
              AUTH_CONSTANTS.ERRORS.ACCOUNT_DEACTIVATED;
            break;
          case 429:
            errorMessage =
              data.message ||
              AUTH_CONSTANTS.ERRORS.TOO_MANY_ATTEMPTS;
            break;
          case 500:
            errorMessage = AUTH_CONSTANTS.ERRORS.SERVER_ERROR;
            break;
          default:
            errorMessage = data.message || AUTH_CONSTANTS.ERRORS.LOGIN_FAILED;
        }
      } else if (error.request) {
        errorMessage = AUTH_CONSTANTS.ERRORS.NETWORK_ERROR;
      } else {
        errorMessage = error.message || AUTH_CONSTANTS.ERRORS.LOGIN_FAILED;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 Refresh token
export const refreshAuth = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.post("/auth/refresh-token");
      const { accessToken, refreshToken, user } = data;

      tokenStorage.setAuthData({ accessToken, refreshToken, user });
      return user;
    } catch {
      tokenStorage.clearAuthData();
      return rejectWithValue(
        AUTH_CONSTANTS.ERRORS.SESSION_EXPIRED
      );
    }
  }
);

// 🔹 Get Profile
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await api.get("/auth/me");
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          AUTH_CONSTANTS.ERRORS.FAILED_TO_LOAD_PROFILE
      );
    }
  }
);

// 🔹 Update Profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      return await api.put(`/auth/profile/${userId}`, userData);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          AUTH_CONSTANTS.ERRORS.UPDATE_FAILED 
      );
    }
  }
);

// 🔹 Change Password
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    { oldPassword, newPassword, confirmPassword },
    { rejectWithValue }
  ) => {
    try {
      return await api.put("/auth/change-password", {
        oldPassword,
        newPassword,
        confirmPassword,
      });
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          AUTH_CONSTANTS.ERRORS.PASSWORD_CHANGE_FAILED 
      );
    }
  }
);

// 🔹 Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email, url }, { rejectWithValue }) => {
    try {
      return await api.post("/auth/forgot-password", { email, url });
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          AUTH_CONSTANTS.ERRORS.FAILED_TO_SEND_RESET_EMAIL
      );
    }
  }
);

// 🔹 Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      return await api.post("/auth/reset-password", {
        token,
        newPassword,
        confirmPassword,
      });
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          AUTH_CONSTANTS.ERRORS.PASSWORD_RESET_FAILED 
      );
    }
  }
);

// 🔹 Logout
export const logout = () => async (dispatch) => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    return rejectWithValue(
      err.response?.data?.message ||
        AUTH_CONSTANTS.ERRORS.LOGOUT_FAILED 
    );
  } finally {
    tokenStorage.clearAuthData();
    dispatch(logoutSuccess());
  }
};
