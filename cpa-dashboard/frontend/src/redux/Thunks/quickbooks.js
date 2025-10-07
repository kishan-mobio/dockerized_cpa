import api from "@/redux/ApiService/ApiService";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch QuickBooks accounts
export const fetchQuickbooksAccounts = createAsyncThunk(
  "quickbooksAccount/fetchAccounts",
  async ({ organization_id }, { rejectWithValue }) => {
    try {
      return await api.get("/quickbooks/accounts", {
        params: { organization_id },
      });
    } catch (error) {
      return rejectWithValue(
        error.response?.data )
    }
  }
);

// Update QuickBooks account status
export const updateQuickbooksAccountStatus = createAsyncThunk(
  "quickbooksAccount/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await api.patch(`/quickbooks/accounts/${id}/status`, {
        status,
      });
    } catch (error) {
      return rejectWithValue(
        error.response?.data 
      );
    }
  }
);

// Sync QuickBooks account
export const syncQuickbooksAccount = createAsyncThunk(
  "quickbooksAccount/syncAccount",
  async ({ id, organization_id }, { rejectWithValue }) => {
    try {
      return await api.post(`/quickbooks/accounts/${id}/sync`, {
        organization_id,
      });
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Delete QuickBooks account
export const deleteQuickbooksAccount = createAsyncThunk(
  "quickbooksAccount/deleteAccount",
  async ({ id }, { rejectWithValue }) => {
    try {
      return await api.delete(`/quickbooks/accounts/${id}`);
    } catch (error) {
      return rejectWithValue(
        error.response?.data 
      );
    }
  }
);

// Get QuickBooks OAuth URL
export const getQuickbooksOAuthUrl = createAsyncThunk(
  "quickbooksAccount/getOAuthUrl",
  async (_, { rejectWithValue }) => {
    try {
      return await api.get("/quickbooks/oauth-url");
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
