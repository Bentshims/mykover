import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../src/contexts/AuthContext';
import api from '../../services/api';

interface UserProfile {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
}

export default function MenuScreen() {
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/api/me');
      if (response.data.success) {
        setUserProfile(response.data.data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'transactions',
      title: 'Transactions',
      icon: 'receipt',
      onPress: () => router.push('/payment-history'),
    },
    {
      id: 'notifications',
      title: 'Notification Inbox',
      icon: 'bell',
      badge: 5,
      onPress: () => Alert.alert('Info', 'Fonctionnalité en développement'),
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'gear',
      onPress: () => router.push('/settings'),
    },
    {
      id: 'hospitals',
      title: 'Partner Hospitals',
      icon: 'hospital',
      onPress: () => router.push('/map'),
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: 'headset',
      onPress: () => Alert.alert('Support', 'Contactez-nous à support@mykover.cd'),
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: 'file-contract',
      onPress: () => Alert.alert('Info', 'Conditions d\'utilisation'),
    },
    {
      id: 'about',
      title: 'About Us',
      icon: 'info-circle',
      onPress: () => Alert.alert('MyKover', 'Votre assurance santé numérique à Kinshasa'),
    },
    {
      id: 'rate',
      title: 'Rate Us',
      icon: 'star',
      onPress: () => Alert.alert('Merci!', 'Évaluez-nous sur l\'App Store'),
    },
  ];

  const MenuItem = ({ item }: { item: typeof menuItems[0] }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 mb-3 bg-white border border-gray-100 shadow-sm rounded-xl"
      onPress={item.onPress}
    >
      <View className="items-center justify-center w-10 h-10 mr-4 rounded-full bg-blue-50">
        <FontAwesome6 name={item.icon} size={18} color="#007AFF" />
      </View>
      
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900">{item.title}</Text>
      </View>

      {item.badge && (
        <View className="items-center justify-center w-6 h-6 mr-2 bg-red-500 rounded-full">
          <Text className="text-xs font-bold text-white">{item.badge}</Text>
        </View>
      )}

      <FontAwesome6 name="chevron-right" size={14} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Menu</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Profile Summary */}
        <View className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <View className="flex-row items-center">
            <View className="items-center justify-center w-16 h-16 mr-4 bg-blue-100 rounded-full">
              <FontAwesome6 name="user" size={24} color="#007AFF" />
            </View>
            
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900">
                {user?.fullName || userProfile?.fullName || 'Chargement...'}
              </Text>
              <Text className="mt-1 text-gray-600">
                {user?.phoneNumber || userProfile?.phoneNumber || ''}
              </Text>
            </View>

            <TouchableOpacity
              className="p-2"
              onPress={() => router.push('/profile')}
            >
              <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        {menuItems.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center p-4 mt-4 mb-8 border border-red-100 shadow-sm bg-red-50 rounded-xl"
          onPress={handleLogout}
        >
          <FontAwesome6 name="right-from-bracket" size={18} color="#EF4444" className="mr-3" />
          <Text className="ml-3 text-base font-semibold text-red-600">Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
