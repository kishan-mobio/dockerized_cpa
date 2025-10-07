import api from "@/redux/ApiService/ApiService";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all organizations
export const fetchOrganizations = createAsyncThunk(
  "organizations/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      return await api.get("/organizations", { params });
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create organization
export const createOrganization = createAsyncThunk(
  "organizations/create",
  async (data, { rejectWithValue }) => {
    try {
      return await api.post("/organizations", data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update organization
export const updateOrganization = createAsyncThunk(
  "organizations/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await api.put(`/organizations/${id}`, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete organization
export const deleteOrganization = createAsyncThunk(
  "organizations/delete",
  async (id, { rejectWithValue }) => {
    try {
      return await api.delete(`/organizations/${id}`);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get organization by ID
export const getOrganizationById = createAsyncThunk(
  "organizations/getById",
  async (id, { rejectWithValue }) => {
    try {
      return await api.get(`/organizations/${id}`);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
