import api from "./api";

const invoiceStudent = {
  getInvoiceStudents: () => api.get('/is'),
  getInvoiceStudent: (id) => api.get(`/is/${id}`),
  createInvoiceStudent: (data) => api.post('/is', data),
  updateInvoiceStudent: (id, data) => api.put(`/is/${id}`, data),
  deleteInvoiceStudent: (id) => api.delete(`/is/${id}`),

};
export default invoiceStudent;