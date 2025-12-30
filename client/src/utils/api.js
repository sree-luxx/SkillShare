// API service utility for making HTTP requests

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get headers with authentication
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Something went wrong' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle network errors (connection refused, etc.)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please make sure the backend server is running.');
    }
    throw error;
  }
};

// Auth API methods
export const authAPI = {
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (userData) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Profile API methods
export const profileAPI = {
  getProfile: async () => {
    return apiRequest('/profile', {
      method: 'GET',
    });
  },

  updateProfile: async (profileData) => {
    return apiRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// User API methods
export const userAPI = {
  getAllUsers: async () => {
    return apiRequest('/users', {
      method: 'GET',
    });
  },

  getPeers: async () => {
    return apiRequest('/users/peers', {
      method: 'GET',
    });
  },
};

// Community API methods
export const communityAPI = {
  createCommunity: async (payload) => {
    return apiRequest('/communities', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  listCommunities: async () => {
    return apiRequest('/communities', {
      method: 'GET',
    });
  },
  deleteCommunity: async (id) => {
    return apiRequest(`/communities/${id}`, {
      method: 'DELETE',
    });
  },
};

// Community Posts API
export const communityPostsAPI = {
  listByCommunity: async (name) => {
    return apiRequest(`/community-posts/${encodeURIComponent(name)}`, {
      method: 'GET',
    });
  },
  create: async ({ communityName, content, imageUrl }) => {
    return apiRequest('/community-posts', {
      method: 'POST',
      body: JSON.stringify({ communityName, content, imageUrl }),
    });
  },
  react: async (id, type) => {
    return apiRequest(`/community-posts/${id}/react`, {
      method: 'PUT',
      body: JSON.stringify({ type }),
    });
  },
  comment: async (id, text) => {
    return apiRequest(`/community-posts/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
};

// Notification API methods
export const notificationAPI = {
  getNotifications: async () => {
    return apiRequest('/notifications', {
      method: 'GET',
    });
  },

  markAsRead: async () => {
    return apiRequest('/notifications/read', {
      method: 'PUT',
    });
  },
};

// Message API methods
export const messageAPI = {
  getMessages: async (peerId) => {
    return apiRequest(`/messages/${peerId}`, {
      method: 'GET',
    });
  },

  sendMessage: async (receiverId, text) => {
    return apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverId, text }),
    });
  },
};

// Request API methods
export const requestAPI = {
  sendRequest: async (toUserId, message) => {
    return apiRequest('/requests', {
      method: 'POST',
      body: JSON.stringify({ toUserId, message }),
    });
  },

  getRequestsMade: async () => {
    return apiRequest('/requests/made', {
      method: 'GET',
    });
  },

  getRequestsReceived: async () => {
    return apiRequest('/requests/received', {
      method: 'GET',
    });
  },

  updateRequestStatus: async (requestId, status) => {
    return apiRequest(`/requests/${requestId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  withdrawRequest: async (requestId) => {
    return apiRequest(`/requests/${requestId}`, {
      method: 'DELETE',
    });
  },
};

// Generic API methods for authenticated requests
export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, data) =>
    apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: (endpoint, data) =>
    apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
};

export default api;




