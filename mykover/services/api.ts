import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Configuration intelligente de l'URL de l'API
 * 
 * DÉVELOPPEMENT LOCAL :
 * - Émulateur Android : utilise 10.0.2.2 pour accéder à localhost de la machine hôte
 * - Appareil physique Android/iOS : utilise l'IP WiFi de votre machine (192.168.1.189)
 * - iOS Simulator : utilise localhost ou l'IP WiFi
 * 
 * PRODUCTION :
 * - Utilise l'URL déployée sur Railway (à configurer dans app.json)
 * 
 * Configuration dans app.json :
 * - Development: mettre votre IP locale actuelle
 * - Production: mettre l'URL Railway
 */

// URL de votre backend local (à jour avec votre IP actuelle)
const LOCAL_BACKEND_IP = '192.168.1.189'; // Votre IP WiFi actuelle
const LOCAL_BACKEND_PORT = '3333';

const getBaseURL = () => {
  // 1. PRIORITÉ ABSOLUE : Variable d'environnement EAS Build (pour preview/production)
  // @ts-ignore - Variable injectée par EAS Build
  const easApiUrl = process.env.EXPO_PUBLIC_API_URL || process.env.API_URL;
  
  if (easApiUrl && easApiUrl !== 'RAILWAY_URL_HERE') {
    console.log('[API] 🚀 Utilisation de l\'URL EAS Build:', easApiUrl);
    return easApiUrl;
  }

  // 2. URL depuis app.json (utilisé pour les builds EAS si env var non disponible)
  const configUrl = Constants.expoConfig?.extra?.apiUrl;
  
  if (configUrl && configUrl !== 'LOCAL_DEV' && !configUrl.includes('192.168')) {
    console.log('[API] 📡 Utilisation de l\'URL depuis app.json:', configUrl);
    return configUrl;
  }

  // 3. DÉVELOPPEMENT : Détection automatique selon la plateforme
  if (__DEV__) {
    let devUrl: string;
    
    if (Platform.OS === 'android') {
      // Pour émulateur Android, utiliser 10.0.2.2 (alias de localhost de la machine hôte)
      // Pour appareil physique, utiliser l'IP WiFi
      // Note: Expo Go détecte automatiquement si c'est un émulateur ou un appareil physique
      
      // Si vous testez sur émulateur Android, décommentez la ligne suivante :
      // devUrl = `http://10.0.2.2:${LOCAL_BACKEND_PORT}`;
      
      // Pour appareil physique Android (via WiFi) :
      devUrl = `http://${LOCAL_BACKEND_IP}:${LOCAL_BACKEND_PORT}`;
      
    } else if (Platform.OS === 'ios') {
      // iOS Simulator peut utiliser localhost directement
      // Appareil physique iOS doit utiliser l'IP WiFi
      devUrl = `http://${LOCAL_BACKEND_IP}:${LOCAL_BACKEND_PORT}`;
    } else {
      // Web ou autres plateformes
      devUrl = `http://localhost:${LOCAL_BACKEND_PORT}`;
    }
    
    console.log('[API] 🔧 Mode DÉVELOPPEMENT');
    console.log('[API] 📱 Plateforme:', Platform.OS);
    console.log('[API] 🌐 URL Backend:', devUrl);
    return devUrl;
  }

  // 4. PRODUCTION : Si aucune URL n'est configurée
  console.warn('⚠️ [API] URL de production non configurée!');
  console.warn('⚠️ [API] Ajoutez votre URL Railway dans eas.json > build > preview/production > env > API_URL');
  
  // Fallback temporaire (NE FONCTIONNERA PAS en production!)
  return `http://${LOCAL_BACKEND_IP}:${LOCAL_BACKEND_PORT}`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // 30 secondes pour les connexions lentes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Log détaillé de la configuration (utile pour debug)
console.log('═══════════════════════════════════════════════════');
console.log('[API] Configuration API Client');
console.log('═══════════════════════════════════════════════════');
console.log('Base URL:', api.defaults.baseURL);
console.log('Timeout:', api.defaults.timeout, 'ms');
console.log('Environment:', __DEV__ ? 'DEVELOPMENT' : 'PRODUCTION');
console.log('Platform:', Platform.OS);
console.log('═══════════════════════════════════════════════════');

// Intercepteur de requête : Ajoute le token d'authentification
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('[API] 🔐 Token ajouté à la requête');
      }
    } catch (error) {
      console.error('[API] ❌ Erreur lors de la récupération du token:', error);
    }
    
    // Log de la requête pour debug
    console.log(`[API] ➡️  ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('[API] ❌ Erreur dans l\'intercepteur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse : Gestion des erreurs et déconnexion automatique
api.interceptors.response.use(
  (response) => {
    // Log de succès
    console.log(`[API] ✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  async (error) => {
    // Log détaillé des erreurs
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      console.error('[API] ❌ Erreur serveur:');
      console.error('  - Status:', error.response.status);
      console.error('  - URL:', error.config?.url);
      console.error('  - Méthode:', error.config?.method?.toUpperCase());
      console.error('  - Message:', error.response.data?.message || error.message);
      
      // Déconnexion automatique si token invalide
      if (error.response.status === 401) {
        console.warn('[API] ⚠️  Token invalide - Déconnexion automatique');
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('user_data');
      }
    } else if (error.request) {
      // La requête a été envoyée mais aucune réponse reçue
      console.error('[API] ❌ Erreur réseau - Pas de réponse du serveur');
      console.error('  - URL tentée:', api.defaults.baseURL);
      console.error('  - Vérifiez que le backend est démarré');
      console.error('  - Vérifiez que votre appareil est sur le même réseau WiFi');
    } else {
      // Erreur lors de la configuration de la requête
      console.error('[API] ❌ Erreur de configuration:', error.message);
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