import { createSlice } from "@reduxjs/toolkit";
import {
  fetchOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationById,
} from "@/redux/Thunks/Organization";

const initialState = {
  organizations: [],
  selectedOrganization: null,
  currentOrganization: null,
  loading: false,
  error: null,
  totalCount: 0,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    setSelectedOrganization: (state, action) => {
      state.selectedOrganization = action.payload;
    },
    clearSelectedOrganization: (state) => {
      state.selectedOrganization = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetOrganizations: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch organizations
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = action.payload.data || action.payload;
        state.totalCount = action.payload.total || state.organizations.length;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create organization
      .addCase(createOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations.push(action.payload.data || action.payload);
      })
      .addCase(createOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update organization
      .addCase(updateOrganization.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrg = action.payload.data || action.payload;
        state.organizations = state.organizations.map((org) =>
          org.id === updatedOrg.id ? updatedOrg : org
        );
        if (state.selectedOrganization?.id === updatedOrg.id) {
          state.selectedOrganization = updatedOrg;
        }
      })
      .addCase(updateOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete organization
      .addCase(deleteOrganization.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.data?.id || action.payload.id;
        state.organizations = state.organizations.filter(
          (org) => org.id !== deletedId
        );
        if (state.selectedOrganization?.id === deletedId) {
          state.selectedOrganization = null;
        }
      })
      .addCase(deleteOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get organization by ID
      .addCase(getOrganizationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrganization = action.payload.data || action.payload;
      })
      .addCase(getOrganizationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedOrganization,
  clearSelectedOrganization,
  clearError,
  resetOrganizations,
} = organizationsSlice.actions;

export default organizationsSlice.reducer;
