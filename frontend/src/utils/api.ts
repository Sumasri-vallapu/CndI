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
  GET_USER_DETAILS: `${BASE_URL}/user-details/`,
  GET_CASTES: `${BASE_URL}/castes/`,
  GET_STATES: `${BASE_URL}/states/`,
  GET_DISTRICTS: (state_id: string) => `${BASE_URL}/districts/?state_id=${state_id}`,
  GET_MANDALS: (district_id: string) => `${BASE_URL}/mandals/?district_id=${district_id}`,
  GET_VILLAGES: (mandal_id: string) => `${BASE_URL}/villages/?mandal_id=${mandal_id}`,
  REGISTER: `${BASE_URL}/register/`
} as const; 