// API configuration
// Use environment variable if available, otherwise auto-detect
const getBaseURL = () => {
  // If VITE_API_URL is set, use it
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}/api`;
  }

  // Otherwise, auto-detect based on environment
  return import.meta.env.PROD
    ? '/api'  // Production: relative path (nginx will proxy /api to backend)
    : 'http://localhost:8000/api';  // Development: direct backend URL
};

const BASE_URL = getBaseURL();

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

  // Event endpoints
  EVENTS: `${BASE_URL}/events/`,
  EVENT_DETAIL: (id: number) => `${BASE_URL}/events/${id}/`,

  // Message endpoints
  MESSAGES: `${BASE_URL}/messages/`,
  MESSAGE_DETAIL: (id: number) => `${BASE_URL}/messages/${id}/`,
  MARK_MESSAGE_READ: (id: number) => `${BASE_URL}/mark-message-read/${id}/`,

} as const; 
