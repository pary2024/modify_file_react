import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import treat from '../Services/treat'; // adjust path as needed

// Thunks
export const fetchTreats = createAsyncThunk('treat/fetchTreats', async (_, thunkAPI) => {
  try {
    const res = await treat.getTreats();
    return res.data.treats;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchTreatById = createAsyncThunk('treat/fetchTreatById', async (id, thunkAPI) => {
  try {
    const res = await treat.getTreat(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const createTreat = createAsyncThunk('treat/createTreat', async (data, thunkAPI) => {
  try {
    const res = await treat.createTreat(data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateTreat = createAsyncThunk('treat/updateTreat', async ({ id, data }, thunkAPI) => {
  try {
    const res = await treat.updateTreat(id, data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteTreat = createAsyncThunk('treat/deleteTreat', async (id, thunkAPI) => {
  try {
    await treat.deleteTreat(id);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Slice
const treatSlice = createSlice({
  name: 'treat',
  initialState: {
    treats: [],
    selectedTreat: null,
    status:'idle',
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedTreat(state) {
      state.selectedTreat = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTreats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTreats.fulfilled, (state, action) => {
        state.loading = false;
        state.treats = action.payload;
      })
      .addCase(fetchTreats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTreatById.fulfilled, (state, action) => {
        state.selectedTreat = action.payload;
      })

      .addCase(createTreat.fulfilled, (state, action) => {
        state.treats.push(action.payload);
      })

      .addCase(updateTreat.fulfilled, (state, action) => {
        const index = state.treats.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.treats[index] = action.payload;
      })

      .addCase(deleteTreat.fulfilled, (state, action) => {
        state.treats = state.treats.filter(t => t.id !== action.payload);
      });
  }
});

export const { clearSelectedTreat } = treatSlice.actions;
export default treatSlice.reducer;
