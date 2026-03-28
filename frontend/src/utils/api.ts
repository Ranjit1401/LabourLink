// src/utils/api.ts
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function to get headers and token
const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token'); // Token browser mein save karenge
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
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  createJob: async (jobData: any) => {
    const res = await fetch(`${BASE_URL}/create-job`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(jobData),
    });
    if (!res.ok) throw new Error('Failed to create job');
    return res.json();
  },
// src/utils/api.ts ke andar add/check karein:
  applyJob: async (data: { job_id: string }) => {
    const res = await fetch(`${BASE_URL}/apply-job`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to apply');
    }
    return res.json();
  },
  // ================= POSTS =================
  getPosts: async () => {
    const res = await fetch(`${BASE_URL}/posts`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  createPost: async (formData: FormData) => {
    // Note: isFormData is true here so we don't set Content-Type to application/json
    const res = await fetch(`${BASE_URL}/create-post`, {
      method: 'POST',
      headers: getHeaders(true), 
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
  },

  // src/utils/api.ts mein add karna hai
  getProfile: async (email: string) => {
    const res = await fetch(`${BASE_URL}/profile/${email}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },
};

