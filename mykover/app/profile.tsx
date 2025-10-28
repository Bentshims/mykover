import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  userUid: string;
  policyNumber: string | null;
  insuranceStatus: 'ACTIVE' | 'INACTIVE';
  isActive: boolean;
  activeUntil: string | null;
  createdAt: string;
  // optional fields displayed in UI (may be undefined until your backend adds them)
  insurancePlan?: string | null;
  nextPaymentDate?: string | null;
  premium?: string | null;
  avatarUrl?: string | null;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // simple animations (no external libs)
  const fadeHeader = useRef(new Animated.Value(0)).current;
  const fadeCard = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.stagger(120, [
        Animated.timing(fadeHeader, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeCard, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [loading, fadeHeader, fadeCard]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/auth/me');
      if (response.data?.success) {
        const userData = response.data.data.user;
        setProfile({
          id: userData.id,
          fullName: userData.fullname || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
          email: userData.email,
          phoneNumber: userData.phone,
          userUid: userData.id,
          policyNumber: userData.policyNumber ?? null,
          insuranceStatus: (userData.insuranceStatus as 'ACTIVE' | 'INACTIVE') ?? 'INACTIVE',
          isActive: !!userData.isActive,
          activeUntil: userData.activeUntil ?? null,
          createdAt: userData.createdAt || new Date().toISOString(),
          insurancePlan: userData.insurancePlan ?? null,
          nextPaymentDate: userData.nextPaymentDate ?? null,
          premium: userData.premium ?? null,
          avatarUrl: userData.avatarUrl ?? null,
        });
      } else {
        Alert.alert('Erreur', 'Impossible de récupérer les informations du profil.');
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        Alert.alert('Session expirée', 'Veuillez vous reconnecter');
        router.replace('/login');
      } else {
        Alert.alert('Erreur', 'Impossible de charger le profil');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const initialsFromName = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#8A4DFF" />
          <Text className="mt-4 text-gray-600" style={{ fontFamily: 'Quicksand' }}>Chargement du profil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <FontAwesome6 name="arrow-left" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Mon profil</Text>
        <View className="flex-1" />
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <MaterialIcons name="settings" size={22} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Profile Header */}
        <Animated.View style={{ opacity: fadeHeader }}>
          <View className="p-6 mx-4 mt-4 bg-white shadow-sm rounded-xl">
            <View className="items-center mb-4">
              {profile?.avatarUrl ? (
                <Image
                  source={{ uri: profile.avatarUrl }}
                  className="w-20 h-20 mb-3 rounded-full"
                />
              ) : (
                <View className="w-20 h-20 mb-3 rounded-full bg-[#EDE9FE] items-center justify-center">
                  <Text className="text-xl font-bold text-[#4C1D95]" style={{ fontFamily: 'Quicksand' }}>
                    {initialsFromName(profile?.fullName)}
                  </Text>
                </View>
              )}

              <Text className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>{profile?.fullName || 'Utilisateur'}</Text>
              <Text className="text-gray-600" style={{ fontFamily: 'Quicksand' }}>{profile?.email}</Text>

              {/* small edit profile row */}
              <View className="flex-row mt-3">
                <TouchableOpacity
                  onPress={() => router.push('/profile')}
                  className="flex-row items-center px-3 py-2 bg-white border border-gray-200 rounded-full shadow-sm"
                >
                  <FontAwesome6 name="pen" size={14} color="#6B7280" />
                  <Text className="ml-2 text-sm text-gray-700" style={{ fontFamily: 'Quicksand' }}>Modifier</Text>
                </TouchableOpacity>
                <View style={{ width: 12 }} />
                <TouchableOpacity
                  onPress={() => router.push('/payment-history')}
                  className="flex-row items-center px-3 py-2 bg-white border border-gray-200 rounded-full shadow-sm"
                >
                  <FontAwesome6 name="receipt" size={14} color="#6B7280" />
                  <Text className="ml-2 text-sm text-gray-700" style={{ fontFamily: 'Quicksand' }}>Paiements</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Status Badge */}
            <View className="flex-row justify-center">
              <View
                className={`px-4 py-2 rounded-full ${profile?.isActive ? 'bg-green-100' : 'bg-red-100'}`}
              >
                <Text className={`font-bold ${profile?.isActive ? 'text-green-700' : 'text-red-700'}`}>
                  {profile?.isActive ? 'Assurance Active' : 'Assurance Inactive'}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Insurance Summary Card (most important business info) */}
        <Animated.View style={{ opacity: fadeCard }}>
          <View className="p-4 mx-4 mt-4 bg-white border border-gray-100 shadow-sm rounded-xl">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Résumé de l'assurance</Text>
              <FontAwesome6 name="shield-halved" size={18} color="#6B7280" />
            </View>

            <View className="space-y-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600" style={{ fontFamily: 'Quicksand' }}>Plan</Text>
                <Text className="font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>
                  {profile?.insurancePlan ?? '—'}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600" style={{ fontFamily: 'Quicksand' }}>Statut</Text>
                <View
                  className={`px-3 py-1 rounded-full ${profile?.isActive ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  <Text className="text-xs font-bold text-white" style={{ fontFamily: 'Quicksand' }}>
                    {profile?.insuranceStatus ?? (profile?.isActive ? 'ACTIVE' : 'INACTIVE')}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600" style={{ fontFamily: 'Quicksand' }}>Prochaine échéance</Text>
                <Text className="font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>
                  {profile?.nextPaymentDate ? formatDate(profile.nextPaymentDate) : 'Aucun'}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600" style={{ fontFamily: 'Quicksand' }}>Cotisation</Text>
                <Text className="font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>
                  {profile?.premium ?? '—'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => router.push('/plans')}
                className="mt-3 bg-[#8A4DFF] py-3 rounded-full items-center"
                activeOpacity={0.85}
              >
                <Text className="font-semibold text-white" style={{ fontFamily: 'Quicksand' }}>Voir les détails du plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Personal Info */}
        <View className="p-4 mx-4 mt-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <View className="p-1 mb-3 border-b border-gray-100">
            <Text className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Informations personnelles</Text>
          </View>

          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600" style={{ fontFamily: 'Quicksand' }}>Nom complet</Text>
              <Text className="font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>{profile?.fullName}</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600" style={{ fontFamily: 'Quicksand' }}>Email</Text>
              <Text className="font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>{profile?.email}</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600" style={{ fontFamily: 'Quicksand' }}>Téléphone</Text>
              <Text className="font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>{profile?.phoneNumber ?? '—'}</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600" style={{ fontFamily: 'Quicksand' }}>Membre depuis</Text>
              <Text className="font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>{formatDate(profile?.createdAt)}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="mx-4 mt-6 space-y-3 flex flex-col gap-2">
         

          <TouchableOpacity
            className="flex-row items-center justify-between px-4 py-6 bg-white border border-gray-100 rounded-xl"
            onPress={() => router.push('/payment-history')}
          >
            <View className="flex-row items-center">
              <FontAwesome6 name="receipt" size={20} color="#6B7280" />
              <Text className="ml-3 font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>Historique des paiements</Text>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between px-4 py-6 bg-white border border-gray-100 rounded-xl"
            onPress={() => router.push('/terms-conditions')}
          >
            <View className="flex-row items-center">
              <FontAwesome6 name="file-contract" size={20} color="#6B7280" />
              <Text className="ml-3 font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>Documents d'assurance</Text>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between px-4 py-6 bg-white border border-gray-100 rounded-xl"
            onPress={() => router.push('/help-support')}
          >
            <View className="flex-row items-center">
              <FontAwesome6 name="headset" size={20} color="#6B7280" />
              <Text className="ml-3 font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>Support client</Text>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
