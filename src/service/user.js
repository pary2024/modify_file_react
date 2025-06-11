import api from "./api";

const user = {
  getUser: () => api.get('/user'),
  getUserid: (id) => api.get(`/user/${id}`),
  createUser: (data) => api.post('/user', data),
  updateUser: (id, data) => api.put(`/user/${id}`, data),
  deleteUser: (id) => api.delete(`/user/${id}`),

};
export default user;