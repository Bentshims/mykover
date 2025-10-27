import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

export default function PaymentResultScreen() {
  const params = useLocalSearchParams();
  const { transactionId, planName, amount, status, message } = params;
  
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    // Animate icon
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'failed':
        return {
          icon: 'close-circle',
          iconColor: '#EF4444',
          bgColor: 'bg-red-100',
          title: 'Paiement échoué',
          description: 'Votre paiement n\'a pas pu être traité. Veuillez réessayer avec une autre méthode de paiement.',
          buttonText: 'Réessayer le paiement',
          buttonAction: () => router.back()
        };
      case 'cancelled':
        return {
          icon: 'ban',
          iconColor: '#F59E0B',
          bgColor: 'bg-yellow-100',
          title: 'Paiement annulé',
          description: 'Vous avez annulé le paiement. Aucun montant n\'a été débité de votre compte.',
          buttonText: 'Réessayer le paiement',
          buttonAction: () => router.back()
        };
      case 'pending':
        return {
          icon: 'time',
          iconColor: '#3B82F6',
          bgColor: 'bg-blue-100',
          title: 'Paiement en attente',
          description: 'Votre paiement est en cours de traitement. Vous recevrez une confirmation une fois le paiement validé.',
          buttonText: 'Vérifier le statut',
          buttonAction: () => router.push('/payment-history')
        };
      default:
        return {
          icon: 'warning',
          iconColor: '#EF4444',
          bgColor: 'bg-red-100',
          title: 'Erreur de paiement',
          description: 'Une erreur est survenue lors du traitement de votre paiement. Veuillez contacter le support.',
          buttonText: 'Contacter le support',
          buttonAction: () => router.push('/menu')
        };
    }
  };

  const config = getStatusConfig();

  const handleReturnHome = () => {
    router.replace('/(tabs)/plans');
  };

  const handleViewHistory = () => {
    router.push('/payment-history');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <View className="items-center justify-center flex-1 px-6">
        {/* Status Animation */}
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }]
          }}
          className={`w-24 h-24 ${config.bgColor} rounded-full items-center justify-center mb-8`}
        >
          <Ionicons name={config.icon as any} size={48} color={config.iconColor} />
        </Animated.View>

        {/* Status Message */}
        <Text className="mb-4 text-2xl font-bold text-center text-gray-900" style={{ fontFamily: 'Quicksand' }}>
          {config.title}
        </Text>
        
        <Text className="mb-8 text-base leading-6 text-center text-gray-600" style={{ fontFamily: 'Quicksand' }}>
          {message || config.description}
        </Text>

        {/* Payment Details */}
        <View className="w-full p-6 mb-8 bg-gray-50 rounded-2xl">
          <Text className="mb-4 text-lg font-semibold text-center text-gray-900" style={{ fontFamily: 'Quicksand' }}>
            Détails de la transaction
          </Text>
          
          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600" style={{ fontFamily: 'Quicksand' }}>Plan</Text>
              <Text className="font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>{planName}</Text>
            </View>
            
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600" style={{ fontFamily: 'Quicksand' }}>Montant</Text>
              <Text className="font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>{amount}$ USD</Text>
            </View>
            
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600" style={{ fontFamily: 'Quicksand' }}>Transaction ID</Text>
              <Text className="text-xs font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>
                {transactionId}
              </Text>
            </View>
            
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600" style={{ fontFamily: 'Quicksand' }}>Statut</Text>
              <View className="flex-row items-center">
                <View className={`w-2 h-2 rounded-full mr-2 ${
                  status === 'failed' ? 'bg-red-500' :
                  status === 'cancelled' ? 'bg-yellow-500' :
                  status === 'pending' ? 'bg-blue-500' : 'bg-gray-500'
                }`} />
                <Text className={`font-medium capitalize ${
                  status === 'failed' ? 'text-red-600' :
                  status === 'cancelled' ? 'text-yellow-600' :
                  status === 'pending' ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {status === 'failed' ? 'Échoué' :
                   status === 'cancelled' ? 'Annulé' :
                   status === 'pending' ? 'En attente' : 'Erreur'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="w-full space-y-4">
          <TouchableOpacity
            onPress={config.buttonAction}
            className="w-full bg-[#8A4DFF] rounded-full py-4"
            activeOpacity={0.8}
          >
            <Text className="text-lg font-semibold text-center text-white" style={{ fontFamily: 'Quicksand' }}>
              {config.buttonText}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleViewHistory}
            className="w-full py-4 border border-gray-300 rounded-full"
            activeOpacity={0.7}
          >
            <Text className="text-lg font-medium text-center text-gray-700" style={{ fontFamily: 'Quicksand' }}>
              Voir l'historique
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleReturnHome}
            className="w-full"
            activeOpacity={0.7}
          >
            <Text className="text-base font-medium text-center text-gray-500" style={{ fontFamily: 'Quicksand' }}>
              Retour aux plans
            </Text>
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        {status === 'pending' && (
          <View className="p-4 mt-8 bg-blue-50 rounded-xl">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#3B82F6" className="mr-2 mt-0.5" />
              <Text className="flex-1 text-sm leading-5 text-blue-800" style={{ fontFamily: 'Quicksand' }}>
                Les paiements peuvent prendre quelques minutes à être traités. 
                Vous recevrez une notification une fois le paiement confirmé.
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
