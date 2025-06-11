import api from "./api";

const school = {
  getSchools: () => api.get('/school'),
  getSchool: (id) => api.get(`/school/${id}`),
  createSchool: (data) => api.post('/school', data),
  updateSchool: (id, data) => api.put(`/school/${id}`, data),
  deleteSchool: (id) => api.delete(`/school/${id}`),

};
export default school;