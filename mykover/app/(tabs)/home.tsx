
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import TopNavBarCustom from '../../components/TopNavBarCustom';

export default function HomeScreen() {
  const handlePayment = () => router.push('/plans');
  const handleClinics = () => router.push('/map');
  const handleAssistance = () => router.push('/help-support');
  const handlePlans = () => router.push('/plans');
  const handleAvatarPress = () => router.push('/profile');

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

      <TopNavBarCustom onAvatarPress={handleAvatarPress} notificationCount={2} />

      <ScrollView className="px-6 pt-4">
        {/* Greeting */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900">Bonjour, Newton 👋</Text>
          <Text className="mt-1 text-base text-gray-600">
            Voici un aperçu de votre couverture santé.
          </Text>
        </View>

        {/* Current Plan Card */}
        <View className="p-5 mb-6 bg-white shadow-sm rounded-2xl">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-lg font-semibold text-gray-900">Plan actuel</Text>
            <Ionicons name="shield-checkmark" size={26} color="#8A4DFF" />
          </View>
          <Text className="text-base text-gray-700">Family Basic</Text>
          <Text className="mt-1 text-sm text-gray-500">Expire le : 28 Octobre 2025</Text>
          <Text className="mt-1 text-sm font-semibold text-green-600">Statut : Actif</Text>
        </View>

        {/* Quick Actions */}
        <View className="flex-row flex-wrap justify-between">
          {[
            { icon: 'document-text', label: 'Mon plan', action: handlePlans },
            { icon: 'wallet', label: 'Payer', action: handlePayment },
            { icon: 'medkit', label: 'Cliniques', action: handleClinics },
            { icon: 'headset', label: 'Assistance 24/7', action: handleAssistance },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.action}
              className="bg-white w-[48%] rounded-2xl p-4 mb-4 shadow-sm items-center justify-center"
              activeOpacity={0.8}
            >
              <Ionicons name={item.icon} size={30} color="#8A4DFF" />
              <Text className="mt-2 font-semibold text-gray-800">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View className="p-5 mt-6 bg-white shadow-sm rounded-2xl">
          <Text className="mb-3 text-lg font-semibold text-gray-900">Activité récente</Text>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-700">Paiement via M-Pesa</Text>
            <Text className="text-sm text-gray-500">25 000 CDF</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-700">Consultation - Clinique Espoir</Text>
            <Text className="text-sm text-gray-500">02 Oct 2025</Text>
          </View>
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
