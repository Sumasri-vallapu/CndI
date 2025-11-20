import axios from 'axios';

// Use environment variable if available, otherwise auto-detect
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (
  import.meta.env.PROD
    ? '/api'  // Production: relative path (nginx will proxy /api to backend)
    : 'http://localhost:8000/api'  // Development: direct backend URL
);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/host-login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface Speaker {
  id: number;
  user_name: string;
  user_email: string;
  bio: string;
  expertise: string;
  speaking_topics: string;
  experience_years: number;
  hourly_rate: number;
  availability_status: string;
  profile_image: string;
  average_rating: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  speaker: number;
  speaker_name: string;
  organizer_name: string;
  organizer_email: string;
  organizer_company: string;
  organizer_phone: string;
  event_date: string;
  duration_minutes: number;
  location: string;
  event_type: string;
  audience: string;
  audience_size: number;
  requirements: string;
  budget_min: number;
  budget_max: number;
  budget_range: string;
  status: string;
  urgency: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  event: number;
  event_title: string;
  sender: number;
  sender_name: string;
  recipient: number;
  recipient_name: string;
  subject: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface Payment {
  id: number;
  event: number;
  event_title: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  transaction_id: string;
  payment_date: string;
  created_at: string;
  updated_at: string;
}

export interface SpeakerAvailability {
  id: number;
  speaker: number;
  speaker_name: string;
  date: string;
  is_available: boolean;
  notes: string;
  created_at: string;
}

export interface DashboardStats {
  total_requests: number;
  pending_requests: number;
  accepted_requests: number;
  completed_events: number;
  upcoming_events: number;
}

// Host API functions
export const hostApi = {
  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/host-dashboard-stats/');
    return response.data;
  },

  // Speakers
  async getSpeakers(params?: { 
    expertise?: string; 
    availability?: string; 
  }): Promise<Speaker[]> {
    const response = await api.get('/speakers/', { params });
    return response.data;
  },

  async getSpeakerById(id: number): Promise<Speaker> {
    const response = await api.get(`/speakers/${id}/`);
    return response.data;
  },

  async getSpeakerAvailability(
    speakerId: number, 
    startDate?: string, 
    endDate?: string
  ): Promise<SpeakerAvailability[]> {
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await api.get(`/speaker-availability/${speakerId}/`, { params });
    return response.data;
  },

  // Events
  async getEvents(params?: { status?: string }): Promise<Event[]> {
    const response = await api.get('/events/', { params });
    return response.data;
  },

  async getEventById(id: number): Promise<Event> {
    const response = await api.get(`/events/${id}/`);
    return response.data;
  },

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const response = await api.post('/events/', eventData);
    return response.data;
  },

  async updateEvent(id: number, eventData: Partial<Event>): Promise<Event> {
    const response = await api.patch(`/events/${id}/`, eventData);
    return response.data;
  },

  async respondToEvent(
    eventId: number, 
    action: 'accept' | 'decline', 
    notes?: string
  ): Promise<Event> {
    const response = await api.post(`/event-response/${eventId}/`, {
      action,
      notes
    });
    return response.data;
  },

  // Messages
  async getMessages(eventId?: number): Promise<Message[]> {
    const params = eventId ? { event_id: eventId } : {};
    const response = await api.get('/messages/', { params });
    return response.data;
  },

  async sendMessage(messageData: {
    event: number;
    recipient: number;
    subject: string;
    body: string;
  }): Promise<Message> {
    const response = await api.post('/messages/', messageData);
    return response.data;
  },

  async markMessageAsRead(messageId: number): Promise<void> {
    await api.post(`/mark-message-read/${messageId}/`);
  },

  // Payments
  async getPayments(): Promise<Payment[]> {
    const response = await api.get('/payments/');
    return response.data;
  },

  async createPayment(eventId: number, amount: number): Promise<Payment> {
    const response = await api.post('/create-payment/', {
      event_id: eventId,
      amount
    });
    return response.data;
  },

  // Host Profile
  async getHostProfile(): Promise<any> {
    const response = await api.get('/hosts/me/');
    return response.data;
  },

  async updateHostProfile(profileData: any): Promise<any> {
    const response = await api.patch('/hosts/me/', profileData);
    return response.data;
  },

  // Event Ratings
  async createEventRating(ratingData: {
    event: number;
    speaker: number;
    organizer_name: string;
    rating: number;
    feedback: string;
    would_recommend: boolean;
  }): Promise<any> {
    const response = await api.post('/create-event-rating/', ratingData);
    return response.data;
  },
};

// Error handling utility
export const handleApiError = (error: any) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.response?.data?.error) {
    return error.response.data.error;
  } else if (error.message) {
    return error.message;
  } else {
    return 'An unexpected error occurred';
  }
};

// Date utilities
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export default api;