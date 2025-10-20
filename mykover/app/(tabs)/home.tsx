
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import TopNavBarCustom from '../../components/TopNavBarCustom';
import api from '../../services/api';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  policyNumber: string | null;
  insuranceStatus: 'ACTIVE' | 'INACTIVE';
  isActive: boolean;
  activeUntil: string | null;
  planName: string | null;
  createdAt: string;
}

interface RecentActivity {
  id: string;
  description: string;
  amount?: string;
  date: string;
  type: 'payment' | 'consultation' | 'claim';
}

export default function HomeScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handlePayment = () => router.push('/plans');
  const handleClinics = () => router.push('/map');
  const handleAssistance = () => router.push('/help-support');
  const handlePlans = () => router.push('/plans');
  const handleAvatarPress = () => router.push('/profile');

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const response = await api.get('/api/auth/me');
      if (response.data.success) {
        const userData = response.data.data.user;
        setProfile({
          id: userData.id,
          fullName: userData.fullname,
          email: userData.email,
          phoneNumber: userData.phone,
          policyNumber: null, // TODO: Add insurance endpoint
          insuranceStatus: 'INACTIVE', // TODO: Add insurance endpoint
          isActive: false, // TODO: Add insurance endpoint
          activeUntil: null, // TODO: Add insurance endpoint
          planName: null, // TODO: Add insurance endpoint
          createdAt: userData.createdAt || new Date().toISOString(),
        });
      }

      // TODO: Fetch recent activities from backend when endpoint is available
      // For now, using empty array until backend endpoint is ready
      setRecentActivities([]);
    } catch (error: any) {
      console.error('Error fetching home data:', error);
      if (error.response?.status === 401) {
        Alert.alert('Session expirée', 'Veuillez vous reconnecter');
        router.replace('/login');
      } else {
        Alert.alert('Erreur', 'Impossible de charger les données');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#8A4DFF" />
          <Text className="mt-4 text-gray-600">Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

      <TopNavBarCustom onAvatarPress={handleAvatarPress} notificationCount={2} />

      <ScrollView 
        className="px-6 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8A4DFF']} />
        }
      >
        {/* Greeting */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            Bonjour, {profile ? getFirstName(profile.fullName) : 'Utilisateur'} 👋
          </Text>
          <Text className="mt-1 text-base text-gray-600">
            Voici un aperçu de votre couverture santé.
          </Text>
        </View>

        {/* Current Plan Card */}
        <View className="p-5 mb-6 bg-white shadow-sm rounded-2xl">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-lg font-semibold text-gray-900">Plan actuel</Text>
            <Ionicons 
              name={profile?.isActive ? "shield-checkmark" : "shield-outline"} 
              size={26} 
              color={profile?.isActive ? "#8A4DFF" : "#9CA3AF"} 
            />
          </View>
          <Text className="text-base text-gray-700">
            {profile?.planName || 'Aucun plan actif'}
          </Text>
          {profile?.activeUntil && (
            <Text className="mt-1 text-sm text-gray-500">
              Expire le : {formatDate(profile.activeUntil)}
            </Text>
          )}
          <Text className={`mt-1 text-sm font-semibold ${profile?.isActive ? 'text-green-600' : 'text-red-600'}`}>
            Statut : {profile?.isActive ? 'Actif' : 'Inactif'}
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="flex-row flex-wrap justify-between">
          {[
            { icon: 'document-text' as const, label: 'Mon plan', action: handlePlans, type: 'ionicons' as const },
            { icon: 'wallet' as const, label: 'Payer', action: handlePayment, type: 'ionicons' as const },
            { icon: 'medkit' as const, label: 'Partenaires', action: handleClinics, type: 'ionicons' as const },
            { icon: 'headset' as const, label: 'Assistance 24/7', action: handleAssistance, type: 'fontawesome' as const },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.action}
              className="bg-white w-[48%] rounded-2xl p-4 mb-4 shadow-sm items-center justify-center"
              activeOpacity={0.8}
            >
              {item.type === 'fontawesome' ? (
                <FontAwesome6 name={item.icon} size={30} color="#8A4DFF"/>
              ) : (
                <Ionicons name={item.icon} size={30} color="#8A4DFF"/>
              )}
              <Text className="mt-2 font-semibold text-gray-800">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View className="p-5 mt-6 bg-white shadow-sm rounded-2xl">
          <Text className="mb-3 text-lg font-semibold text-gray-900">Activité récente</Text>
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <View 
                key={activity.id} 
                className={`flex-row items-center justify-between ${index < recentActivities.length - 1 ? 'mb-2' : ''}`}
              >
                <Text className="text-gray-700">{activity.description}</Text>
                <Text className="text-sm text-gray-500">
                  {activity.amount || formatDate(activity.date)}
                </Text>
              </View>
            ))
          ) : (
            <View className="items-center py-4">
              <Ionicons name="time-outline" size={32} color="#9CA3AF" />
              <Text className="mt-2 text-sm text-gray-500">Aucune activité récente</Text>
            </View>
          )}
        </View>

        {/* CTA */}
        <TouchableOpacity
          className="bg-[#8A4DFF] rounded-full py-4 mt-10 mb-8 shadow-lg"
          onPress={handlePlans}
          activeOpacity={0.85}
        >
          <Text className="text-lg font-semibold text-center text-white">
            Voir mes formules
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}





