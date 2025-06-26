import api from "./api";

const material = {
  getMaterails: () => api.get('/material'),
  getMaterail: (id) => api.get(`/material/${id}`),
  createMaterail: (data) => api.post('/material', data),
  updateMaterail: (id, data) => api.put(`/material/${id}`, data),
  deleteMaterail: (id) => api.delete(`/material/${id}`),

};
export default material;