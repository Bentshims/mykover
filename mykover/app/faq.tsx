import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function FAQScreen() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqItems = [
    {
      id: '1',
      question: 'Comment souscrire à une assurance ?',
      answer: "Vous pouvez souscrire directement depuis l'application en choisissant le plan qui vous convient dans l'onglet \"Plans\". Suivez les étapes de paiement pour activer votre couverture.",
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
      answer: "Votre assurance est acceptée dans tous nos hôpitaux et cliniques partenaires à Kinshasa. Consultez la carte des établissements dans l'onglet \"Carte\".",
    },
    {
      id: '5',
      question: 'Comment renouveler mon assurance ?',
      answer: "Le renouvellement peut être automatique si activé dans les paramètres, ou manuel via l'onglet \"Plans\" avant l'expiration de votre couverture actuelle.",
    },
    {
      id: '6',
      question: "Que faire en cas d'urgence ?",
      answer: "En cas d'urgence médicale, présentez-vous directement dans l'un de nos hôpitaux partenaires avec votre carte d'assurance numérique disponible dans l'application.",
    },
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <FontAwesome6 name="arrow-left" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Questions fréquentes</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        <View className="px-4 pt-6">
          {faqItems.map((item) => (
            <View key={item.id} className="mb-3 bg-white border border-gray-100 shadow-sm rounded-xl">
              <TouchableOpacity className="p-4" onPress={() => toggleFAQ(item.id)}>
                <View className="flex-row items-center justify-between">
                  <Text className="flex-1 pr-4 font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>
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
                  <Text className="mt-3 leading-6 text-gray-600" style={{ fontFamily: 'Quicksand' }}>
                    {item.answer}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
