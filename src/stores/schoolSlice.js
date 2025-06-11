import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import schoolService from '../service/school';

// Async Thunks
export const fetchSchools = createAsyncThunk(
  'schools/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await schoolService.getSchools();
      return response.data.schools;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSchoolById = createAsyncThunk(
  'schools/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await schoolService.getSchool(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSchool = createAsyncThunk(
  'schools/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await schoolService.createSchool(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSchool = createAsyncThunk(
  'schools/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await schoolService.updateSchool(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSchool = createAsyncThunk(
  'schools/delete',
  async (id, { rejectWithValue }) => {
    try {
      await schoolService.deleteSchool(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const schoolSlice = createSlice({
  name: 'school',
  initialState: {
    schools: [],
    school: null,
    status: 'idle', // Possible values: 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {
    clearSchool: (state) => {
      state.school = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all schools
      .addCase(fetchSchools.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchools.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schools = action.payload;
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch school by ID
      .addCase(fetchSchoolById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchoolById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.school = action.payload;
      })
      .addCase(fetchSchoolById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Create school
      .addCase(createSchool.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSchool.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schools.push(action.payload);
      })
      .addCase(createSchool.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update school
      .addCase(updateSchool.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateSchool.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.schools.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.schools[index] = action.payload;
        }
      })
      .addCase(updateSchool.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Delete school
      .addCase(deleteSchool.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteSchool.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.schools = state.schools.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteSchool.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearSchool } = schoolSlice.actions;
export default schoolSlice.reducer;