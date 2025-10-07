import api from "@/redux/ApiService/ApiService";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch accounts
export const fetchNetsuiteAccounts = createAsyncThunk(
  "netsuite/fetchAccounts",
  async (params, { rejectWithValue }) => {
    try {
      return await api.get("/netsuite/accounts", { params });
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Update account status
export const updateNetsuiteAccountStatus = createAsyncThunk(
  "netsuite/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await api.patch(`/netsuite/accounts/${id}/status`, { status });
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Sync account
export const syncNetsuiteAccount = createAsyncThunk(
  "netsuite/syncAccount",
  async ({ id, organization_id }, { rejectWithValue }) => {
    try {
      return await api.post(`/netsuite/accounts/${id}/sync`, {
        organization_id,
      });
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Create account
export const createNetsuiteAccount = createAsyncThunk(
  "netsuite/createAccount",
  async (accountData, { rejectWithValue }) => {
    try {
      return await api.post("/netsuite/accounts", accountData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Delete account
export const deleteNetsuiteAccount = createAsyncThunk(
  "netsuite/deleteAccount",
  async (id, { rejectWithValue }) => {
    try {
      return await api.delete(`/netsuite/accounts/${id}`);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
