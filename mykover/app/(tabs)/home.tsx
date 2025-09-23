import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import TopNavBarCustom from '../../components/TopNavBarCustom';

// Mock data for stats and recent activity
const mockStats = {
  activePlan: 'Premium Plus',
  coverage: '85%',
  nextPayment: '15 Jan 2024',
  remainingBudget: '$450',
};

const mockRecentActivity = [
  {
    id: '1',
    type: 'consultation',
    title: 'Consultation générale',
    location: 'Clinique Ngaliema',
    date: '2024-01-10',
    amount: '$25',
    status: 'completed',
  },
  {
    id: '2',
    type: 'payment',
    title: 'Paiement plan Premium',
    location: 'MyKover',
    date: '2024-01-08',
    amount: '$50',
    status: 'completed',
  },
  {
    id: '3',
    type: 'pharmacy',
    title: 'Médicaments prescrits',
    location: 'Pharmacie du Peuple',
    date: '2024-01-05',
    amount: '$15',
    status: 'pending',
  },
];

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();

  // Navigation handlers
  const handleInsuranceNavigation = () => {
    router.push('/(tabs)/plans');
  };

  const handleMapNavigation = () => {
    router.push('/(tabs)/map');
  };

  const handlePaymentNavigation = () => {
    router.push('/payment');
  };

  const handleHistoryNavigation = () => {
    router.push('/payment-history');
  };

  const handleNotificationPress = () => {
    // TODO: Implement notification navigation
  };

  const handleAvatarPress = () => {
    if (isAuthenticated) {
      router.push('/(tabs)/menu');
    } else {
      router.push('/login');
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'consultation': return 'medical';
      case 'payment': return 'card';
      case 'pharmacy': return 'medical';
      default: return 'receipt';
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-orange-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#7c3aed" />
      
      {/* Custom Top Navigation */}
      <TopNavBarCustom
        onAvatarPress={handleAvatarPress}
        onNotificationPress={handleNotificationPress}
        notificationCount={3}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Main Content */}
        <View className="px-6 pt-6">
          {/* Welcome Section */}
          <View className="mb-8">
            <Text className="mb-2 text-3xl font-bold text-gray-900">
              Bonjour{user ? `, ${user.fullName.split(' ')[0]}` : ''} ! 👋
            </Text>
            <Text className="text-base leading-6 text-gray-600">
              {isAuthenticated 
                ? 'Gérez votre assurance santé en toute simplicité'
                : 'Découvrez MyKover, votre assurance santé digitale'
              }
            </Text>
          </View>

          {/* Quick Stats Cards */}
          <View className="mb-8">
            <Text className="mb-4 text-xl font-semibold text-gray-900">
              Aperçu rapide
            </Text>
            <View className="flex-row flex-wrap justify-between">
              <View className="w-[48%] p-4 mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <View className="flex-row items-center justify-between mb-2">
                  <Ionicons name="shield-checkmark" size={24} color="white" />
                  <Text className="text-xs text-purple-100">ACTIF</Text>
                </View>
                <Text className="text-lg font-bold text-white">{mockStats.activePlan}</Text>
                <Text className="text-sm text-purple-100">Plan actuel</Text>
              </View>

              <View className="w-[48%] p-4 mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <View className="flex-row items-center justify-between mb-2">
                  <Ionicons name="pie-chart" size={24} color="white" />
                  <Text className="text-xs text-blue-100">COUVERTURE</Text>
                </View>
                <Text className="text-lg font-bold text-white">{mockStats.coverage}</Text>
                <Text className="text-sm text-blue-100">Utilisé ce mois</Text>
              </View>

              <View className="w-[48%] p-4 mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <View className="flex-row items-center justify-between mb-2">
                  <Ionicons name="wallet" size={24} color="white" />
                  <Text className="text-xs text-green-100">BUDGET</Text>
                </View>
                <Text className="text-lg font-bold text-white">{mockStats.remainingBudget}</Text>
                <Text className="text-sm text-green-100">Restant</Text>
              </View>

              <View className="w-[48%] p-4 mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <View className="flex-row items-center justify-between mb-2">
                  <Ionicons name="calendar" size={24} color="white" />
                  <Text className="text-xs text-orange-100">PROCHAIN</Text>
                </View>
                <Text className="text-lg font-bold text-white">{mockStats.nextPayment}</Text>
                <Text className="text-sm text-orange-100">Paiement</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-8">
            <Text className="mb-4 text-xl font-semibold text-gray-900">
              Actions rapides
            </Text>
            <View className="flex-row flex-wrap justify-between">
              <TouchableOpacity
                className="w-[48%] p-6 mb-4 bg-purple-50 border border-purple-200 rounded-xl"
                onPress={handleInsuranceNavigation}
              >
                <View className="items-center">
                  <View className="items-center justify-center w-12 h-12 mb-3 bg-purple-100 rounded-full">
                    <Ionicons name="shield-checkmark" size={24} color="#7c3aed" />
                  </View>
                  <Text className="text-sm font-semibold text-center text-purple-900">
                    Mes Plans
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-[48%] p-6 mb-4 bg-blue-50 border border-blue-200 rounded-xl"
                onPress={handleMapNavigation}
              >
                <View className="items-center">
                  <View className="items-center justify-center w-12 h-12 mb-3 bg-blue-100 rounded-full">
                    <Ionicons name="map" size={24} color="#3b82f6" />
                  </View>
                  <Text className="text-sm font-semibold text-center text-blue-900">
                    Carte
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-[48%] p-6 mb-4 bg-green-50 border border-green-200 rounded-xl"
                onPress={handlePaymentNavigation}
              >
                <View className="items-center">
                  <View className="items-center justify-center w-12 h-12 mb-3 bg-green-100 rounded-full">
                    <Ionicons name="card" size={24} color="#10b981" />
                  </View>
                  <Text className="text-sm font-semibold text-center text-green-900">
                    Paiement
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-[48%] p-6 mb-4 bg-orange-50 border border-orange-200 rounded-xl"
                onPress={handleHistoryNavigation}
              >
                <View className="items-center">
                  <View className="items-center justify-center w-12 h-12 mb-3 bg-orange-100 rounded-full">
                    <Ionicons name="time" size={24} color="#f59e0b" />
                  </View>
                  <Text className="text-sm font-semibold text-center text-orange-900">
                    Historique
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Activity */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-semibold text-gray-900">
                Activité récente
              </Text>
              <TouchableOpacity onPress={handleHistoryNavigation}>
                <Text className="font-medium text-purple-600">Voir tout</Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-3">
              {mockRecentActivity.map((activity) => (
                <TouchableOpacity
                  key={activity.id}
                  className="p-4 bg-white border border-gray-200 rounded-xl"
                  onPress={() => {/* Navigate to activity detail */}}
                >
                  <View className="flex-row items-center">
                    <View className="items-center justify-center w-10 h-10 mr-3 bg-gray-100 rounded-full">
                      <Ionicons 
                        name={getActivityIcon(activity.type) as any} 
                        size={20} 
                        color="#6b7280" 
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900">
                        {activity.title}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {activity.location} • {activity.date}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="font-bold text-gray-900">
                        {activity.amount}
                      </Text>
                      <Text className={`text-xs font-medium ${getActivityColor(activity.status)}`}>
                        {activity.status === 'completed' ? 'Terminé' : 
                         activity.status === 'pending' ? 'En cours' : 'Échoué'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Login prompt for unauthenticated users */}
          {!isAuthenticated && (
            <View className="p-6 mb-8 border border-purple-200 bg-purple-50 rounded-xl">
              <View className="items-center">
                <Ionicons name="person-circle" size={48} color="#7c3aed" />
                <Text className="mt-3 text-lg font-semibold text-purple-900">
                  Connectez-vous pour plus de fonctionnalités
                </Text>
                <Text className="mt-2 text-sm text-center text-purple-700">
                  Accédez à votre profil, gérez vos abonnements et suivez vos paiements
                </Text>
                <TouchableOpacity
                  className="px-6 py-3 mt-4 bg-purple-600 rounded-full"
                  onPress={() => router.push('/login')}
                >
                  <Text className="font-semibold text-white">Se connecter</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
