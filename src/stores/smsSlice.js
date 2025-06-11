import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sms from '../service/message';

// Async Thunks
export const fetchSmsList = createAsyncThunk(
  'sms/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sms.getSmsAll();
      return response.data.messages;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch SMS list.');
    }
  }
);

export const fetchSmsById = createAsyncThunk(
  'sms/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await sms.getSms(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch SMS by ID.');
    }
  }
);

export const createSms = createAsyncThunk(
  'sms/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await sms.createSms(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create SMS.');
    }
  }
);

export const updateSms = createAsyncThunk(
  'sms/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await sms.updateSms(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update SMS.');
    }
  }
);

export const deleteSms = createAsyncThunk(
  'sms/delete',
  async (id, { rejectWithValue }) => {
    try {
      await sms.deleteSms(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete SMS.');
    }
  }
);

// Initial State
const initialState = {
  messages: [],
  current: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Slice
const smsSlice = createSlice({
  name: 'sms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchSmsList
      .addCase(fetchSmsList.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSmsList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchSmsList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // fetchSmsById
      .addCase(fetchSmsById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSmsById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.current = action.payload;
      })
      .addCase(fetchSmsById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // createSms
      .addCase(createSms.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages.push(action.payload);
      })
      .addCase(createSms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // updateSms
      .addCase(updateSms.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateSms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.messages.findIndex(s => s.id === action.payload.id);
        if (index !== -1) state.messages[index] = action.payload;
      })
      .addCase(updateSms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // deleteSms
      .addCase(deleteSms.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteSms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = state.messages.filter(s => s.id !== action.payload);
      })
      .addCase(deleteSms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default smsSlice.reducer;
