import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import TopNavBarCustom from '../../components/TopNavBarCustom';

export default function HomeScreen() {
  // Fonction pour gérer la navigation vers les plans d'assurance
  const handleInsuranceNavigation = () => {
    router.push('/plans');
  };

  // Fonction pour gérer la navigation vers le scanner QR
  const handleQRScannerNavigation = () => {
    router.push('/plans');
  };

  // Fonction pour gérer les notifications
  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  // Fonction pour gérer le clic sur l'avatar
  const handleAvatarPress = () => {
    router.push('/profile');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      
      {/* Barre de navigation supérieure */}
      <TopNavBarCustom 
        onAvatarPress={handleAvatarPress}
        // onQRPress={handleQRScannerNavigation}
        onNotificationPress={handleNotificationPress}
        notificationCount={3}
      />

      {/* Contenu principal */}
      <View className="flex-1 px-6">
        {/* Message de bienvenue */}
        <View className="mb-8">
          <Text className="mb-4 text-2xl font-bold text-gray-900">
            Bienvenue !
          </Text>
          <Text className="text-base leading-6 text-gray-600">
            Parce que la santé de votre famille n'a pas de prix, notre 
            assurance vous accompagne à chaque étape de la vie. 
            Accédez facilement à des soins de qualité, des consultations 
            illimitées et une assistance médicale 24/7 — pour vivre 
            chaque jour avec sérénité.
          </Text>
        </View>

        {/* Image principale avec cercles décoratifs */}
        <View className="relative items-center justify-center flex-1">
          {/* Cercles décoratifs en arrière-plan */}
          <View className="absolute top-0 right-0 w-32 h-32 border-2 border-[#8A4DFF] rounded-full opacity-20" />
          <View className="absolute bottom-20 left-0 w-24 h-24 border-2 border-[#8A4DFF] rounded-full opacity-20" />
          <View className="absolute bottom-0 right-8 w-16 h-16 border-2 border-[#8A4DFF] rounded-full opacity-20" />
          
          {/* Image de la professionnelle de santé */}
          <View className="items-center mb-8">
            <View className="items-center justify-center w-64 overflow-hidden bg-blue-100 h-80 rounded-2xl">
              {/* Placeholder pour l'image - remplacer par une vraie image */}
              <View className="items-center justify-center w-48 h-64 bg-blue-400 rounded-lg">
                <Ionicons name="medical" size={80} color="white" />
              </View>
            </View>
          </View>
        </View>

        {/* Bouton principal d'action */}
        <View className="pb-8">
          <TouchableOpacity
            className="bg-[#8A4DFF] rounded-full py-4 shadow-lg"
            onPress={handleInsuranceNavigation}
            activeOpacity={0.8}
          >
            <Text className="text-lg font-semibold text-center text-white">
              Assurer votre santé
            </Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}
