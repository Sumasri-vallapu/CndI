// API configuration
const BASE_URL = 'http://localhost:8000/api';

// const BASE_URL = 'https://yuvachetana.com/api';

import { format } from "date-fns"
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
  SUBMIT_TASK_STATUS: `${BASE_URL}/submit-task-status/`,



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
  GET_FELLOW_ATTENDANCE_HISTORY: (mobile: string, start: Date, end: Date) =>
    `${BASE_URL}/fellow/attendance/history/${mobile}/?start_date=${format(start, "yyyy-MM-dd")}&end_date=${format(end, "yyyy-MM-dd")}`,



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

  GET_CHILD_PROFILE: (id: string) => `${BASE_URL}/children/profile/${id}/`,
  SAVE_CHILD_PROFILE: `${BASE_URL}/children/profile/save/`,
  GET_CHILDREN_LIST: (mobile: string) => `${BASE_URL}/children/profile/list/${mobile}/`,
  UPLOAD_CHILD_PHOTO: `${BASE_URL}/children/photo/upload/`,
  DELETE_CHILD_PROFILE: (id: string) => `${BASE_URL}/children/profile/delete/${id}/`,
  POST_CHILDREN_ATTENDANCE: `${BASE_URL}/children/attendance/save/`,
  GET_ATTENDANCE_VIEW: `${BASE_URL}/children/attendance/view/`,
  SUBMIT_BASELINE_SCORES: `${BASE_URL}/student-assessments/submit/`,
  GET_ASSESSMENTS: `${BASE_URL}/student-assessments/get/`,
  GET_FELLOW_TASKS: `${BASE_URL}/fellow/tasks/list`,
  
  
 



} as const; 