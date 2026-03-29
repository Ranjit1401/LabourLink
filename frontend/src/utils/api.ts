// src/utils/api.ts
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ✅ FIX: Global 401 handler — clears token and redirects to login if token is expired/invalid
const handleResponse = async (res: Response) => {
  if (res.status === 401) {
    console.warn('Token expired or invalid — logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || `Request failed with status ${res.status}`);
  }
  return res.json();
};

// Helper function to get headers and token
const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const api = {
  // ================= AUTH =================
  signup: async (userData: any) => {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error('Signup failed');
    return res.json();
  },

  login: async (credentials: any) => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  // ================= JOBS =================
  getJobs: async () => {
    const res = await fetch(`${BASE_URL}/jobs`);
    return handleResponse(res);
  },

  createJob: async (jobData: any) => {
    const res = await fetch(`${BASE_URL}/create-job`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(jobData),
    });
    return handleResponse(res);
  },

  applyJob: async (data: { job_id: string }) => {
    const res = await fetch(`${BASE_URL}/apply-job`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // ================= POSTS =================
  getPosts: async () => {
    const res = await fetch(`${BASE_URL}/posts`);
    return handleResponse(res);
  },

  createPost: async (formData: FormData) => {
    const res = await fetch(`${BASE_URL}/create-post`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    return handleResponse(res);
  },

  // ================= PROFILE =================
  getProfile: async (email: string) => {
    const res = await fetch(`${BASE_URL}/profile/${email}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // ================= NOTIFICATIONS =================
  getNotifications: async () => {
    // ✅ FIX: Don't even attempt the call if there's no token
    const token = localStorage.getItem('token');
    if (!token) return [];

    const res = await fetch(`${BASE_URL}/notifications`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  markNotificationsRead: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`${BASE_URL}/mark-read`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // ================= RATINGS =================
  rateUser: async (email: string, rating: number) => {
    const res = await fetch(`${BASE_URL}/rate-user/${email}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ rating }),
    });
    return handleResponse(res);
  },

  // ================= SOCIAL =================
  likePost: async (postId: string) => {
    const res = await fetch(`${BASE_URL}/like-post/${postId}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  commentPost: async (postId: string, text: string) => {
    const fd = new FormData();
    fd.append('text', text);
    const res = await fetch(`${BASE_URL}/comment-post/${postId}`, {
      method: 'POST',
      headers: getHeaders(true),
      body: fd,
    });
    return handleResponse(res);
  },

  // ================= APPLICATIONS =================
  getMyApplications: async () => {
    const res = await fetch(`${BASE_URL}/my-applications`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getJobApplicants: async (jobId: string) => {
    const res = await fetch(`${BASE_URL}/job-applicants/${jobId}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // ================= CONNECTIONS =================
  sendRequest: async (receiver: string) => {
    const res = await fetch(`${BASE_URL}/send-request/${receiver}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  acceptRequest: async (sender: string) => {
    const res = await fetch(`${BASE_URL}/accept/${sender}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getConnections: async () => {
    const res = await fetch(`${BASE_URL}/connections`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};