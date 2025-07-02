import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import company from '../Services/company';

export const fetchCompanies = createAsyncThunk(
  'company/fetchCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await company.getCompanys();
      return response.data.companies;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCompany = createAsyncThunk(
  'company/fetchCompany',
  async (id, { rejectWithValue }) => {
    try {
      const response = await company.getCompany(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCompany = createAsyncThunk(
  'company/createCompany',
  async (data, { rejectWithValue }) => {
    try {
      const response = await company.createCompany(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCompany = createAsyncThunk(
  'company/updateCompany',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await company.updateCompany(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  'company/deleteCompany',
  async (id, { rejectWithValue }) => {
    try {
      await company.deleteCompany(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState: {
    companies: [],
    company: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Companies
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Company
      .addCase(fetchCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Company
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies.push(action.payload);
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Company
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.companies.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
        if (state.company?.id === action.payload.id) {
          state.company = action.payload;
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Company
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.filter(c => c.id !== action.payload);
        if (state.company?.id === action.payload) {
          state.company = null;
        }
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = companySlice.actions;
export default companySlice.reducer;