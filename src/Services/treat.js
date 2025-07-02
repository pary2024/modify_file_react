import api from "./api";

const treat = {
  getTreats: () => api.get('/treat'),
  getTreat: (id) => api.get(`/treat/${id}`),
  createTreat: (data) => api.post('/treat', data),
  updateTreat: (id, data) => api.put(`/treat/${id}`, data),
  deleteTreat: (id) => api.delete(`/treat/${id}`),

};
export default treat;