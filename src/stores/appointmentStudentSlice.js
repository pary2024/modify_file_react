import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import appointmentStudent from '../service/appointmentStudent';

// Async Thunks
export const fetchAppointmentStudents = createAsyncThunk(
  'appointmentStudent/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appointmentStudent.getAppointmentStudents();
      return response.data.appointmentStudents;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch appointments');
    }
  }
);

export const fetchAppointmentStudentById = createAsyncThunk(
  'appointmentStudent/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await appointmentStudent.getAppointmentStudent(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch appointment');
    }
  }
);

export const createAppointmentStudent = createAsyncThunk(
  'appointmentStudent/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await appointmentStudent.createAppointmentStudent(data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create appointment');
    }
  }
);

export const updateAppointmentStudent = createAsyncThunk(
  'appointmentStudent/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await appointmentStudent.updateAppointmentStudent(id, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update appointment');
    }
  }
);

export const deleteAppointmentStudent = createAsyncThunk(
  'appointmentStudent/delete',
  async (id, { rejectWithValue }) => {
    try {
      await appointmentStudent.deleteAppointmentStudent(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to delete appointment');
    }
  }
);

// Slice
const appointmentStudentSlice = createSlice({
  name: 'appointmentStudent',
  initialState: {
    studentAppoits: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAppointmentStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.studentAppoits = action.payload;
      })
      .addCase(fetchAppointmentStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Fetch by ID
      .addCase(fetchAppointmentStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchAppointmentStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Create
      .addCase(createAppointmentStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointmentStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.studentAppoits.push(action.payload);
      })
      .addCase(createAppointmentStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Update
      .addCase(updateAppointmentStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentStudent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateAppointmentStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Delete
      .addCase(deleteAppointmentStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointmentStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.studentAppoits = state.list.filter((a) => a.id !== action.payload);
      })
      .addCase(deleteAppointmentStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default appointmentStudentSlice.reducer;
