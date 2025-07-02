import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import user from '../Services/user'; // adjust path as needed

// Thunks
export const fetchUsers = createAsyncThunk('user/fetchUsers', async (_, thunkAPI) => {
  try {
    const res = await user.getUser();
    return res.data.users;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchUserById = createAsyncThunk('user/fetchUserById', async (id, thunkAPI) => {
  try {
    const res = await user.getUserid(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const createUser = createAsyncThunk('user/createUser', async (data, thunkAPI) => {
  try {
    const res = await user.createUser(data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateUser = createAsyncThunk('user/updateUser', async ({ id, data }, thunkAPI) => {
  try {
    const res = await user.updateUser(id, data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (id, thunkAPI) => {
  try {
    await user.deleteUser(id);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    selectedUser: null,
    loading: false,
    status:"idle",
    error: null,
  },
  reducers: {
    clearSelectedUser(state) {
      state.selectedUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchUserById
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createUser
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })

      // updateUser
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
      })

      // deleteUser
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      });
  },
});

export const { clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
