import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import pay from '../service/pay';

// Async Thunks
export const fetchPays = createAsyncThunk(
  'pays/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await pay.getPays();
      return response.data.pays;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
    }
  }
);

export const fetchPayById = createAsyncThunk(
  'pays/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await pay.getPay(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment by ID');
    }
  }
);

export const createPay = createAsyncThunk(
  'pays/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await pay.createPay(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create payment');
    }
  }
);

export const updatePay = createAsyncThunk(
  'pays/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await pay.updatePay(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update payment');
    }
  }
);

export const deletePay = createAsyncThunk(
  'pays/delete',
  async (id, { rejectWithValue }) => {
    try {
      await pay.deletePay(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete payment');
    }
  }
);

// Slice
const paySlice = createSlice({
  name: 'pay',
  initialState: {
    pays: [],
    pay: null,
    status: 'idle',
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all payments
      .addCase(fetchPays.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPays.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.pays = action.payload;
      })
      .addCase(fetchPays.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch payment by ID
      .addCase(fetchPayById.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.pay = action.payload;
      })
      .addCase(fetchPayById.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })

      // Create payment
      .addCase(createPay.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(createPay.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.pays.push(action.payload);
      })
      .addCase(createPay.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })

      // Update payment
      .addCase(updatePay.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePay.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        const index = state.pays.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.pays[index] = action.payload;
        }
      })
      .addCase(updatePay.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })

      // Delete payment
      .addCase(deletePay.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePay.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.pays = state.pays.filter(p => p.id !== action.payload);
      })
      .addCase(deletePay.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default paySlice.reducer;