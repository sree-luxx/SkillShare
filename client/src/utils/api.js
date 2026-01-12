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
  
  // Alias for compatibility with existing components
  listCommunities: async () => {
    return apiRequest('/communities', {
      method: 'GET',
    });
  },
  
  getAllCommunities: async () => {
    return apiRequest('/communities', {
      method: 'GET',
    });
  },

  getCommunityByName: async (name) => {
    return apiRequest(`/communities/${name}`, {
      method: 'GET',
    });
  },

  deleteCommunity: async (id) => {
    return apiRequest(`/communities/${id}`, {
      method: 'DELETE',
    });
  },
 
  joinCommunity: async (communityId) => {
    return apiRequest(`/communities/${communityId}/join`, {
      method: 'POST',
    });
  },
};

// Community Post API methods
export const communityPostsAPI = {
  createPost: async ({ communityName, content, imageUrl }) => {
    return apiRequest(`/community-posts`, {
      method: 'POST',
      body: JSON.stringify({ communityName, content, imageUrl })
    });
  },

  getPosts: async (communityName) => {
    return apiRequest(`/community-posts/${communityName}`, {
      method: 'GET',
    });
  },
  
  react: async (postId, type) => {
    return apiRequest(`/community-posts/${postId}/react`, {
      method: 'PUT',
      body: JSON.stringify({ type })
    });
  },

  addComment: async (postId, payload) => {
    return apiRequest(`/community-posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// AI Match API methods
export const matchAPI = {
  getMatches: async () => {
    return apiRequest('/matches', {
      method: 'GET',
    });
  },
};

// Request API methods
export const requestAPI = {
  sendRequest: async (recipientId) => {
    return apiRequest('/requests/send', {
      method: 'POST',
      body: JSON.stringify({ recipientId }),
    });
  },

  getRequests: async () => {
    return apiRequest('/requests', {
      method: 'GET',
    });
  },
  
  getSentRequests: async () => {
    return apiRequest('/requests/sent', {
      method: 'GET',
    });
  },

  acceptRequest: async (requestId) => {
    return apiRequest(`/requests/${requestId}/accept`, {
      method: 'PUT',
    });
  },

  rejectRequest: async (requestId) => {
    return apiRequest(`/requests/${requestId}/reject`, {
      method: 'PUT',
    });
  },
  
  cancelRequest: async (requestId) => {
    return apiRequest(`/requests/${requestId}/cancel`, {
      method: 'DELETE',
    });
  },
};

// Message API methods
export const messageAPI = {
  getMessages: async (userId) => {
    return apiRequest(`/messages/${userId}`, {
      method: 'GET',
    });
  },

  sendMessage: async (recipientId, content) => {
    return apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify({ recipientId, content }),
    });
  },
};

export const notificationAPI = {
  getNotifications: async () => {
    return apiRequest('/notifications', {
      method: 'GET',
    });
  },

  markAsRead: async (notificationId) => {
    return apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },
};
