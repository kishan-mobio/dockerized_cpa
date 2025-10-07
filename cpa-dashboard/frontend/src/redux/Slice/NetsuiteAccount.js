import { createSlice } from "@reduxjs/toolkit";
import {
  deleteNetsuiteAccount,
  fetchNetsuiteAccounts,
  updateNetsuiteAccountStatus,
  syncNetsuiteAccount,
  createNetsuiteAccount,
} from "../Thunks/netsuiteAccounts";

const initialState = {
  netsuiteAccounts: [],
  loading: false,
  error: null,
  lastSynced: null,
};

const netsuiteAccountSlice = createSlice({
  name: "netsuiteAccount",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch accounts
    builder
      .addCase(fetchNetsuiteAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNetsuiteAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.netsuiteAccounts = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchNetsuiteAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update status
    builder
      .addCase(updateNetsuiteAccountStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNetsuiteAccountStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAccount = action.payload.data || action.payload;
        state.netsuiteAccounts = state.netsuiteAccounts.map((account) =>
          account.id === updatedAccount.id ? updatedAccount : account
        );
        state.error = null;
      })
      .addCase(updateNetsuiteAccountStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Sync account
    builder
      .addCase(syncNetsuiteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncNetsuiteAccount.fulfilled, (state, action) => {
        state.loading = false;
        const syncedAccount = action.payload.data || action.payload;
        state.netsuiteAccounts = state.netsuiteAccounts.map((account) =>
          account.id === syncedAccount.id ? syncedAccount : account
        );
        state.lastSynced = new Date().toISOString();
        state.error = null;
      })
      .addCase(syncNetsuiteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create account
    builder
      .addCase(createNetsuiteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNetsuiteAccount.fulfilled, (state, action) => {
        state.loading = false;
        const newAccount = action.payload.data || action.payload;
        state.netsuiteAccounts.push(newAccount);
        state.error = null;
      })
      .addCase(createNetsuiteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete account
    builder
      .addCase(deleteNetsuiteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNetsuiteAccount.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.data?.id || action.payload.id;
        state.netsuiteAccounts = state.netsuiteAccounts.filter(
          (account) => account.id !== deletedId
        );
        state.error = null;
      })
      .addCase(deleteNetsuiteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = netsuiteAccountSlice.actions;
export default netsuiteAccountSlice.reducer;
