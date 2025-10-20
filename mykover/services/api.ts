import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const getBaseURL = () => {

  // Pour EXPO GO sur appareil physique - IP actuelle de votre machine
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return 'http://192.168.1.189:3333';
  }
  
  // Pour émulateurs/simulateurs
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3333'; // Android emulator
  }
  // POUR EXPO GO SUR APPAREIL PHYSIQUE: Utilisez l'IP de votre ordinateur
  return 'http://10.35.66.111:3333';

  
  // Pour web ou iOS simulator
  return 'http://localhost:3333';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // Augmenté à 30 secondes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (data: {
    fullname: string;
    email: string;
    phone: string;
    password: string;
    birth_date: string;
  }) => {
    const response = await api.post('/api/auth/signup', data); 
    return response.data;
  },

  login: async (phone: string, password: string) => { 
    const response = await api.post('/api/auth/login', {
      phone, 
      password,
    });
    return response.data;
  },

  forgotPassword: async (email: string) => { 
    const response = await api.post('/api/auth/forgot-password', { email }); 
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  me: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  googleAuth: () => {
    return `${api.defaults.baseURL}/api/auth/google`;
  },
};

export default api; 