import api from "./api";

const invoicePatient = {
  getInvoicePatients: () => api.get('/ip'),
  getInvoicePatient: (id) => api.get(`/ip/${id}`),
  createInvoicePatient: (data) => api.post('/ip', data),
  updateInvoicePatient: (id, data) => api.put(`/ip/${id}`, data),
  deleteInvoicePatient: (id) => api.delete(`/ip/${id}`),

};
export default invoicePatient;