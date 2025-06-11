// src/stores/patientSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import patient from '../service/patient';

// Async Thunks
export const fetchPatients = createAsyncThunk(
  'patients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await patient.getPatients();
      // Adjust based on actual API response (e.g., response.data.patients or response.data.Patients)
      return response.data.patients || response.data.Patients;
    } catch (error) {
      console.error("Fetch patients error:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchPatientById = createAsyncThunk(
  'patients/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await patient.getPatient(id);
      return response.data;
    } catch (error) {
      console.error("Fetch patient by ID error:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createPatient = createAsyncThunk(
  'patients/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await patient.createPatient(data);
      return response.data;
    } catch (error) {
      console.error("Create patient error:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updatePatient = createAsyncThunk(
  'patients/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await patient.updatePatient(id, data);
      return response.data;
    } catch (error) {
      console.error("Update patient error:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deletePatient = createAsyncThunk(
  'patients/delete',
  async (id, { rejectWithValue }) => {
    try {
      await patient.deletePatient(id);
      return id;
    } catch (error) {
      console.error("Delete patient error:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice
const patientSlice = createSlice({
  name: 'patient',
  initialState: {
    patients: [],
    patient: null,
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchPatients
      .addCase(fetchPatients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchPatientById
      .addCase(fetchPatientById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patient = action.payload;
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // createPatient
      .addCase(createPatient.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patients.push(action.payload);
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // updatePatient
      .addCase(updatePatient.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.patients.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // deletePatient
      .addCase(deletePatient.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patients = state.patients.filter((p) => p.id !== action.payload);
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default patientSlice.reducer;