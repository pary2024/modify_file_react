import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import auth from '../service/auth';

// Async Thunk: Login User
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await auth.login(credentials);
      const data = response.data;

      // Expecting: { token: "...", user: { role: "admin" } }
      const token = data.token;
      const roles = data.user?.roles;

      if (!token || !roles) {
        throw new Error('Invalid login response: token or role missing');
      }

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', roles);

      return { token, user: data.user };
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return rejectWithValue(error.response?.data?.message || error.message);
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
      localStorage.removeItem('roles');
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
    role: localStorage.getItem('roles'),
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
        state.user = action.payload.user;
        state.role = action.payload.user.roles;
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
        state.user = null;
        state.token = null;
        state.role = null;
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
