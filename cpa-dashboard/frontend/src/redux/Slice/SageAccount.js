import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSageAccounts,
  updateSageAccountStatus,
  syncSageAccount,
  createSageAccount,
  deleteSageAccount,
} from "../Thunks/sage";

const initialState = {
  sageAccounts: [],
  loading: false,
  error: null,
  lastSynced: null,
};

const sageAccountSlice = createSlice({
  name: "sageAccount",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch accounts
    builder
      .addCase(fetchSageAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSageAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.sageAccounts = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchSageAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update status
    builder
      .addCase(updateSageAccountStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSageAccountStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAccount = action.payload.data || action.payload;
        state.sageAccounts = state.sageAccounts.map((account) =>
          account.id === updatedAccount.id ? updatedAccount : account
        );
        state.error = null;
      })
      .addCase(updateSageAccountStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Sync account
    builder
      .addCase(syncSageAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncSageAccount.fulfilled, (state, action) => {
        state.loading = false;
        const syncedAccount = action.payload.data || action.payload;
        state.sageAccounts = state.sageAccounts.map((account) =>
          account.id === syncedAccount.id ? syncedAccount : account
        );
        state.lastSynced = new Date().toISOString();
        state.error = null;
      })
      .addCase(syncSageAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create account
    builder
      .addCase(createSageAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSageAccount.fulfilled, (state, action) => {
        state.loading = false;
        const newAccount = action.payload.data || action.payload;
        state.sageAccounts.push(newAccount);
        state.error = null;
      })
      .addCase(createSageAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete account
    builder
      .addCase(deleteSageAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSageAccount.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.data?.id || action.payload.id;
        state.sageAccounts = state.sageAccounts.filter(
          (account) => account.id !== deletedId
        );
        state.error = null;
      })
      .addCase(deleteSageAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = sageAccountSlice.actions;
export default sageAccountSlice.reducer;
