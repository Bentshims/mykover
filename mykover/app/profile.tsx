import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';

interface UserProfile {
  id: string; // ✅ CORRIGÉ - Le backend retourne un UUID (string)
  fullName: string;
  email: string;
  phoneNumber: string;
  userUid: string;
  policyNumber: string | null;
  insuranceStatus: 'ACTIVE' | 'INACTIVE';
  isActive: boolean;
  activeUntil: string | null;
  createdAt: string;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/auth/me');
      if (response.data.success) {
        const userData = response.data.data.user;
        setProfile({
          id: userData.id,
          fullName: userData.fullname, // Backend utilise "fullname" pas "fullName"
          email: userData.email,
          phoneNumber: userData.phone, // Backend utilise "phone" pas "phoneNumber"
          userUid: userData.id, // Utiliser l'ID comme UID
          policyNumber: null, // TODO: Add insurance endpoint
          insuranceStatus: 'INACTIVE', // TODO: Add insurance endpoint
          isActive: false, // TODO: Add insurance endpoint
          activeUntil: null, // TODO: Add insurance endpoint
          createdAt: userData.createdAt || new Date().toISOString(),
        });
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text className="mt-4 text-gray-600">Chargement du profil...</Text>
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
        <Text className="text-xl font-bold text-gray-900">Mon Profil</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Profile Header */}
        <View className="p-6 mx-4 mt-4 bg-white border border-gray-100 rounded-xl">
          <View className="items-center mb-6">
            <View className="items-center justify-center w-20 h-20 mb-4 bg-blue-100 rounded-full">
              <FontAwesome6 name="user" size={32} color="#007AFF" />
            </View>
            <Text className="text-2xl font-bold text-gray-900">{profile?.fullName}</Text>
            <Text className="text-gray-600">{profile?.email}</Text>
          </View>

          {/* Status Badge */}
          <View className="flex-row justify-center mb-4">
            <View className={`px-4 py-2 rounded-full ${profile?.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
              <Text className={`font-bold ${profile?.isActive ? 'text-green-700' : 'text-red-700'}`}>
                {profile?.isActive ? 'Assurance Active' : 'Assurance Inactive'}
              </Text>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View className="mx-4 mt-4 bg-white border border-gray-100 rounded-xl">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-bold text-gray-900">Informations Personnelles</Text>
          </View>
          
          <View className="p-4 space-y-4">
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-gray-600">Nom complet</Text>
              <Text className="font-medium text-gray-900">{profile?.fullName}</Text>
            </View>
            
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-gray-600">Email</Text>
              <Text className="font-medium text-gray-900">{profile?.email}</Text>
            </View>
            
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-gray-600">Téléphone</Text>
              <Text className="font-medium text-gray-900">{profile?.phoneNumber}</Text>
            </View>
            
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-gray-600">UID Utilisateur</Text>
              <Text className="text-xs font-medium text-gray-900">{profile?.userUid}</Text>
            </View>
          </View>
        </View>

        {/* Insurance Information */}
        <View className="mx-4 mt-4 bg-white border border-gray-100 rounded-xl">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-bold text-gray-900">Informations d'Assurance</Text>
          </View>
          
          <View className="p-4 space-y-4">
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-gray-600">Statut</Text>
              <View className={`px-3 py-1 rounded-full ${profile?.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                <Text className="text-xs font-bold text-white">
                  {profile?.insuranceStatus}
                </Text>
              </View>
            </View>
            
            {profile?.policyNumber && (
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-gray-600">Numéro de Police</Text>
                <Text className="text-xs font-medium text-gray-900">{profile.policyNumber}</Text>
              </View>
            )}
            
            {profile?.activeUntil && (
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-gray-600">Active jusqu'au</Text>
                <Text className="font-medium text-gray-900">{formatDate(profile.activeUntil)}</Text>
              </View>
            )}
            
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-gray-600">Membre depuis</Text>
              <Text className="font-medium text-gray-900">{formatDate(profile?.createdAt || '')}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mx-4 mt-6 space-y-3">
          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 bg-white border border-gray-100 rounded-xl"
            onPress={() => router.push('/settings')}
          >
            <View className="flex-row items-center">
              <FontAwesome6 name="gear" size={20} color="#6B7280" />
              <Text className="ml-3 font-medium text-gray-900">Paramètres</Text>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 bg-white border border-gray-100 rounded-xl"
            onPress={() => router.push('/payment-history')}
          >
            <View className="flex-row items-center">
              <FontAwesome6 name="receipt" size={20} color="#6B7280" />
              <Text className="ml-3 font-medium text-gray-900">Historique des Paiements</Text>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 bg-white border border-gray-100 rounded-xl"
            onPress={() => router.push('/terms-conditions')}
          >
            <View className="flex-row items-center">
              <FontAwesome6 name="file-contract" size={20} color="#6B7280" />
              <Text className="ml-3 font-medium text-gray-900">Documents d'Assurance</Text>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 bg-white border border-gray-100 rounded-xl"
            onPress={() => router.push('/help-support')}
          >
            <View className="flex-row items-center">
              <FontAwesome6 name="headset" size={20} color="#6B7280" />
              <Text className="ml-3 font-medium text-gray-900">Support Client</Text>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
