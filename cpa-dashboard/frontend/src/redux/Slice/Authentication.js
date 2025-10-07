import { createSlice } from "@reduxjs/toolkit";
import tokenStorage from "@/lib/tokenStorage";
import {
  login,
  refreshAuth,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from "@/redux/Thunks/Authentication";

const initialState = {
  user: tokenStorage.getAuthData()?.user || null,
  loading: false,
  error: null,
  isAuthenticated: !!tokenStorage.getAuthData()?.user, // ✅ derived at startup
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false; // ✅ reset
      tokenStorage.clearAuthData();
    },
  },
  extraReducers: (builder) => {
    // 🔹 Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true; // ✅ mark logged in
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false; // ✅ failed login
      });

    // 🔹 Refresh
    builder
      .addCase(refreshAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true; // ✅ still valid
      })
      .addCase(refreshAuth.rejected, (state, action) => {
        state.user = null;
        state.error = action.payload;
        state.isAuthenticated = false; // ✅ session expired
      });

    // 🔹 Get Profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true; // ✅ profile means logged in
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // 🔹 Update Profile
    builder
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
      });

    // 🔹 Change Password
    builder.addCase(changePassword.rejected, (state, action) => {
      state.error = action.payload;
    });

    // 🔹 Forgot Password
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.error = action.payload;
    });

    // 🔹 Reset Password
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export const { clearError, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
