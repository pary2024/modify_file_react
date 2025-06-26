import api from "./api";

const dutyDoctor = {
  getDutys: () => api.get('/duty'),
  getDuty: (id) => api.get(`/duty/${id}`),
  createDuty: (data) => api.post('/duty', data),
  updateDuty: (id, data) => api.put(`/duty/${id}`, data),
  deleteDuty: (id) => api.delete(`/duty/${id}`),

};
export default dutyDoctor;