import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AboutUsScreen() {
  const teamMembers = [
    {
      name: 'Dr. Jean Mukendi',
      role: 'Directeur Médical',
      icon: 'user-doctor',
    },
    {
      name: 'Marie Kalala',
      role: 'Directrice Technique',
      icon: 'laptop-code',
    },
    {
      name: 'Pierre Tshisekedi',
      role: 'Directeur Commercial',
      icon: 'handshake',
    },
  ];

  const values = [
    {
      title: 'Accessibilité',
      description: 'Rendre l\'assurance santé accessible à tous les Congolais',
      icon: 'universal-access',
      color: '#3B82F6',
    },
    {
      title: 'Innovation',
      description: 'Utiliser la technologie pour simplifier l\'accès aux soins',
      icon: 'lightbulb',
      color: '#F59E0B',
    },
    {
      title: 'Transparence',
      description: 'Des processus clairs et des tarifs transparents',
      icon: 'eye',
      color: '#10B981',
    },
    {
      title: 'Qualité',
      description: 'Partenariat avec les meilleurs établissements de santé',
      icon: 'award',
      color: '#8B5CF6',
    },
  ];

  const stats = [
    { label: 'Utilisateurs actifs', value: '10,000+', icon: 'users' },
    { label: 'Hôpitaux partenaires', value: '50+', icon: 'hospital' },
    { label: 'Réclamations traitées', value: '5,000+', icon: 'file-medical' },
    { label: 'Taux de satisfaction', value: '95%', icon: 'star' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-100 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <FontAwesome6 name="arrow-left" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">À propos de nous</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Hero Section */}
        <View className="px-4 pt-6 mb-6">
          <View className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 mb-6">
            <View className="items-center">
              <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-4">
                <FontAwesome6 name="shield-heart" size={32} color="#8B5CF6" />
              </View>
              <Text className="text-2xl font-bold text-white text-center mb-2">
                MyKover
              </Text>
              <Text className="text-purple-100 text-center">
                Votre assurance santé numérique à Kinshasa
              </Text>
            </View>
          </View>
        </View>

        {/* Mission */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Notre Mission</Text>
          <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <Text className="text-gray-700 leading-6">
              Démocratiser l'accès aux soins de santé de qualité en République Démocratique du Congo 
              grâce à une plateforme d'assurance santé numérique innovante, accessible et transparente.
            </Text>
          </View>
        </View>

        {/* Story */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Notre Histoire</Text>
          <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <Text className="text-gray-700 leading-6 mb-4">
              Fondée en 2024 à Kinshasa, MyKover est née de la vision de rendre l'assurance santé 
              accessible à tous les Congolais. Nous avons identifié les défis majeurs du système 
              de santé traditionnel et développé une solution numérique pour les surmonter.
            </Text>
            <Text className="text-gray-700 leading-6">
              Aujourd'hui, nous servons des milliers de familles à travers Kinshasa et continuons 
              d'étendre notre réseau de partenaires pour offrir les meilleurs soins possibles.
            </Text>
          </View>
        </View>

        {/* Values */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Nos Valeurs</Text>
          <View className="grid grid-cols-2 gap-3">
            {values.map((value, index) => (
              <View key={index} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center mb-3"
                  style={{ backgroundColor: `${value.color}20` }}
                >
                  <FontAwesome6 name={value.icon} size={20} color={value.color} />
                </View>
                <Text className="font-semibold text-gray-900 mb-2">{value.title}</Text>
                <Text className="text-sm text-gray-600">{value.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Statistics */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Nos Chiffres</Text>
          <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            {stats.map((stat, index) => (
              <View key={index} className={`flex-row items-center justify-between py-3 ${
                index < stats.length - 1 ? 'border-b border-gray-100' : ''
              }`}>
                <View className="flex-row items-center">
                  <FontAwesome6 name={stat.icon} size={20} color="#6B7280" />
                  <Text className="ml-3 text-gray-700">{stat.label}</Text>
                </View>
                <Text className="font-bold text-purple-600">{stat.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Team */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Notre Équipe</Text>
          {teamMembers.map((member, index) => (
            <View key={index} className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                  <FontAwesome6 name={member.icon} size={20} color="#8B5CF6" />
                </View>
                <View>
                  <Text className="font-semibold text-gray-900">{member.name}</Text>
                  <Text className="text-gray-600 text-sm">{member.role}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Contact */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Nous Contacter</Text>
          <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <TouchableOpacity 
              className="flex-row items-center py-3 border-b border-gray-100"
              onPress={() => Linking.openURL('mailto:contact@mykover.cd')}
            >
              <FontAwesome6 name="envelope" size={20} color="#6B7280" />
              <Text className="ml-3 text-gray-700">contact@mykover.cd</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-row items-center py-3 border-b border-gray-100"
              onPress={() => Linking.openURL('tel:+243XXXXXXXX')}
            >
              <FontAwesome6 name="phone" size={20} color="#6B7280" />
              <Text className="ml-3 text-gray-700">+243 XX XXX XXXX</Text>
            </TouchableOpacity>
            
            <View className="flex-row items-center py-3">
              <FontAwesome6 name="location-dot" size={20} color="#6B7280" />
              <Text className="ml-3 text-gray-700">Kinshasa, RD Congo</Text>
            </View>
          </View>
        </View>

        {/* Social Media */}
        <View className="px-4">
          <Text className="text-lg font-bold text-gray-900 mb-4">Suivez-nous</Text>
          <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <View className="flex-row justify-around">
              <TouchableOpacity 
                className="items-center"
                onPress={() => Linking.openURL('https://facebook.com/mykover')}
              >
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                  <FontAwesome6 name="facebook" size={20} color="#1877F2" />
                </View>
                <Text className="text-sm text-gray-600">Facebook</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="items-center"
                onPress={() => Linking.openURL('https://twitter.com/mykover')}
              >
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                  <FontAwesome6 name="twitter" size={20} color="#1DA1F2" />
                </View>
                <Text className="text-sm text-gray-600">Twitter</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="items-center"
                onPress={() => Linking.openURL('https://linkedin.com/company/mykover')}
              >
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                  <FontAwesome6 name="linkedin" size={20} color="#0A66C2" />
                </View>
                <Text className="text-sm text-gray-600">LinkedIn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
