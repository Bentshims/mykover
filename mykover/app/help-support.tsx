import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HelpSupportScreen() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const contactMethods = [
    {
      id: 'email',
      title: 'Email',
      subtitle: 'support@mykover.cd',
      icon: 'envelope',
      action: () => Linking.openURL('mailto:support@mykover.cd'),
    },
    {
      id: 'phone',
      title: 'Téléphone',
      subtitle: '+243 XX XXX XXXX',
      icon: 'phone',
      action: () => Linking.openURL('tel:+243XXXXXXXX'),
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      subtitle: 'Chat en direct',
      icon: 'message',
      action: () => Linking.openURL('https://wa.me/243XXXXXXXX'),
    },
  ];

  const faqItems = [
    {
      id: '1',
      question: 'Comment souscrire à une assurance ?',
      answer: 'Vous pouvez souscrire directement depuis l\'application en choisissant le plan qui vous convient dans l\'onglet "Plans". Suivez les étapes de paiement pour activer votre couverture.',
    },
    {
      id: '2',
      question: 'Quels sont les moyens de paiement acceptés ?',
      answer: 'Nous acceptons les paiements par Mobile Money (Orange Money, Airtel Money, M-Pesa), cartes bancaires et virements bancaires via CinetPay.',
    },
    {
      id: '3',
      question: 'Comment faire une réclamation ?',
      answer: 'Pour faire une réclamation, rendez-vous dans votre profil, section "Mes réclamations" et suivez les étapes pour soumettre votre demande avec les documents requis.',
    },
    {
      id: '4',
      question: 'Où puis-je utiliser mon assurance ?',
      answer: 'Votre assurance est acceptée dans tous nos hôpitaux et cliniques partenaires à Kinshasa. Consultez la carte des établissements dans l\'onglet "Carte".',
    },
    {
      id: '5',
      question: 'Comment renouveler mon assurance ?',
      answer: 'Le renouvellement peut être automatique si activé dans les paramètres, ou manuel via l\'onglet "Plans" avant l\'expiration de votre couverture actuelle.',
    },
    {
      id: '6',
      question: 'Que faire en cas d\'urgence ?',
      answer: 'En cas d\'urgence médicale, présentez-vous directement dans l\'un de nos hôpitaux partenaires avec votre carte d\'assurance numérique disponible dans l\'application.',
    },
  ];

  const quickActions = [
    {
      id: 'report-bug',
      title: 'Signaler un bug',
      icon: 'bug',
      color: '#EF4444',
      action: () => Alert.alert('Signaler un bug', 'Décrivez le problème rencontré et nous vous contacterons rapidement.'),
    },
    {
      id: 'feature-request',
      title: 'Demander une fonctionnalité',
      icon: 'lightbulb',
      color: '#F59E0B',
      action: () => Alert.alert('Nouvelle fonctionnalité', 'Partagez vos idées pour améliorer l\'application.'),
    },
    {
      id: 'feedback',
      title: 'Donner un avis',
      icon: 'comment',
      color: '#10B981',
      action: () => Alert.alert('Votre avis', 'Votre opinion nous aide à améliorer nos services.'),
    },
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-100 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <FontAwesome6 name="arrow-left" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Aide & Support</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Contact Methods */}
        <View className="px-4 pt-6 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Nous contacter</Text>
          {contactMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm"
              onPress={method.action}
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mr-4">
                  <FontAwesome6 name={method.icon} size={20} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">{method.title}</Text>
                  <Text className="text-gray-600 text-sm">{method.subtitle}</Text>
                </View>
                <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Actions rapides</Text>
          <View className="flex-row justify-between">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex-1 mx-1"
                onPress={action.action}
              >
                <View className="items-center">
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center mb-2"
                    style={{ backgroundColor: `${action.color}20` }}
                  >
                    <FontAwesome6 name={action.icon} size={20} color={action.color} />
                  </View>
                  <Text className="text-sm font-medium text-gray-900 text-center">
                    {action.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Questions fréquentes</Text>
          {faqItems.map((item) => (
            <View key={item.id} className="bg-white rounded-xl mb-3 border border-gray-100 shadow-sm">
              <TouchableOpacity
                className="p-4"
                onPress={() => toggleFAQ(item.id)}
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-900 flex-1 pr-4">
                    {item.question}
                  </Text>
                  <FontAwesome6 
                    name={expandedFAQ === item.id ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color="#9CA3AF" 
                  />
                </View>
              </TouchableOpacity>
              {expandedFAQ === item.id && (
                <View className="px-4 pb-4 border-t border-gray-100">
                  <Text className="text-gray-600 leading-6 mt-3">
                    {item.answer}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Emergency Contact */}
        <View className="px-4 mb-6">
          <View className="bg-red-50 border border-red-200 rounded-xl p-4">
            <View className="flex-row items-center mb-2">
              <FontAwesome6 name="triangle-exclamation" size={20} color="#DC2626" />
              <Text className="font-bold text-red-800 ml-2">Urgence médicale</Text>
            </View>
            <Text className="text-red-700 mb-3">
              En cas d'urgence médicale, contactez immédiatement les services d'urgence ou rendez-vous dans l'hôpital le plus proche.
            </Text>
            <TouchableOpacity
              className="bg-red-600 rounded-lg py-2 px-4"
              onPress={() => Linking.openURL('tel:911')}
            >
              <Text className="text-white font-semibold text-center">
                Appeler les urgences
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View className="px-4">
          <View className="bg-white rounded-xl p-4 border border-gray-100">
            <Text className="font-semibold text-gray-900 mb-2">MyKover</Text>
            <Text className="text-gray-600 text-sm mb-1">Version 1.0.0</Text>
            <Text className="text-gray-600 text-sm">
              Votre assurance santé numérique à Kinshasa
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
