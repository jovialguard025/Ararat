import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getRiskMap = (bounds) => api.get('/risk-map', { params: bounds }).then(res => res.data);
export const getRiskPoint = (lat, lng) => api.get('/risk-point', { params: { lat, lng } }).then(res => res.data);
export const getPrediction = (features) => api.post('/predict', features).then(res => res.data);
export const getRainfall = (lat, lng) => api.get('/rainfall', { params: { lat, lng } }).then(res => res.data);
export const getAlerts = () => api.get('/alerts').then(res => res.data);
export const acknowledgeAlert = (id) => api.post(`/alerts/${id}/acknowledge`).then(res => res.data);
export const submitFieldReport = (report) => api.post('/field-reports', report).then(res => res.data);
export const getFieldReports = () => api.get('/field-reports').then(res => res.data);

export default api;
