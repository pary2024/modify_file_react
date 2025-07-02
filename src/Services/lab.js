import api from "./api";

const lab = {
  getLabs: () => api.get('/lab'),
  getLab: (id) => api.get(`/lab/${id}`),
  createLab: (data) => api.post('/lab', data),
  updateLab: (id, data) => api.put(`/lab/${id}`, data),
  deleteLab: (id) => api.delete(`/lab/${id}`),

};
export default lab;