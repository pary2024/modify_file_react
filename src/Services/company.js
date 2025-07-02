import api from "./api";

const company = {
  getCompanys: () => api.get('/company'),
  getCompany: (id) => api.get(`/company/${id}`),
  createCompany: (data) => api.post('/company', data),
  updateCompany: (id, data) => api.put(`/company/${id}`, data),
  deleteCompany: (id) => api.delete(`/company/${id}`),

};
export default company;