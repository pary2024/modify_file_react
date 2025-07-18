import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import auth from '../Services/auth';

// Async Thunk: Login User
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await auth.login(credentials);
      const data = response.data;

      const token = data.token;
     
      

      if (!token || !Array.isArray(roles)) {
        throw new Error('Invalid login response: token or roles missing');
      }

      // ✅ Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('company', credentials.company); 
     
      
      

      return { token };
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  }
);


// Async Thunk: Logout User
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await auth.logout();
      localStorage.removeItem('token');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.token = action.payload.token; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })

      // Logout Cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.status = 'idle';
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
