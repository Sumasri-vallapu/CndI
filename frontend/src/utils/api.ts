// API configuration

// const BASE_URL = 'http://localhost:8000/api';

const BASE_URL = 'https://clearmyfile.org/api';

// API endpoints
export const ENDPOINTS = {
  BASE_URL,
  // Authentication endpoints
  SEND_OTP: `${BASE_URL}/send_otp/`,
  SIGNUP: `${BASE_URL}/signup/`,
  LOGIN: `${BASE_URL}/login/`,
  VERIFY_OTP: `${BASE_URL}/verify_otp/`,
  
  // Location endpoints
  GET_STATES: `${BASE_URL}/states/`,
  GET_DISTRICTS: `${BASE_URL}/districts/`,
  GET_MANDALS: `${BASE_URL}/mandals/`,
  GET_GRAMPANCHAYATS: `${BASE_URL}/grampanchayats/`,

} as const; 
