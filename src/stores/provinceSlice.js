import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import province from '../Services/province';

// Async Thunks with rejectWithValue
export const fetchProvinces = createAsyncThunk(
  'provinces/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await province.getProvinces();
      return response.data.provinces;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProvinceById = createAsyncThunk(
  'provinces/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await province.getProvince(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createProvince = createAsyncThunk(
  'provinces/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await province.createProvince(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProvince = createAsyncThunk(
  'provinces/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await province.updateProvince(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteProvince = createAsyncThunk(
  'provinces/delete',
  async (id, { rejectWithValue }) => {
    try {
      await province.deleteProvince(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const provinceSlice = createSlice({
  name: 'province',
  initialState: {
    provinces: [],
    province: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchProvinces
      .addCase(fetchProvinces.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.provinces = action.payload;
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch provinces';
      })

      // fetchProvinceById
      .addCase(fetchProvinceById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProvinceById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.province = action.payload;
      })
      .addCase(fetchProvinceById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch province';
      })

      // createProvince
      .addCase(createProvince.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createProvince.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.provinces.push(action.payload);
      })
      .addCase(createProvince.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create province';
      })

      // updateProvince
      .addCase(updateProvince.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProvince.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.provinces.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.provinces[index] = action.payload;
        }
      })
      .addCase(updateProvince.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update province';
      })

      // deleteProvince
      .addCase(deleteProvince.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteProvince.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.provinces = state.provinces.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProvince.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete province';
      });
  },
});

export default provinceSlice.reducer;