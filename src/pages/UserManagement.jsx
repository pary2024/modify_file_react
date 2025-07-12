import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, deleteUser, fetchUsers } from '../stores/userSlice';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { fetchCompanies } from '../stores/companySlice';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const {companies} = useSelector((state) => state.company);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
 
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [phone , setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [status , setStatus] = useState('active');
  const [company , setCompany] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchCompanies());
  }, [dispatch]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);
  useEffect(() => {
      if (alertMessage) {
        Swal.fire({
          icon: alertMessage.type,
          title: alertMessage.text,
          showConfirmButton: false,
          timer: 1500,
          position: "top-end",
        });
        setAlertMessage(null); // clear after showing
      }
    }, [alertMessage]);

  useEffect(() => {
    const results = (users || []).filter(
      (user) =>
        user && // Ensure user is defined
        typeof user.name === 'string' && // Check if name is a string
        typeof user.email === 'string' &&
        typeof user.role === 'string' &&
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

 const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUserId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      status: 'active',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser ={
      name: name,
      email: email,
      role: role,
      phone: phone,
      password: password,
      status: status,
      company_id: company
    }
    try{
      await dispatch(createUser( newUser ));
      setSnackbar({ open: true, message: 'User created successfully', severity: 'success' });
      dispatch(fetchUsers());
      handleCloseForm();
       Swal.fire({
              icon: "success",
              title: "User created successfully!",
              showConfirmButton: false,
              timer: 1500,
              position: "top-end",
            });
    }catch(e){
      console.log(e); 
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteUser(id));
      setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
      setIsFormOpen(false);

      dispatch(fetchUsers());
    } catch (error) {
      setSnackbar({ open: true, message: 'Error deleting user', severity: 'error' });
    }
  };

 
  

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User Management</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsFormOpen(true)}
          sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Add User
        </Button>
      </div>

      <TextField
        fullWidth
        margin="normal"
        label="Search users"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
        sx={{
          bgcolor: 'background.paper',
          '& .MuiInputLabel-root': { color: 'text.primary' },
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'divider' },
            '&:hover fieldset': { borderColor: 'primary.main' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            color: 'text.primary',
          },
        }}
      />

      {/* User Form Modal */}
{isFormOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-labelledby="user-form-title"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 id="user-form-title" className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {editingUserId ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={name}
                onChange={(e)=> setName(e.target.value)}
                required
                sx={{
                  bgcolor: 'background.paper',
                  '& .MuiInputBase-input': { color: 'text.primary' },
                  '& .MuiInputLabel-root': { color: 'text.primary' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'divider' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  },
                }}
                inputProps={{ 'aria-required': 'true' }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                required
                sx={{
                  bgcolor: 'background.paper',
                  '& .MuiInputBase-input': { color: 'text.primary' },
                  '& .MuiInputLabel-root': { color: 'text.primary' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'divider' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  },
                }}
                inputProps={{ 'aria-required': 'true' }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Phone"
                name="phone"
                value={phone}
                onChange={(e)=> setPhone (e.target.value)}
                sx={{
                  bgcolor: 'background.paper',
                  '& .MuiInputBase-input': { color: 'text.primary' },
                  '& .MuiInputLabel-root': { color: 'text.primary' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'divider' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  },
                }}
              />
             <FormControl fullWidth margin="normal">
                  <InputLabel id="company-label" sx={{ color: 'text.primary' }}>Company</InputLabel>
                  <Select
                    labelId="company-label"
                    value={company} 
                    label="Company"
                    onChange={(e) => setCompany(e.target.value)} 
                    sx={{
                      bgcolor: 'background.paper',
                      color: 'text.primary',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                    }}
                  >
                    {companies?.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                label="password"
                name="password"
                value={password}
                onChange={(e)=> setPassword (e.target.value)}
                sx={{
                  bgcolor: 'background.paper',
                  '& .MuiInputBase-input': { color: 'text.primary' },
                  '& .MuiInputLabel-root': { color: 'text.primary' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'divider' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  },
                }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ color: 'text.primary' }}>Role</InputLabel>
                <Select
                  name="role"
                  value={role}
                  onChange={(e)=> setRole(e.target.value)}
                  required
                  label="Role"
                  sx={{
                    bgcolor: 'background.paper',
                    '& .MuiInputBase-input': { color: 'text.primary' },
                    '& .MuiSelect-icon': { color: 'text.primary' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                  }}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ color: 'text.primary' }}>Status</InputLabel>
                <Select
                  name="status"
                  value={status}
                  onChange={(e)=> setStatus(e.target.value)}
                  label="Status"
                  sx={{
                    bgcolor: 'background.paper',
                    '& .MuiInputBase-input': { color: 'text.primary' },
                    '& .MuiSelect-icon': { color: 'text.primary' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                  }}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  onClick={handleCloseForm}
                  sx={{ color: 'text.secondary' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}
                >
                  {editingUserId ? 'Update' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}      {/* Users Table */}
      <Table sx={{ minWidth: '100%', bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 1 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Name</TableCell>
            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Phone</TableCell>
            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Company</TableCell>
            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Role</TableCell>
            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
              <TableCell sx={{ color: 'text.primary' }}>{user.name}</TableCell>
              <TableCell sx={{ color: 'text.primary' }}>{user.email}</TableCell>
              <TableCell sx={{ color: 'text.primary' }}>{user.phone}</TableCell>
              <TableCell sx={{ color: 'text.primary' }}>{user.company}</TableCell>
              <TableCell sx={{ color: 'text.primary' }}>{user.role}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    user.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                  }`}
                >
                  {user.status}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(user)}
                  sx={{ color: 'primary.main', mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(user.id)}
                  sx={{ color: 'error.main' }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%', bgcolor: 'background.paper', color: 'text.primary' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserManagement;
