import api from "./api";


const auth = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  logout: () => api.post('/logout'),
  getCurrentUser: () => api.get('/user'),
};
export default auth;