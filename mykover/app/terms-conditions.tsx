import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function TermsConditionsScreen() {
  const sections = [
    {
      id: '1',
      title: '1. Acceptation des conditions',
      content: `En utilisant l'application MyKover, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.

Ces conditions peuvent être mises à jour périodiquement. Il est de votre responsabilité de consulter régulièrement cette page pour prendre connaissance des modifications.`
    },
    {
      id: '2',
      title: '2. Description du service',
      content: `MyKover est une plateforme d'assurance santé numérique qui permet aux utilisateurs de :
• Souscrire à des plans d'assurance santé
• Gérer leur couverture médicale
• Localiser les établissements de santé partenaires
• Effectuer des réclamations en ligne
• Accéder à leur historique médical

Le service est disponible principalement à Kinshasa, République Démocratique du Congo.`
    },
    {
      id: '3',
      title: '3. Inscription et compte utilisateur',
      content: `Pour utiliser MyKover, vous devez :
• Être âgé d'au moins 18 ans ou avoir l'autorisation parentale
• Fournir des informations exactes et complètes lors de l'inscription
• Maintenir la confidentialité de vos identifiants de connexion
• Nous notifier immédiatement de toute utilisation non autorisée de votre compte

Vous êtes responsable de toutes les activités effectuées sous votre compte.`
    },
    {
      id: '4',
      title: '4. Paiements et remboursements',
      content: `Les paiements sont traités via CinetPay et d'autres prestataires de paiement sécurisés. Les méthodes acceptées incluent :
• Mobile Money (Orange Money, Airtel Money, M-Pesa)
• Cartes bancaires
• Virements bancaires

Les remboursements sont soumis à nos politiques spécifiques et peuvent prendre 5-10 jours ouvrables pour être traités.`
    },
    {
      id: '5',
      title: '5. Couverture d\'assurance',
      content: `La couverture d'assurance est fournie selon les termes de votre plan choisi. Les détails incluent :
• Les services couverts et exclusions
• Les limites de couverture annuelle
• Les franchises applicables
• Les établissements de santé partenaires

Consultez votre police d'assurance pour les détails complets de votre couverture.`
    },
    {
      id: '6',
      title: '6. Utilisation acceptable',
      content: `Vous vous engagez à ne pas :
• Utiliser le service à des fins illégales ou non autorisées
• Tenter d'accéder aux comptes d'autres utilisateurs
• Transmettre des virus ou codes malveillants
• Faire de fausses déclarations pour obtenir une couverture
• Utiliser le service pour frauder ou tromper

Toute violation peut entraîner la suspension ou la résiliation de votre compte.`
    },
    {
      id: '7',
      title: '7. Protection des données',
      content: `Nous nous engageons à protéger vos données personnelles conformément à notre politique de confidentialité. Vos informations médicales sont traitées avec la plus stricte confidentialité.

Nous ne partageons vos données qu'avec :
• Les établissements de santé partenaires (pour les soins)
• Les prestataires de paiement (pour les transactions)
• Les autorités compétentes (si requis par la loi)`
    },
    {
      id: '8',
      title: '8. Limitation de responsabilité',
      content: `MyKover ne peut être tenu responsable de :
• L'interruption temporaire du service
• Les erreurs dans les informations fournies par les tiers
• Les dommages indirects ou consécutifs
• La qualité des soins médicaux fournis par les partenaires

Notre responsabilité est limitée au montant payé pour votre assurance.`
    },
    {
      id: '9',
      title: '9. Résiliation',
      content: `Vous pouvez résilier votre compte à tout moment en nous contactant. Nous pouvons également résilier votre compte en cas de :
• Violation de ces conditions d'utilisation
• Activité frauduleuse
• Non-paiement des primes d'assurance
• Utilisation abusive du service

La résiliation n'affecte pas les obligations déjà contractées.`
    },
    {
      id: '10',
      title: '10. Droit applicable',
      content: `Ces conditions sont régies par les lois de la République Démocratique du Congo. Tout litige sera soumis à la juridiction des tribunaux de Kinshasa.

En cas de conflit entre la version française et toute traduction, la version française prévaudra.`
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-100 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <FontAwesome6 name="arrow-left" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Conditions d'utilisation</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Introduction */}
        <View className="px-4 pt-6 mb-6">
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <View className="flex-row items-center mb-2">
              <FontAwesome6 name="info-circle" size={20} color="#3B82F6" />
              <Text className="font-bold text-blue-800 ml-2">Information importante</Text>
            </View>
            <Text className="text-blue-700">
              Veuillez lire attentivement ces conditions d'utilisation avant d'utiliser MyKover. 
              En utilisant notre service, vous acceptez ces termes.
            </Text>
          </View>

          <Text className="text-sm text-gray-600 mb-4">
            Dernière mise à jour : 29 septembre 2025
          </Text>
        </View>

        {/* Terms Sections */}
        <View className="px-4">
          {sections.map((section) => (
            <View key={section.id} className="bg-white rounded-xl p-4 mb-4 border border-gray-100 shadow-sm">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                {section.title}
              </Text>
              <Text className="text-gray-700 leading-6">
                {section.content}
              </Text>
            </View>
          ))}
        </View>

        {/* Contact Information */}
        <View className="px-4 mt-6">
          <View className="bg-gray-100 rounded-xl p-4">
            <Text className="font-bold text-gray-900 mb-2">Contact</Text>
            <Text className="text-gray-700 mb-1">
              Pour toute question concernant ces conditions d'utilisation :
            </Text>
            <Text className="text-blue-600 font-medium">support@mykover.cd</Text>
            <Text className="text-gray-600 text-sm mt-2">
              MyKover - Assurance Santé Numérique{'\n'}
              Kinshasa, République Démocratique du Congo
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
