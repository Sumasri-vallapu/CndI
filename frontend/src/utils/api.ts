// API configuration
//const BASE_URL = 'http://localhost:8000/api';

const BASE_URL = 'https://yuvachetana.com/api';


// API endpoints
export const ENDPOINTS = {
  LOGIN: `${BASE_URL}/login/`,
  SIGNUP: `${BASE_URL}/signup/`,
  FORGOT_PASSWORD: `${BASE_URL}/forgot-password/`,
  UPDATE_TASKS: `${BASE_URL}/tasks/update/`,
  UPDATE_DATA_CONSENT: `${BASE_URL}/data-consent/update/`,
  UPDATE_CHILD_PROTECTION: `${BASE_URL}/child-protection/update/`,
  GET_USER_STATUS: (mobile_number: string) => `${BASE_URL}/user-status/${mobile_number}/`,
  GET_CASTES: `${BASE_URL}/castes/`,
  GET_STATES: `${BASE_URL}/states/`,
  GET_DISTRICTS: `${BASE_URL}/districts/`,
  GET_MANDALS: `${BASE_URL}/mandals/`,
  GET_VILLAGES: `${BASE_URL}/villages/`,
  REGISTER: `${BASE_URL}/register/`
} as const; 