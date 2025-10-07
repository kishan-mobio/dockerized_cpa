import { createSlice } from "@reduxjs/toolkit";
import {
  fetchQuickbooksAccounts,
  updateQuickbooksAccountStatus,
  syncQuickbooksAccount,
  deleteQuickbooksAccount,
  getQuickbooksOAuthUrl,
} from "@/redux/Thunks/Quickbooks";

const initialState = {
  quickbooksAccounts: [],
  loading: false,
  error: null,
  oauthUrl: null,
  lastSynced: null,
};

const quickbooksAccountSlice = createSlice({
  name: "quickbooksAccount",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearOAuthUrl: (state) => {
      state.oauthUrl = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch accounts
    builder
      .addCase(fetchQuickbooksAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuickbooksAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.quickbooksAccounts = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchQuickbooksAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update status
    builder
      .addCase(updateQuickbooksAccountStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuickbooksAccountStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAccount = action.payload.data || action.payload;
        state.quickbooksAccounts = state.quickbooksAccounts.map((account) =>
          account.id === updatedAccount.id ? updatedAccount : account
        );
        state.error = null;
      })
      .addCase(updateQuickbooksAccountStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Sync account
    builder
      .addCase(syncQuickbooksAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncQuickbooksAccount.fulfilled, (state, action) => {
        state.loading = false;
        const syncedAccount = action.payload.data || action.payload;
        state.quickbooksAccounts = state.quickbooksAccounts.map((account) =>
          account.id === syncedAccount.id ? syncedAccount : account
        );
        state.lastSynced = new Date().toISOString();
        state.error = null;
      })
      .addCase(syncQuickbooksAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete account
    builder
      .addCase(deleteQuickbooksAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuickbooksAccount.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.data?.id || action.payload.id;
        state.quickbooksAccounts = state.quickbooksAccounts.filter(
          (account) => account.id !== deletedId
        );
        state.error = null;
      })
      .addCase(deleteQuickbooksAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get OAuth URL
    builder
      .addCase(getQuickbooksOAuthUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuickbooksOAuthUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.oauthUrl =
          action.payload.data?.oauth_url || action.payload.oauth_url;
        state.error = null;
      })
      .addCase(getQuickbooksOAuthUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearOAuthUrl } = quickbooksAccountSlice.actions;
export default quickbooksAccountSlice.reducer;
