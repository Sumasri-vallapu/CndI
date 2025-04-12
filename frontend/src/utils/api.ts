// API configuration
//const BASE_URL = 'http://localhost:8000/api';

const BASE_URL = 'https://yuvachetana.com/api';


// API endpoints
export const ENDPOINTS = {
  // Fellow endpoints
  FELLOW_SIGNUP: `${BASE_URL}/fellow/signup/`,
  FELLOW_LOGIN: `${BASE_URL}/fellow/login/`,
  FELLOW_REGISTER: `${BASE_URL}/fellow/register/`,
  FELLOW_PROFILE: `${BASE_URL}/fellow/profile/`,
  FELLOW_TESTIMONIAL: `${BASE_URL}/fellow/testimonial/`,
  UPLOAD_PROFILE_PHOTO: `${BASE_URL}/fellow/profile/photo/upload/`,
  SAVE_USER_TESTIMONIAL_RECORDING: `${BASE_URL}/fellow/testimonial/upload/`,

  //Learning Center endpoints
  CREATE_LEARNING_CENTER: `${BASE_URL}/learning-center/create/`,
  GET_LEARNING_CENTER: (mobile_number: string) => 
    `${BASE_URL}/learning-center/${mobile_number}/`,
  SAVE_LEARNING_CENTER: `${BASE_URL}/learning-center/save/`,
  
  // Location endpoints
  GET_STATES: `${BASE_URL}/states/`,
  GET_DISTRICTS: `${BASE_URL}/districts/`,
  GET_MANDALS: `${BASE_URL}/mandals/`,
  GET_GRAMPANCHAYATS: `${BASE_URL}/grampanchayats/`,
  
  // Task endpoints
  GET_TASK_STATUS: (mobile_number: string) => `${BASE_URL}/fellow/tasks/status/${mobile_number}/`,
  SUBMIT_TASK1: `${BASE_URL}/fellow/tasks/submit/task1/`,
  SUBMIT_TASK2: `${BASE_URL}/fellow/tasks/submit/task2/`,
  
  // Other endpoints
  FORGOT_PASSWORD: `${BASE_URL}/forgot-password/`,
  UPDATE_DATA_CONSENT: `${BASE_URL}/fellow/data-consent/update/`,
  UPDATE_CHILD_PROTECTION: `${BASE_URL}/fellow/child-protection/update/`,
  GET_USER_STATUS: `${BASE_URL}/fellow/status/`,

  GET_FELLOW_DETAILS: `${BASE_URL}/fellow-details/`,

  // Recorder endpoints
  GET_RECORDER_SUMMARY: `${BASE_URL}/recorder-summary/`,
  
  // task api
  GET_VIDEO_STATUS: (mobile_number: string) => 
    `${BASE_URL}/tasks/video-status/${mobile_number}/`,
  UPDATE_VIDEO_STATUS: `${BASE_URL}/tasks/video-status/update/`,

  UPDATE_PROFILE_PHOTO: `${BASE_URL}/update-profile-photo/`,
  UPDATE_PROFILE: `${BASE_URL}/update-profile/`, 

  GET_FELLOW_PROFILE: (mobile_number: string) => 
    `${BASE_URL}/fellow/profile/details/${mobile_number}/`,
  UPDATE_FELLOW_PROFILE: (mobile_number: string, section: string) => 
    `${BASE_URL}/fellow/profile/${mobile_number}/${section}/`,
  UPDATE_FELLOW_ACCEPTANCE: (mobile_number: string) => 
    `${BASE_URL}/fellow/profile/${mobile_number}/accept/`,
  GET_FELLOW_ACCEPTANCE: (mobile_number: string) => 
    `${BASE_URL}/fellow/profile/${mobile_number}/acceptance-status/`,

  GET_FELLOW_CONSENT_DETAILS: (mobile_number: string) => 
    `${BASE_URL}/fellow/details/${mobile_number}/`,

  GET_UNIVERSITIES: `${BASE_URL}/universities/`,
  GET_COLLEGES: `${BASE_URL}/colleges/`,
  GET_COURSES: `${BASE_URL}/courses/`,

  SUBMIT_TESTIMONIAL: `${BASE_URL}/submit-testimonial/`,

  GET_USER_DETAILS: (mobile_number: string) => 
    `${BASE_URL}/fellow/details/${mobile_number}/`,
} as const; 