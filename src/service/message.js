import api from "./api";

const sms = {
  getSmsAll: () => api.get('/sms'),
  getSms: (id) => api.get(`/sms/${id}`),
  createSms: (data) => api.post('/sms', data),
  updateSms: (id, data) => api.put(`/sms/${id}`, data),
  deleteSms: (id) => api.delete(`/sms/${id}`),

};
export default sms;