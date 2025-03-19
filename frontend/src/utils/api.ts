// API configuration
//const BASE_URL = 'http://localhost:8000/api';

const BASE_URL = 'https://yuvachetana.com/api';


// API endpoints
export const ENDPOINTS = {
  SIGNUP: `${BASE_URL}/signup/`,  // signup api
  FORGOT_PASSWORD: `${BASE_URL}/forgot-password/`,
  LOGIN: `${BASE_URL}/login/`,  // login api

  GET_USER_STATUS: (mobile_number: string) => `${BASE_URL}/user-status/${mobile_number}/`,
  GET_USER_DETAILS: `${BASE_URL}/user-details/`,
  
  // location api
  GET_STATES: `${BASE_URL}/states/`,
  GET_DISTRICTS: (state_id: string) => `${BASE_URL}/districts/?state_id=${state_id}`,
  GET_MANDALS: (district_id: string) => `${BASE_URL}/mandals/?district_id=${district_id}`,
  GET_VILLAGES: (mandal_id: string) => `${BASE_URL}/villages/?mandal_id=${mandal_id}`,

  GET_CASTES: `${BASE_URL}/castes/`,  // get castes api

  REGISTER: `${BASE_URL}/register/`,        // register api

  // task api

  GET_TASK_STATUS: (mobile_number: string) => 
    `${BASE_URL}/tasks/status/${mobile_number}/`,
  GET_VIDEO_STATUS: (mobile_number: string) => 
    `${BASE_URL}/tasks/video-status/${mobile_number}/`,
  UPDATE_VIDEO_STATUS: `${BASE_URL}/tasks/video-status/update/`,

  SUBMIT_TASK1: `${BASE_URL}/tasks/submit-task1/`,
  SUBMIT_TASK2: `${BASE_URL}/tasks/submit-task2/`, 
  UPDATE_TASKS: `${BASE_URL}/tasks/update/`,


  UPDATE_DATA_CONSENT: `${BASE_URL}/data-consent/update/`,
  UPDATE_CHILD_PROTECTION: `${BASE_URL}/child-protection/update/`,

  UPLOAD_PROFILE_PHOTO: `${BASE_URL}/upload-profile-photo/`,
} as const; 