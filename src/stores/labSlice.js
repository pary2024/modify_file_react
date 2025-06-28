import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import lab from '../service/lab';

// Async thunks for each API call
export const fetchLabs = createAsyncThunk('lab/fetchLabs', async (_, { rejectWithValue }) => {
  try {
    const response = await lab.getLabs();
    return response.data.labs;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchLab = createAsyncThunk('lab/fetchLab', async (id, { rejectWithValue }) => {
  try {
    const response = await lab.getLab(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const createLab = createAsyncThunk('lab/createLab', async (data, { rejectWithValue }) => {
  try {
    const response = await lab.createLab(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateLab = createAsyncThunk('lab/updateLab', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await lab.updateLab(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteLab = createAsyncThunk('lab/deleteLab', async (id, { rejectWithValue }) => {
  try {
    await lab.deleteLab(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Slice definition
const labSlice = createSlice({
  name: 'lab',
  initialState: {
    labs: [],
    currentLab: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all labs
    builder
      .addCase(fetchLabs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLabs.fulfilled, (state, action) => {
        state.loading = false;
        state.labs = action.payload;
      })
      .addCase(fetchLabs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch single lab
    builder
      .addCase(fetchLab.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLab.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLab = action.payload;
      })
      .addCase(fetchLab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create lab
    builder
      .addCase(createLab.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLab.fulfilled, (state, action) => {
        state.loading = false;
        state.labs.push(action.payload);
      })
      .addCase(createLab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update lab
    builder
      .addCase(updateLab.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLab.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.labs.findIndex((lab) => lab.id === action.payload.id);
        if (index !== -1) {
          state.labs[index] = action.payload;
        }
        if (state.currentLab?.id === action.payload.id) {
          state.currentLab = action.payload;
        }
      })
      .addCase(updateLab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete lab
    builder
      .addCase(deleteLab.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLab.fulfilled, (state, action) => {
        state.loading = false;
        state.labs = state.labs.filter((lab) => lab.id !== action.payload);
        if (state.currentLab?.id === action.payload) {
          state.currentLab = null;
        }
      })
      .addCase(deleteLab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = labSlice.actions;
export default labSlice.reducer;