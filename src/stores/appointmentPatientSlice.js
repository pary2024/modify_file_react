import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import appointmentPatient from '../service/appointmentPatient';

// Async Thunks with rejectWithValue
export const fetchAppointmentPatients = createAsyncThunk(
  'appointmentPatient/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await appointmentPatient.getAppointmentPatients();
      return response.data.appointmentPatients;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchAppointmentPatientById = createAsyncThunk(
  'appointmentPatient/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await appointmentPatient.getAppointmentPatient(id);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createAppointmentPatient = createAsyncThunk(
  'appointmentPatient/create',
  async (data, thunkAPI) => {
    try {
      const response = await appointmentPatient.createAppointmentPatient(data);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateAppointmentPatient = createAsyncThunk(
  'appointmentPatient/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await appointmentPatient.updateAppointmentPatient(id, data);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteAppointmentPatient = createAsyncThunk(
  'appointmentPatient/delete',
  async (id, thunkAPI) => {
    try {
      await appointmentPatient.deleteAppointmentPatient(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
const appointmentPatientSlice = createSlice({
  name: 'appointmentPatient',
  initialState: {
    appointmentPatients: [],
    current: null,
    status: 'idle',
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointmentPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentPatients = action.payload;
      })
      .addCase(fetchAppointmentPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAppointmentPatientById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(fetchAppointmentPatientById.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(createAppointmentPatient.fulfilled, (state, action) => {
        state.appointmentPatients.push(action.payload);
      })
      .addCase(createAppointmentPatient.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateAppointmentPatient.fulfilled, (state, action) => {
        const index = state.list.findIndex(a => a.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateAppointmentPatient.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteAppointmentPatient.fulfilled, (state, action) => {
        state.appointmentPatients = state.list.filter(a => a.id !== action.payload);
      })
      .addCase(deleteAppointmentPatient.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export default appointmentPatientSlice.reducer;
