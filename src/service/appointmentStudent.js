import api from "./api";

const appointmentStudent = {
  getAppointmentStudents: () => api.get('/appt/student'),
  getAppointmentStudent: (id) => api.get(`/appt/student/${id}`),
  createAppointmentStudent: (data) => api.post('/appt/student', data),
  updateAppointmentStudent: (id, data) => api.put(`/appt/student/${id}`, data),
  deleteAppointmentStudent: (id) => api.delete(`/appt/student/${id}`),

};
export default appointmentStudent