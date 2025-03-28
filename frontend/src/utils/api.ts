// API configuration
const BASE_URL = 'http://localhost:8000/api';

//const BASE_URL = 'https://yuvachetana.com/api';


// API endpoints
export const ENDPOINTS = {
  SIGNUP: `${BASE_URL}/fellow-signup/`,  // signup api
  REGISTER: `${BASE_URL}/fellow-registration/`,        // register api
  FORGOT_PASSWORD: `${BASE_URL}/forgot-password/`,  
  LOGIN: `${BASE_URL}/fellow-login/`,  // login api
  SAVE_USER_TESTIMONIAL_RECORDING: `${BASE_URL}/save-user-testimonial-recording/`,


  GET_USER_STATUS: (mobile_number: string) => `${BASE_URL}/user-status/${mobile_number}/`,
  GET_USER_DETAILS: `${BASE_URL}/fellow-details/`,
  
  // location api
  GET_STATES: `${BASE_URL}/states/`,
  GET_DISTRICTS: (state_id: string) => `${BASE_URL}/districts/?state_id=${state_id}`,
  GET_MANDALS: (district_id: string) => `${BASE_URL}/mandals/?district_id=${district_id}`,
  GET_VILLAGES: (mandal_id: string) => `${BASE_URL}/villages/?mandal_id=${mandal_id}`,

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
  GET_PROFILE_PHOTO: `${BASE_URL}/get-profile-photo/`,
  UPDATE_PROFILE_PHOTO: `${BASE_URL}/update-profile-photo/`,
  UPDATE_PROFILE: `${BASE_URL}/update-profile/`, 

  GET_FELLOW_PROFILE: (mobile_number: string) => 
    `${BASE_URL}/fellow-profile/${mobile_number}/`,
  UPDATE_FELLOW_PROFILE: (mobile_number: string, section: string) => 
    `${BASE_URL}/fellow-profile/${mobile_number}/${section}/`,
  UPDATE_FELLOW_ACCEPTANCE: (mobile_number: string) => 
    `${BASE_URL}/fellow-profile/${mobile_number}/accept/`,
  GET_FELLOW_ACCEPTANCE: (mobile_number: string) => 
    `${BASE_URL}/fellow-profile/${mobile_number}/acceptance-status/`,
} as const; 