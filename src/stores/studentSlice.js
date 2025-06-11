import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import student from '../service/student';

// Async Thunks
export const fetchStudents = createAsyncThunk(
  'students/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await student.getStudents();
      return response.data.students;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch students');
    }
  }
);

export const fetchStudentById = createAsyncThunk(
  'students/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await student.getStudent(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch student');
    }
  }
);

export const createStudent = createAsyncThunk(
  'students/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await student.createStudent(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create student');
    }
  }
);

export const updateStudent = createAsyncThunk(
  'students/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await student.updateStudent(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update student');
    }
  }
);

export const deleteStudent = createAsyncThunk(
  'students/delete',
  async (id, { rejectWithValue }) => {
    try {
      await student.deleteStudent(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete student');
    }
  }
);

// Slice
const studentSlice = createSlice({
  name: 'student',
  initialState: {
    students: [], // List of students
    student: null, // Single student for fetch by ID
    loading: false, // Loading state for async operations
    error: null, // Error message for failed operations
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload; // Set students array
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch One
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload; // Set single student
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = [...state.students, action.payload]; // Immutable update
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.students.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default studentSlice.reducer;