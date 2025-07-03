// API configuration
//const BASE_URL = 'https://yuvachetana.com//api';

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
  GET_STATES: `https://yuvachetana.com/api/states/`,
  GET_DISTRICTS: `https://yuvachetana.com/api/districts/`,
  GET_MANDALS: `https://yuvachetana.com/api/mandals/`,
  GET_GRAMPANCHAYATS: `https://yuvachetana.com/api/grampanchayats/`,

} as const; 
