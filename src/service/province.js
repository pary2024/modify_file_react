import api from "./api";

const province = {
  getProvinces: () => api.get('/province'),
  getProvince: (id) => api.get(`/province/${id}`),
  createProvince: (data) => api.post('/province', data),
  updateProvince: (id, data) => api.put(`/province/${id}`, data),
  deleteProvince: (id) => api.delete(`/province/${id}`),

};
export default province;