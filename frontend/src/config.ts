export const API_BASE_URL = "http://localhost:8000"; // FastAPI backend

export const API_ENDPOINTS = {
    EVENTS: `${API_BASE_URL}/events/`, // Example FastAPI route
    USERS: `${API_BASE_URL}/users/`,   // Example if needed later
};



import { API_ENDPOINTS } from "../config";

export async function fetchEvents() {
    const response = await fetch(API_ENDPOINTS.EVENTS);
    return response.json();
}
