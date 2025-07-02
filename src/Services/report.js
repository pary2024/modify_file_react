import api from "./api";

const report = {
  getReports: () => api.get('/report'),
  

};
export default report;