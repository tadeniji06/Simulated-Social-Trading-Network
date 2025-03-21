import { API_URL } from "../utils/api";
import axios from "axios";
import { setCookie, getCookie, removeCookie } from "../utils/cookies";

// Create axios instance with auth headers
const authAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true // Important for cookies to be sent with requests
});

// Add a request interceptor to include the token in all requests
authAxios.interceptors.request.use(
  config => {
    const token = getCookie('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
authAxios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      removeCookie('token');
      removeCookie('user');
      
      // Only redirect if not already on auth pages
      const currentPath = window.location.pathname;
      if (!['/login', '/register', '/auth/callback'].includes(currentPath)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default authAxios;

export const register = async (name, email, password) => {
  try {
    const response = await authAxios.post(`/auth/register`, {
      name,
      email,
      password,
    });
    
    // Store token and user in cookies if they're in the response
    if (response.data.token) {
      setCookie('token', response.data.token);
    }
    if (response.data.user) {
      setCookie('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

export const login = async (email, password) => {
  try {
    const response = await authAxios.post(`/auth/login`, {
      email,
      password,
    });
   
    // Store token and user in cookies
    if (response.data.token) {
      setCookie('token', response.data.token);
      console.log('Token cookie set after login');
    }
    if (response.data.user) {
      setCookie('user', JSON.stringify(response.data.user));
      console.log('User cookie set after login');
    }
   
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const googleLogin = async () => {
  try {
    // This will redirect to Google OAuth page
    window.location.href = `${API_URL}/auth/google`;
    return null;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

export const getUser = async () => {
  try {
    const response = await authAxios.get(`/auth/me`);
   
    // Update user cookie with fresh data
    if (response.data.user) {
      setCookie('user', JSON.stringify(response.data.user));
    }
   
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

export const logout = async () => {
  try {
    const response = await authAxios.get(`/auth/logout`);
    // Clear cookies regardless of API response
    removeCookie('token');
    removeCookie('user');
    return response.data;
  } catch (error) {
    // Still clear cookies even if API call fails
    removeCookie('token');
    removeCookie('user');
    throw error.response?.data || { message: 'Network error. Please try again.' };
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getCookie('token');
  console.log('isAuthenticated check:', !!token);
  return !!token;
};

// Get current user from cookie
export const getCurrentUser = () => {
  const userStr = getCookie('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};
