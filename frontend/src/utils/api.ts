// API configuration
//const LOC_URL = 'https://yuvachetana.com//api';
//const BASE_URL = 'https://clearmyfile.com/api';

const BASE_URL = 'http://localhost:8000/api';

// API endpoints
export const ENDPOINTS = {
  BASE_URL,
  
  // NEW OTP-based Authentication endpoints
  AUTH: {
    SIGNUP_REQUEST: `${BASE_URL}/auth/signup-request/`,
    VERIFY_OTP: `${BASE_URL}/auth/verify-otp/`,
    SET_PASSWORD: `${BASE_URL}/auth/set-password/`,
    LOGIN: `${BASE_URL}/auth/login/`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password/`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password/`,
    RESEND_OTP: `${BASE_URL}/auth/resend-otp/`,
    CHECK_EMAIL_EXISTS: `${BASE_URL}/auth/check-email-exists/`,
  },
  
  // Legacy endpoints (for backward compatibility during transition)
  SEND_OTP: `${BASE_URL}/send_otp/`,
  SIGNUP: `${BASE_URL}/signup/`,
  LOGIN: `${BASE_URL}/login/`,
  VERIFY_OTP: `${BASE_URL}/verify_otp/`,
  FORGOT_PASSWORD: `${BASE_URL}/forgot_password/`,
  RESET_PASSWORD: `${BASE_URL}/reset_password/`,
  CHECK_EMAIL_EXISTS: `${BASE_URL}/check_email_exists/`,
  
  // Location endpoints
  GET_STATES: `${BASE_URL}/states/`,
  GET_DISTRICTS: `${BASE_URL}/districts/`,
  GET_MANDALS: `${BASE_URL}/mandals/`,
  GET_GRAMPANCHAYATS: `${BASE_URL}/grampanchayats/`,

  // Speaker endpoints
  SPEAKERS: `${BASE_URL}/speakers/`,
  SPEAKER_DETAIL: (id: number) => `${BASE_URL}/speakers/${id}/`,

} as const; 
