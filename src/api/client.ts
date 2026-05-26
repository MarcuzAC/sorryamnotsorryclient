import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Article {
  id: number
  title: string
  subtitle?: string
  content: string
  author: string
  image_url?: string
  is_published: boolean
  views: number
  created_at: string
}

export interface Report {
  id: number
  title: string
  description?: string
  file_url: string
  file_size: number
  download_count: number
  created_at: string
}

export const publicAPI = {
  // Articles
  getArticles: (skip: number = 0, limit: number = 50) =>
    apiClient.get<Article[]>(`/api/articles?skip=${skip}&limit=${limit}`),
  
  getArticle: (id: number) =>
    apiClient.get<Article>(`/api/articles/${id}`),
  
  // Reports
  getReports: () =>
    apiClient.get<Report[]>('/api/reports'),
  
  downloadReport: (id: number) =>
    apiClient.post<{ download_url: string; download_count: number }>(`/api/reports/${id}/download`),
  
  // Contact
  submitContact: (data: { name: string; email: string; message: string }) =>
    apiClient.post('/api/contact', data),
  
  // Venting
  saveVentingMessage: (data: { message: string; user_id?: string }) =>
    apiClient.post('/api/venting/messages', data),
}
// Add these to your src/api/client.ts file

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface WorkSlide {
  id: number;
  image: string;
  title: string;
  description: string;
}

export default apiClient