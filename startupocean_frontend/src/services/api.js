import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8025';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");

  if (token && token !== "null" && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),

  requestLoginOtp: (email) =>
    api.post("/auth/login/request-otp",
      { email },
      { headers: { Authorization: undefined } }
    ),

  verifyLoginOtp: (data) =>
    api.post("/auth/login/verify-otp", data, {
      headers: { Authorization: undefined },
    }),

  verifyOtp: (data) =>
    api.post("/auth/verify-otp", data, {
      headers: { Authorization: undefined },
    }),

  sendOtp: (email) =>
    api.post(`/auth/send-otp?email=${email}`, null, {
      headers: { Authorization: undefined },
    }),
};

export const companyAPI = {
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.put(`/companies/${id}`, data),
  getMyCompany: () => api.get('/companies/my-company'),
  getAll: (companyType) => api.get('/companies', { params: { companyType } }),
  getById: (id) => api.get(`/companies/public/${id}`),
  search: (keyword) => api.get('/companies/search', { params: { keyword } }),
  searchByOffering: (offering) => api.get('/companies/search/offering', { params: { offering } }),
  delete: (id) => api.delete(`/companies/${id}`),
};

export const eventAPI = {
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  getAll: () => api.get('/events'),
  getUpcoming: () => api.get('/events/upcoming'),
  getPast: () => api.get('/events/past'),
  getMyEvents: () => api.get('/events/my-events'),
  getById: (id) => api.get(`/events/${id}`),
  register: (id) => api.post(`/events/${id}/register`),
  cancelRegistration: (id) => api.delete(`/events/${id}/register`),
  delete: (id) => api.delete(`/events/${id}`),
};

export const collaborationAPI = {
  send: (data) => api.post('/collaborations', data),
  getSent: () => api.get('/collaborations/sent'),
  getReceived: () => api.get('/collaborations/received'),
  accept: (id) => api.put(`/collaborations/${id}/accept`),
  reject: (id) => api.put(`/collaborations/${id}/reject`),
  delete: (id) => api.delete(`/collaborations/${id}`),
};

export const messageAPI = {
  send: (data) => api.post('/messages', data),
  getByCollaboration: (collaborationId) => api.get(`/messages/collaboration/${collaborationId}`),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),
  getUnreadCount: () => api.get('/messages/unread/count'),
};

export const enquiryAPI = {
  submit: (data) => api.post('/enquiries/submit', data),
  getAll: () => api.get('/enquiries'),
  updateStatus: (id, status) => api.put(`/enquiries/${id}/status`, null, { params: { status } }),
  delete: (id) => api.delete(`/enquiries/${id}`),
};

export const locationAPI = {
  getCities: () => api.get('/cities'),
};

export const activityAPI = {
  track: (data) =>
    api.post("/activity/track", data, {
      headers: { Authorization: undefined },
    }),
};

export const trackActivity = async ({
  activityType,
  pageUrl,
  searchQuery = null,
  resourceId = null,
  resourceType = null,
  metadata = null,
}) => {
  try {
    let sessionId = sessionStorage.getItem("sessionId");

    if (!sessionId || sessionId === "null" || sessionId === "undefined") {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("sessionId", sessionId);
    }

    await activityAPI.track({
      sessionId,
      activityType,
      pageUrl,
      searchQuery,
      resourceId,
      resourceType,
      metadata,
    });

  } catch (err) {
    console.error("Tracking failed:", err?.response?.status, err.message);
  }
};

export default api;