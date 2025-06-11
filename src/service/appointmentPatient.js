import api from "./api";

const appointmentPatient = {
  getAppointmentPatients: () => api.get('/appt/patient'),
  getAppointmentPatient: (id) => api.get(`/appt/patient/${id}`),
  createAppointmentPatient: (data) => api.post('/appt/patient', data),
  updateAppointmentPatient: (id, data) => api.put(`/appt/patient/${id}`, data),
  deleteAppointmentPatient: (id) => api.delete(`/appt/patient/${id}`),

};
export default appointmentPatient;