import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Determine the correct base URL based on the platform
const getBaseURL = () => {
  // Pour EXPO GO sur appareil physique - IP actuelle de votre machine
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return 'http://192.168.1.189:3333';
  }
  
  // Pour émulateurs/simulateurs
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3333'; // Android emulator
  }
  
  // Pour web ou iOS simulator
  return 'http://localhost:3333';
};

// Create axios instance
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
    }
    return Promise.reject(error);
  }
);

// API endpoints for authentication
export const authApi = {
  // Register a new user
  register: async (data: {
    fullname: string;
    email: string;
    phone: string;
    password: string;
    birth_date: string;
  }) => {
    const response = await api.post('/api/auth/signup', data); // ✅ CORRIGÉ
    return response.data;
  },

  // Login with phone and password
  login: async (phone: string, password: string) => { // ✅ CORRIGÉ
    const response = await api.post('/api/auth/login', {
      phone, // ✅ CORRIGÉ
      password,
    });
    return response.data;
  },

  // Forgot password - send email with reset token
  forgotPassword: async (email: string) => { // ✅ CORRIGÉ
    const response = await api.post('/api/auth/forgot-password', { email }); // ✅ CORRIGÉ
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  // Get current user info
  me: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  // Google OAuth
  googleAuth: () => {
    return `${api.defaults.baseURL}/api/auth/google`;
  },
};

export default api; 