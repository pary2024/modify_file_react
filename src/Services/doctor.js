import api from "./api";

const doctor = {
  getDoctors: () => api.get('/doctor'),
  getDoctor: (id) => api.get(`/doctor/${id}`),
  createDoctor: (data) => api.post('/doctor', data),
  updateDoctor: (id, data) => api.put(`/doctor/${id}`, data),
  deleteDoctor: (id) => api.delete(`/doctor/${id}`),

};
export default doctor;