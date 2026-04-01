// src/services/api.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.traveltribe.app/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- Auth ----
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateMe: (data) => api.patch('/auth/me', data),
};

// ---- Posts / Feed ----
export const postsAPI = {
  getFeed: (params) => api.get('/posts', { params }),
  createPost: (data) => api.post('/posts', data),
  toggleLike: (id) => api.post(`/posts/${id}/like`),
  toggleSave: (id) => api.post(`/posts/${id}/save`),
  getComments: (id) => api.get(`/posts/${id}/comments`),
  addComment: (id, data) => api.post(`/posts/${id}/comments`, data),
};

// ---- Places ----
export const placesAPI = {
  getPlaces: (params) => api.get('/places', { params }),
  getNearby: (lat, lng, radius, category) => api.get('/places/nearby', { params: { lat, lng, radius, category } }),
  getPlace: (id) => api.get(`/places/${id}`),
  createPlace: (data) => api.post('/places', data),
  createReview: (placeId, data) => api.post(`/places/${placeId}/reviews`, data),
};

// ---- Groups ----
export const groupsAPI = {
  getGroups: (params) => api.get('/groups', { params }),
  createGroup: (data) => api.post('/groups', data),
  joinGroup: (id) => api.post(`/groups/${id}/join`),
  leaveGroup: (id) => api.delete(`/groups/${id}/leave`),
  getGroupPosts: (id) => api.get(`/groups/${id}/posts`),
  createGroupPost: (id, data) => api.post(`/groups/${id}/posts`, data),
};

// ---- Buddy Finder ----
export const buddyAPI = {
  getPosts: (params) => api.get('/buddy', { params }),
  createPost: (data) => api.post('/buddy', data),
  requestBuddy: (id, data) => api.post(`/buddy/${id}/request`, data),
  respondRequest: (id, status) => api.patch(`/buddy/requests/${id}`, { status }),
};

// ---- Messages ----
export const messagesAPI = {
  getConversations: () => api.get('/messages/conversations'),
  startConversation: (userId) => api.post('/messages/conversations', { other_user_id: userId }),
  getMessages: (convId) => api.get(`/messages/conversations/${convId}/messages`),
  sendMessage: (convId, data) => api.post(`/messages/conversations/${convId}/messages`, data),
};

// ---- Upload ----
export const uploadAPI = {
  uploadImages: async (files) => {
    const form = new FormData();
    files.forEach(f => form.append('images', { uri: f.uri, type: 'image/jpeg', name: 'photo.jpg' }));
    return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  uploadAvatar: async (file) => {
    const form = new FormData();
    form.append('avatar', { uri: file.uri, type: 'image/jpeg', name: 'avatar.jpg' });
    return api.post('/upload/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

// ---- Map ----
export const mapAPI = {
  getData: (lat, lng, radius) => api.get('/map/data', { params: { lat, lng, radius } }),
};

// ---- Notifications ----
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markRead: () => api.patch('/notifications/read'),
  getCount: () => api.get('/notifications/count'),
};

// ---- Users ----
export const usersAPI = {
  getProfile: (username) => api.get(`/users/${username}`),
  getUserPosts: (username) => api.get(`/users/${username}/posts`),
  toggleFollow: (id) => api.post(`/users/${id}/follow`),
};

export default api;
