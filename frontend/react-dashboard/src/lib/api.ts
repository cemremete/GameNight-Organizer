// API client for GameNight backend

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001/api';

// token management
let authToken: string | null = localStorage.getItem('token');

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

// generic fetch wrapper
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authApi = {
  register: (data: { email: string; username: string; password: string; timezone?: string }) =>
    request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCurrentUser: () => request<{ user: any }>('/auth/me'),

  updateProfile: (data: { username?: string; timezone?: string; avatarUrl?: string }) =>
    request<{ user: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Events API
export const eventsApi = {
  getEvents: () => request<{ events: any[] }>('/events'),

  getPublicEvents: (limit = 20, offset = 0) =>
    request<{ events: any[] }>(`/events/public?limit=${limit}&offset=${offset}`),

  getEvent: (id: string) => request<{ event: any }>(`/events/${id}`),

  createEvent: (data: {
    name: string;
    description?: string;
    gameType?: string;
    eventTime: string;
    maxParticipants?: number;
    isPublic?: boolean;
  }) =>
    request<{ event: any }>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateEvent: (id: string, data: any) =>
    request<{ event: any }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteEvent: (id: string) =>
    request<{ message: string }>(`/events/${id}`, {
      method: 'DELETE',
    }),

  joinEvent: (id: string) =>
    request<{ event: any }>(`/events/${id}/join`, {
      method: 'POST',
    }),

  leaveEvent: (id: string) =>
    request<{ message: string }>(`/events/${id}/leave`, {
      method: 'POST',
    }),

  getParticipants: (id: string) =>
    request<{ participants: any[] }>(`/events/${id}/participants`),

  getEventTimezones: (id: string) =>
    request<{ eventTime: string; conversions: Record<string, string> }>(`/events/${id}/timezones`),
};

// Analytics API
export const analyticsApi = {
  getStats: () => request<{ stats: any }>('/analytics/stats'),

  getTrends: (months = 6) =>
    request<{ trends: any[] }>(`/analytics/trends?months=${months}`),

  getGameTypes: () => request<{ distribution: any[] }>('/analytics/game-types'),

  getTimezones: () => request<{ distribution: any[] }>('/analytics/timezones'),

  getResponseTimes: () => request<{ responseTimes: any[] }>('/analytics/response-times'),

  getDashboard: () =>
    request<{ stats: any; trends: any[]; gameTypes: any[]; timezones: any[] }>('/analytics/dashboard'),
};
