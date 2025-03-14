// API configuration
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.yuvachetana.com/api'
  : 'http://localhost:8000/api';
  
// API endpoints
export const ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/signup/`,
  LOGIN: `${API_BASE_URL}/login/`,
  FORGOT_PASSWORD: `${API_BASE_URL}/forgot-password/`,
}; 