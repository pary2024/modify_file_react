import api from "./api";

const patient = {
  getPatients: () => api.get('/patient'),
  getPatient: (id) => api.get(`/patient/${id}`),
  createPatient: (data) => api.post('/patient', data),
  updatePatient: (id, data) => api.put(`/patient/${id}`, data),
  deletePatient: (id) => api.delete(`/patient/${id}`),

};
export default patient;