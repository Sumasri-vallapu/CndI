// API configuration
const LOC_URL = 'https://yuvachetana.com//api';
//const BASE_URL = 'https://clearmyfile.com/api';

const BASE_URL = 'http://localhost:8000/api';

// API endpoints
export const ENDPOINTS = {
  BASE_URL,
  // Authentication endpoints
  SEND_OTP: `${BASE_URL}/send_otp/`,
  SIGNUP: `${BASE_URL}/signup/`,
  LOGIN: `${BASE_URL}/login/`,
  VERIFY_OTP: `${BASE_URL}/verify_otp/`,
  FORGOT_PASSWORD: `${BASE_URL}/forgot_password/`,
  RESET_PASSWORD: `${BASE_URL}/reset_password/`,
  
  // Location endpoints
  GET_STATES: `${LOC_URL}/states/`,
  GET_DISTRICTS: `${LOC_URL}/districts/`,
  GET_MANDALS: `${LOC_URL}/mandals/`,
  GET_GRAMPANCHAYATS: `${LOC_URL}/grampanchayats/`,

} as const; 
