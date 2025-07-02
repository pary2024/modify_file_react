import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import material from '../Services/material';

// Async thunks for each API call
export const fetchMaterials = createAsyncThunk('material/fetchMaterials', async (_, { rejectWithValue }) => {
  try {
    const response = await material.getMaterails();
    return response.data.materials;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchMaterial = createAsyncThunk('material/fetchMaterial', async (id, { rejectWithValue }) => {
  try {
    const response = await material.getMaterail(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const createMaterial = createAsyncThunk('material/createMaterial', async (data, { rejectWithValue }) => {
  try {
    const response = await material.createMaterail(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateMaterial = createAsyncThunk('material/updateMaterial', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await material.updateMaterail(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteMaterial = createAsyncThunk('material/deleteMaterial', async (id, { rejectWithValue }) => {
  try {
    await material.deleteMaterail(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Slice definition
const materialSlice = createSlice({
  name: 'material',
  initialState: {
    materials: [],
    currentMaterial: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all materials
    builder
      .addCase(fetchMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.materials = action.payload;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch single material
    builder
      .addCase(fetchMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMaterial = action.payload;
      })
      .addCase(fetchMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create material
    builder
      .addCase(createMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.materials.push(action.payload);
      })
      .addCase(createMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update material
    builder
      .addCase(updateMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMaterial.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.materials.findIndex((material) => material.id === action.payload.id);
        if (index !== -1) {
          state.materials[index] = action.payload;
        }
        if (state.currentMaterial?.id === action.payload.id) {
          state.currentMaterial = action.payload;
        }
      })
      .addCase(updateMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete material
    builder
      .addCase(deleteMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.materials = state.materials.filter((material) => material.id !== action.payload);
        if (state.currentMaterial?.id === action.payload) {
          state.currentMaterial = null;
        }
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = materialSlice.actions;
export default materialSlice.reducer;