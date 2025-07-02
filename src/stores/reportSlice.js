import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import report from '../Services/report';

export const fetchReports = createAsyncThunk(
  'report/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await report.getReports();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    data: {
      patients: [],
      payments: [],
      appointments: [],
      companies: [],
    },
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
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = reportSlice.actions;
export default reportSlice.reducer;