import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import invoiceStudent from '../service/invoiceStudent';

// Async Thunks
export const fetchInvoiceStudents = createAsyncThunk(
  'invoiceStudent/fetchAll',
  async () => {
    const response = await invoiceStudent. getInvoiceStudents();
    return response.data;
  }
);

export const fetchInvoiceStudentById = createAsyncThunk(
  'invoiceStudent/fetchById',
  async (id) => {
    const response = await invoiceStudent.getInvoiceStudent(id);
    return response.data;
  }
);

export const createInvoiceStudent = createAsyncThunk(
  'invoiceStudent/create',
  async (data) => {
    const response = await invoiceStudent.createInvoiceStudent(data);
    return response.data;
  }
);

export const updateInvoiceStudent = createAsyncThunk(
  'invoiceStudent/update',
  async ({ id, data }) => {
    const response = await invoiceStudent. updateInvoiceStudent(id, data);
    return response.data;
  }
);

export const deleteInvoiceStudent = createAsyncThunk(
  'invoiceStudent/delete',
  async (id) => {
    await invoiceStudent.deleteInvoiceStudent(id);
    return id;
  }
);

// Slice
const invoiceStudentSlice = createSlice({
  name: 'invoiceStudent',
  initialState: {
    invoicerStudents: [],
    invoiceStudent: null,
    status:'idle',
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoiceStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchInvoiceStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchInvoiceStudentById.fulfilled, (state, action) => {
        state.current = action.payload;
      })

      .addCase(createInvoiceStudent.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      .addCase(updateInvoiceStudent.fulfilled, (state, action) => {
        const index = state.list.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })

      .addCase(deleteInvoiceStudent.fulfilled, (state, action) => {
        state.list = state.list.filter(inv => inv.id !== action.payload);
      });
  }
});

export default invoiceStudentSlice.reducer;
