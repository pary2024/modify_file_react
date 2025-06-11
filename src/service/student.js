import api from "./api";

const student = {
  getStudents: () => api.get('/student'),
  getStudent: (id) => api.get(`/student/${id}`),
  createStudent: (data) => api.post('/student', data),
  updateStudent: (id, data) => api.put(`/student/${id}`, data),
  deleteStudent: (id) => api.delete(`/student/${id}`),

};
export default student;