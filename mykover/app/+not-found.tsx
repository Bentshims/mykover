import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

/**
 * Page 404 - Route non trouvée
 */
const NotFoundScreen: React.FC = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.replace('/(tabs)/home');
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <View className="items-center mb-8">
        <Ionicons name="alert-circle-outline" size={80} color="#9333ea" />
        <Text className="text-2xl font-bold text-gray-800 mt-4 text-center" style={{ fontFamily: 'Quicksand' }}>
          Page non trouvée
        </Text>
        <Text className="text-gray-600 text-center mt-2 leading-6" style={{ fontFamily: 'Quicksand' }}>
          La page que vous recherchez n'existe pas ou a été déplacée.
        </Text>
      </View>

      <View className="w-full space-y-4">
        <TouchableOpacity
          onPress={handleGoHome}
          className="bg-purple-600 rounded-2xl py-4 px-6 items-center"
        >
          <Text className="text-white font-semibold text-lg" style={{ fontFamily: 'Quicksand' }}>
            Retour à l'accueil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGoBack}
          className="bg-gray-100 rounded-2xl py-4 px-6 items-center"
        >
          <Text className="text-gray-700 font-semibold text-lg" style={{ fontFamily: 'Quicksand' }}>
            Retour
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotFoundScreen;
