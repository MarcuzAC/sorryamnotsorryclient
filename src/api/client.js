import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const publicAPI = {
    // Articles
    getArticles: (skip = 0, limit = 50) => apiClient.get(`/api/articles?skip=${skip}&limit=${limit}`),
    getArticle: (id) => apiClient.get(`/api/articles/${id}`),
    // Reports
    getReports: () => apiClient.get('/api/reports'),
    downloadReport: (id) => apiClient.post(`/api/reports/${id}/download`),
    // Contact
    submitContact: (data) => apiClient.post('/api/contact', data),
    // Venting
    saveVentingMessage: (data) => apiClient.post('/api/venting/messages', data),
};
export default apiClient;
//# sourceMappingURL=client.js.map