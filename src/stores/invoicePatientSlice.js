import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import invoicePatient from '../Services/invoicePatient';

// Async Thunks
export const fetchInvoicePatients = createAsyncThunk(
  'invoicePatient/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await invoicePatient.getInvoicePatients();
      return response.data.invoicePatients;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoice patients');
    }
  }
);

export const fetchInvoicePatientById = createAsyncThunk(
  'invoicePatient/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await invoicePatient.getInvoicePatient(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoice patient by ID');
    }
  }
);

export const createInvoicePatient = createAsyncThunk(
  'invoicePatient/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await invoicePatient.createInvoicePatient(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create invoice patient');
    }
  }
);

export const updateInvoicePatient = createAsyncThunk(
  'invoicePatient/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await invoicePatient.updateInvoicePatient(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update invoice patient');
    }
  }
);

export const deleteInvoicePatient = createAsyncThunk(
  'invoicePatient/delete',
  async (id, { rejectWithValue }) => {
    try {
      await invoicePatient.deleteInvoicePatient(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete invoice patient');
    }
  }
);

// Slice
const invoicePatientSlice = createSlice({
  name: 'invoicePatient',
  initialState: {
    invoicePatients: [],
    invoicePatient: null,
    status: 'idle',
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all invoice patients
      .addCase(fetchInvoicePatients.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoicePatients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.invoicePatients = action.payload;
      })
      .addCase(fetchInvoicePatients.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch invoice patient by ID
      .addCase(fetchInvoicePatientById.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoicePatientById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.invoicePatient = action.payload;
      })
      .addCase(fetchInvoicePatientById.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })

      // Create invoice patient
      .addCase(createInvoicePatient.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoicePatient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.invoicePatients.push(action.payload);
      })
      .addCase(createInvoicePatient.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })

      // Update invoice patient
      .addCase(updateInvoicePatient.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoicePatient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        const index = state.invoicePatients.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.invoicePatients[index] = action.payload;
        }
      })
      .addCase(updateInvoicePatient.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })

      // Delete invoice patient
      .addCase(deleteInvoicePatient.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvoicePatient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.invoicePatients = state.invoicePatients.filter(inv => inv.id !== action.payload);
      })
      .addCase(deleteInvoicePatient.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default invoicePatientSlice.reducer;