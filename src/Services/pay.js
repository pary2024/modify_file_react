import api from "./api";

const pay = {
  getPays: () => api.get('/pay'),
  getPay: (id) => api.get(`/pay/${id}`),
  createPay: (data) => api.post('/pay', data),
  updatePay: (id, data) => api.put(`/pay/${id}`, data),
  deletePay: (id) => api.delete(`/pay/${id}`),

};
export default pay;