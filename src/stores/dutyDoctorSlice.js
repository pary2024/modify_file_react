import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dutyDoctor from '../Services/dutyDoctor';

// Async thunks for each API call
export const fetchDutys = createAsyncThunk('dutyDoctor/fetchDutys', async (_, { rejectWithValue }) => {
  try {
    const response = await dutyDoctor.getDutys();
    return response.data.dutyDoctors;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchDuty = createAsyncThunk('dutyDoctor/fetchDuty', async (id, { rejectWithValue }) => {
  try {
    const response = await dutyDoctor.getDuty(id);
    return response.data.dutyDoctor;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const createDuty = createAsyncThunk('dutyDoctor/createDuty', async (data, { rejectWithValue }) => {
  try {
    const response = await dutyDoctor.createDuty(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateDuty = createAsyncThunk('dutyDoctor/updateDuty', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await dutyDoctor.updateDuty(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteDuty = createAsyncThunk('dutyDoctor/deleteDuty', async (id, { rejectWithValue }) => {
  try {
    await dutyDoctor.deleteDuty(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Slice definition
const dutyDoctorSlice = createSlice({
  name: 'duty',
  initialState: {
    duties: [],
    currentDuty: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all duties
    builder
      .addCase(fetchDutys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDutys.fulfilled, (state, action) => {
        state.loading = false;
        state.duties = action.payload;
      })
      .addCase(fetchDutys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch single duty
    builder
      .addCase(fetchDuty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDuty.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDuty = action.payload;
      })
      .addCase(fetchDuty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create duty
    builder
      .addCase(createDuty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDuty.fulfilled, (state, action) => {
        state.loading = false;
        state.duties.push(action.payload);
      })
      .addCase(createDuty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update duty
    builder
      .addCase(updateDuty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDuty.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.duties.findIndex((duty) => duty.id === action.payload.id);
        if (index !== -1) {
          state.duties[index] = action.payload;
        }
        if (state.currentDuty?.id === action.payload.id) {
          state.currentDuty = action.payload;
        }
      })
      .addCase(updateDuty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete duty
    builder
      .addCase(deleteDuty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDuty.fulfilled, (state, action) => {
        state.loading = false;
        state.duties = state.duties.filter((duty) => duty.id !== action.payload);
        if (state.currentDuty?.id === action.payload) {
          state.currentDuty = null;
        }
      })
      .addCase(deleteDuty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = dutyDoctorSlice.actions;
export default dutyDoctorSlice.reducer;