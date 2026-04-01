import axios from "axios";

const baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

let authToken = null;
let devHeaders = {
  "x-dev-user-id": "dev-user-1",
  "x-dev-email": "dev-user-1@traveltribe.dev",
  "x-dev-name": "Dev Traveler",
};

export const apiClient = axios.create({
  baseURL: `${baseUrl}/api`,
  timeout: 15000,
});

export const setApiAuth = ({ token, devUser }) => {
  authToken = token || null;

  if (devUser) {
    devHeaders = {
      "x-dev-user-id": devUser.uid,
      "x-dev-email": devUser.email,
      "x-dev-name": devUser.displayName,
    };
  }
};

apiClient.interceptors.request.use((config) => {
  const headers = config.headers || {};

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  } else {
    headers["x-dev-user-id"] = devHeaders["x-dev-user-id"];
    headers["x-dev-email"] = devHeaders["x-dev-email"];
    headers["x-dev-name"] = devHeaders["x-dev-name"];
  }

  config.headers = headers;
  return config;
});

export const apiGet = async (url, config = {}) => {
  const response = await apiClient.get(url, config);
  return response.data;
};

export const apiPost = async (url, payload = {}, config = {}) => {
  const response = await apiClient.post(url, payload, config);
  return response.data;
};

export const apiPut = async (url, payload = {}, config = {}) => {
  const response = await apiClient.put(url, payload, config);
  return response.data;
};
