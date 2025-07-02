// API configuration

// const BASE_URL = 'http://localhost:8000/api';

const BASE_URL = 'https://yuvachetana.com/api';

// API endpoints
export const ENDPOINTS = {
  // Fellow endpoints
  FELLOW_SIGNUP: `${BASE_URL}/fellow/signup/`,
  FELLOW_LOGIN: `${BASE_URL}/fellow/login/`,
  FELLOW_REGISTER: `${BASE_URL}/fellow/register/`,
  FELLOW_PROFILE: `${BASE_URL}/fellow/profile/`,
  FELLOW_TESTIMONIAL: `${BASE_URL}/fellow/testimonial/`,
  SAVE_USER_TESTIMONIAL_RECORDING: `${BASE_URL}/fellow/testimonial/upload/`,
  SUBMIT_TASK_STATUS: `${BASE_URL}/fellow/taskstatus/submit`,
  GET_DELAYED_TASKS: `${BASE_URL}/fellow/tasks/delayed`,



  //Learning Center endpoints
  CREATE_LEARNING_CENTER: `${BASE_URL}/learning-center/create/`,
  GET_LEARNING_CENTER: (mobile_number: string) =>
    `${BASE_URL}/learning-center/${mobile_number}/`,
  SAVE_LEARNING_CENTER: `${BASE_URL}/learning-center/save/`,
  UPLOAD_LC_PHOTO: `${BASE_URL}/learning-center/photo/upload/`,
  DELETE_LC_PHOTO: `${BASE_URL}/learning-center/photo/delete/`,
  GET_DISTRICT_LEADS: (district_id: string) => `${BASE_URL}/district-leads/${district_id}/`,
  GET_TEAM_LEADS: (dl_id: string) => `${BASE_URL}/team-leads/?dl_id=${dl_id}`,

  //fellow attendance
  SAVE_FELLOW_ATTENDANCE: `${BASE_URL}/fellow-attendance/`,
  GET_FELLOW_ATTENDANCE_HISTORY: (mobile: string, module: string) =>
    `${BASE_URL}/fellow/attendance/history/${mobile}/?module=${module}`,
  GET_FELLOW_OVERALL_ATTENDANCE: (mobile: string) =>
    `${BASE_URL}/fellow/overall-attendance/${mobile}/`,
  



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

  
  UPDATE_PROFILE: `${BASE_URL}/update-profile/`,

  GET_FELLOW_PROFILE: (mobile: string) => `${BASE_URL}/fellow/profile/details/${mobile}/`,
  GET_FELLOW_PROFILE_PHOTO: (mobile: string) => `${BASE_URL}/fellow/get/profilephoto/${mobile}/`,
  UPDATE_FELLOW_PROFILE: (mobile_number: string, section: string) =>
    `${BASE_URL}/fellow/profile/${mobile_number}/${section}/`,
  UPDATE_FELLOW_NAME: (mobile_number: string) =>
    `${BASE_URL}/fellowsignup/update-name/${mobile_number}/`,  
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

  GET_CHILD_PROFILE: (id: string) => `${BASE_URL}/children/profile/${id}/`,
  SAVE_CHILD_PROFILE: `${BASE_URL}/children/profile/save/`,
  GET_CHILDREN_LIST: (mobile: string) => `${BASE_URL}/children/profile/list/${mobile}/`,
  UPLOAD_CHILD_PHOTO: `${BASE_URL}/children/photo/upload/`,
  UPLOAD_FELLOW_PHOTO: `${BASE_URL}/fellow/photo/upload/`,
  DELETE_CHILD_PROFILE: (id: string) => `${BASE_URL}/children/profile/delete/${id}/`,
  POST_CHILDREN_ATTENDANCE: `${BASE_URL}/children/attendance/save/`,
  GET_ATTENDANCE_VIEW: `${BASE_URL}/children/attendance/view/`,
  UPDATE_CHILD_PROFILE: (id: string) => `${BASE_URL}/children/profile/update/${id}/`,


 
  GET_FELLOW_TASKS: `${BASE_URL}/fellow/tasks/list`,
  SUBMIT_CHILDREN_ASSESSMENTS: `${BASE_URL}/submit-children-assessments/`,
  
  GET_ASSESSMENTS: `${BASE_URL}/get-children-assessments/`,

  GET_ATTENDANCE_SUMMARY: (mobile: string) =>
    `${BASE_URL}/children/attendance-summary?fellow_mobile=${mobile}`,
  
  // Options endpoints
  GET_CASTE_OPTIONS: `${BASE_URL}/options/caste/`,
  GET_RELIGION_OPTIONS: `${BASE_URL}/options/religion/`,
  GET_MOTHER_OCCUPATION_OPTIONS: `${BASE_URL}/options/mother-occupation/`,
  GET_FATHER_OCCUPATION_OPTIONS: `${BASE_URL}/options/father-occupation/`,

} as const; 
