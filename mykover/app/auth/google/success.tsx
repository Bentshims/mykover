import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../src/contexts/AuthContext';

/**
 * Page de succès pour l'authentification Google OAuth
 * Récupère le token depuis l'URL et connecte l'utilisateur
 */
const GoogleSuccessScreen: React.FC = () => {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      if (!token) {
        console.error('[GOOGLE_SUCCESS] Token manquant');
        router.replace('/login');
        return;
      }

      try {
        console.log('[GOOGLE_SUCCESS] Connexion avec token Google');
        const success = await loginWithToken(token);
        
        if (success) {
          console.log('[GOOGLE_SUCCESS] Connexion réussie');
          router.replace('/(tabs)/home');
        } else {
          console.error('[GOOGLE_SUCCESS] Échec connexion');
          router.replace('/login');
        }
      } catch (error) {
        console.error('[GOOGLE_SUCCESS] Erreur:', error);
        router.replace('/login');
      }
    };

    handleGoogleAuth();
  }, [token, loginWithToken, router]);

  return (
    <View className="flex-1 bg-purple-600 justify-center items-center">
      <View className="bg-white rounded-3xl p-8 mx-6 items-center">
        <ActivityIndicator size="large" color="#9333ea" />
        <Text className="text-gray-800 text-lg font-semibold mt-4 text-center" style={{ fontFamily: 'Quicksand' }}>
          Connexion avec Google...
        </Text>
        <Text className="text-gray-600 text-center mt-2" style={{ fontFamily: 'Quicksand' }}>
          Veuillez patienter pendant que nous finalisons votre connexion.
        </Text>
      </View>
    </View>
  );
};

export default GoogleSuccessScreen;
