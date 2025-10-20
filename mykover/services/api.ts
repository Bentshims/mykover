import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Configuration intelligente de l'URL de l'API
 * - En développement : utilise l'IP locale selon la plateforme
 * - En production (APK/IPA) : utilise l'URL du backend déployé
 */
const getBaseURL = () => {
  // Récupérer l'URL depuis la config Expo (prioritaire)
  const configUrl = Constants.expoConfig?.extra?.apiUrl;
  
  if (configUrl) {
    return configUrl;
  }

  // Fallback développement : détection automatique selon plateforme
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Émulateur Android utilise 10.0.2.2 pour localhost
      // Appareil physique Android via WiFi
      return Platform.select({
        android: 'http://192.168.0.59:3333', // Ton IP WiFi
        default: 'http://192.168.0.59:3333',
      });
    }
    // iOS Simulator/Device
    return 'http://192.168.0.59:3333';
  }

  // Fallback production si pas de config
  console.warn('API URL non configurée, utilisation du fallback local');
  return 'http://192.168.0.59:3333';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // Augmenté à 30 secondes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Log de l'URL utilisée (utile pour debug)
console.log('[API] Base URL:', api.defaults.baseURL);

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

  resetPassword: async (phone: string, otp: string, newPassword: string) => {
    const response = await api.post('/api/auth/reset-password', {
      phone,
      otp,
      password: newPassword,
    });
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