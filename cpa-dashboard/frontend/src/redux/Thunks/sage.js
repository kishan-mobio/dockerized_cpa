import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/redux/ApiService/ApiService";

// Fetch Sage accounts
export const fetchSageAccounts = createAsyncThunk(
  "sage/fetchAccounts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = api.get("/sage/accounts", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

// Update Sage account status
export const updateSageAccountStatus = createAsyncThunk(
  "sage/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/sage/accounts/${id}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

// Sync Sage account
export const syncSageAccount = createAsyncThunk(
  "sage/syncAccount",
  async ({ id, organization_id }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/sage/accounts/${id}/sync`, {
        organization_id,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message 
      );
    }
  }
);

// Create Sage account
export const createSageAccount = createAsyncThunk(
  "sage/createAccount",
  async (accountData, { rejectWithValue }) => {
    try {
      const response = api.post("/sage/accounts", accountData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

// Delete Sage account
export const deleteSageAccount = createAsyncThunk(
  "sage/deleteAccount",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/sage/accounts/${id}`);
      return { ...response.data, id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message 
      );
    }
  }
);
