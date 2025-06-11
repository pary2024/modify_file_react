import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import doctor from '../service/doctor'; // Adjust the path based on your structure

// Async Thunks
export const fetchDoctors = createAsyncThunk('doctor/fetchDoctors', async (_, thunkAPI) => {
  try {
    const res = await doctor.getDoctors();
    return res.data.doctors;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchDoctorById = createAsyncThunk('doctor/fetchDoctorById', async (id, thunkAPI) => {
  try {
    const res = await doctor.getDoctor(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const createDoctor = createAsyncThunk('doctor/createDoctor', async (data, thunkAPI) => {
  try {
    const res = await doctor.createDoctor(data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateDoctor = createAsyncThunk('doctor/updateDoctor', async ({ id, data }, thunkAPI) => {
  try {
    const res = await doctor.updateDoctor(id, data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteDoctor = createAsyncThunk('doctor/deleteDoctor', async (id, thunkAPI) => {
  try {
    await doctor.deleteDoctor(id);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const doctorSlice = createSlice({
  name: 'doctor',
  initialState: {
    doctors: [],
    doctor: null,
    loading: false,
    status:'idle',
    error: null,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // Fetch all doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single doctor
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDoctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create doctor
      .addCase(createDoctor.fulfilled, (state, action) => {
        state.doctors.push(action.payload);
      })

      // Update doctor
      .addCase(updateDoctor.fulfilled, (state, action) => {
        const index = state.doctors.findIndex(doc => doc.id === action.payload.id);
        if (index !== -1) state.doctors[index] = action.payload;
      })

      // Delete doctor
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.doctors = state.doctors.filter(doc => doc.id !== action.payload);
      });
  }
});


export default doctorSlice.reducer;
