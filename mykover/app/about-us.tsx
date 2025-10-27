import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AboutUsScreen() {
  const features = [
    {
      title: 'Couverture Santé Fiable',
      description: 'Accédez à un réseau étendu de cliniques et hôpitaux partenaires pour des soins de qualité.',
      icon: 'shield-heart',
    },
    {
      title: 'Paiement Mobile Sécurisé',
      description: 'Payez facilement via Mobile Money ou cartes bancaires, sécurisé et rapide.',
      icon: 'mobile-screen',
    },
    {
      title: 'Réclamations Rapides',
      description: 'Soumettez vos demandes et suivez vos remboursements directement depuis l’application.',
      icon: 'file-invoice',
    },
    {
      title: 'Support 24/7',
      description: 'Notre équipe est disponible à tout moment pour répondre à vos questions.',
      icon: 'headset',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <FontAwesome6 name="arrow-left" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>À propos</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4">
        {/* Hero Section */}
        <View className="items-center p-6 mb-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <View className="w-20 h-20 bg-[#8A4DFF] rounded-full items-center justify-center mb-3">
            <FontAwesome6 name="shield-heart" size={32} color="#fff" />
          </View>
          <Text className="mb-1 text-2xl font-bold text-center text-gray-900" style={{ fontFamily: 'Quicksand' }}>MyKover</Text>
          <Text className="text-base leading-6 text-center text-gray-600" style={{ fontFamily: 'Quicksand' }}>
            Votre partenaire santé numérique en RDC
          </Text>
        </View>

        {/* Mission */}
        <View className="mb-6">
          <Text className="mb-2 text-xl font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Notre Mission</Text>
          <Text className="text-base leading-6 text-gray-700" style={{ fontFamily: 'Quicksand' }}>
            Offrir un accès simple, rapide et transparent aux soins de santé grâce à une assurance digitale fiable, adaptée aux besoins de tous les Congolais.
          </Text>
        </View>

        {/* Features */}
        <View className="mb-6">
          <Text className="mb-4 text-xl font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Nos Services</Text>
          <View className="space-y-3">
            {features.map((feature, index) => (
              <View
                key={index}
                className="flex-row items-start p-4 bg-white border border-gray-100 shadow-sm rounded-2xl"
              >
                <View className="w-10 h-10 bg-[#8A4DFF] rounded-full items-center justify-center mr-3">
                  <FontAwesome6 name={feature.icon} size={18} color="#fff" />
                </View>
                <View className="flex-1">
                  <Text className="mb-1 font-semibold text-gray-900" style={{ fontFamily: 'Quicksand' }}>{feature.title}</Text>
                  <Text className="text-sm leading-5 text-gray-600" style={{ fontFamily: 'Quicksand' }}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Credibility / Why Choose Us */}
        <View className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <Text className="mb-2 text-xl font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Pourquoi nous choisir ?</Text>
          <Text className="text-base leading-6 text-gray-700" style={{ fontFamily: 'Quicksand' }}>
            • Données personnelles sécurisées et cryptées{"\n"}
            • Assurance transparente et conforme aux normes locales{"\n"}
            • Support client disponible 24/7{"\n"}
            • Équipe expérimentée en santé digitale et fintech
          </Text>
        </View>

        {/* Contact */}
        <View className="mb-6">
          <Text className="mb-4 text-xl font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Contact</Text>
          <View className="space-y-3">
            <TouchableOpacity
              className="flex-row items-center p-4 bg-white border border-gray-100 shadow-sm rounded-2xl"
              onPress={() => Linking.openURL('mailto:support@mykover.cd')}
            >
              <FontAwesome6 name="envelope" size={20} color="#8A4DFF" className="mr-3" />
              <Text className="text-base text-gray-800" style={{ fontFamily: 'Quicksand' }}>support@mykover.cd</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 bg-white border border-gray-100 shadow-sm rounded-2xl"
              onPress={() => Linking.openURL('tel:+243970000000')}
            >
              <FontAwesome6 name="phone" size={20} color="#8A4DFF" className="mr-3" />
              <Text className="text-base text-gray-800" style={{ fontFamily: 'Quicksand' }}>+243 970 000 000</Text>
            </TouchableOpacity>

            <View className="flex-row items-center p-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
              <FontAwesome6 name="location-dot" size={20} color="#8A4DFF" className="mr-3" />
              <Text className="text-base text-gray-800" style={{ fontFamily: 'Quicksand' }}>Kinshasa, RDC</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center pt-6 border-t border-gray-100">
          <Text className="mb-1 text-sm text-gray-500" style={{ fontFamily: 'Quicksand' }}>MyKover © 2025</Text>
          <Text className="text-xs text-center text-gray-400" style={{ fontFamily: 'Quicksand' }}>Assurance santé digitale fiable pour tous</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
