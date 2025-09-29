import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function RateUsScreen() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const ratingLabels = [
    { value: 1, label: 'Très mauvais', emoji: '😞' },
    { value: 2, label: 'Mauvais', emoji: '😕' },
    { value: 3, label: 'Correct', emoji: '😐' },
    { value: 4, label: 'Bon', emoji: '😊' },
    { value: 5, label: 'Excellent', emoji: '😍' },
  ];

  const quickFeedbackOptions = [
    'Interface intuitive',
    'Service client réactif',
    'Processus de réclamation simple',
    'Large réseau de partenaires',
    'Tarifs compétitifs',
    'Application rapide',
  ];

  const [selectedQuickFeedback, setSelectedQuickFeedback] = useState<string[]>([]);

  const handleRatingPress = (value: number) => {
    setRating(value);
  };

  const toggleQuickFeedback = (option: string) => {
    setSelectedQuickFeedback(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmitFeedback = () => {
    if (rating === 0) {
      Alert.alert('Évaluation requise', 'Veuillez sélectionner une note avant de continuer.');
      return;
    }

    // TODO: Send feedback to backend API
    // const submitFeedback = async () => {
    //   try {
    //     await fetch(`${API_BASE_URL}/feedback`, {
    //       method: 'POST',
    //       headers: {
    //         'Authorization': `Bearer ${userToken}`,
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         rating,
    //         feedback,
    //         quickFeedback: selectedQuickFeedback,
    //       }),
    //     });
    //   } catch (error) {
    //     console.error('Error submitting feedback:', error);
    //   }
    // };

    setSubmitted(true);
    Alert.alert(
      'Merci !',
      'Votre évaluation a été envoyée. Nous apprécions vos commentaires !',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleAppStoreRating = () => {
    Alert.alert(
      'Évaluer sur l\'App Store',
      'Souhaitez-vous évaluer MyKover sur l\'App Store ?',
      [
        { text: 'Plus tard', style: 'cancel' },
        {
          text: 'Évaluer',
          onPress: () => {
            // TODO: Replace with actual App Store URL
            const appStoreUrl = 'https://apps.apple.com/app/mykover';
            Linking.openURL(appStoreUrl).catch(() => {
              Alert.alert('Erreur', 'Impossible d\'ouvrir l\'App Store');
            });
          },
        },
      ]
    );
  };

  const handleGooglePlayRating = () => {
    Alert.alert(
      'Évaluer sur Google Play',
      'Souhaitez-vous évaluer MyKover sur Google Play ?',
      [
        { text: 'Plus tard', style: 'cancel' },
        {
          text: 'Évaluer',
          onPress: () => {
            // TODO: Replace with actual Google Play URL
            const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.mykover';
            Linking.openURL(playStoreUrl).catch(() => {
              Alert.alert('Erreur', 'Impossible d\'ouvrir Google Play');
            });
          },
        },
      ]
    );
  };

  if (submitted) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
            <FontAwesome6 name="check" size={32} color="#10B981" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 text-center mb-4">
            Merci pour votre évaluation !
          </Text>
          <Text className="text-gray-600 text-center mb-8">
            Vos commentaires nous aident à améliorer MyKover pour tous nos utilisateurs.
          </Text>
          <TouchableOpacity
            className="bg-purple-600 px-8 py-3 rounded-full"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-100 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <FontAwesome6 name="arrow-left" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Évaluez MyKover</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Introduction */}
        <View className="px-4 pt-6 mb-6">
          <View className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mb-3">
                <FontAwesome6 name="star" size={24} color="#8B5CF6" />
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Que pensez-vous de MyKover ?
              </Text>
              <Text className="text-gray-600 text-center">
                Votre avis nous aide à améliorer notre service et à mieux vous servir.
              </Text>
            </View>
          </View>
        </View>

        {/* Rating Section */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">Votre évaluation</Text>
          <View className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <View className="flex-row justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleRatingPress(star)}
                  className="mx-2"
                >
                  <FontAwesome6
                    name="star"
                    size={32}
                    color={star <= rating ? '#F59E0B' : '#E5E7EB'}
                    solid={star <= rating}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <View className="items-center">
                <Text className="text-2xl mb-2">
                  {ratingLabels.find(r => r.value === rating)?.emoji}
                </Text>
                <Text className="text-lg font-semibold text-gray-900">
                  {ratingLabels.find(r => r.value === rating)?.label}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Feedback */}
        {rating > 0 && (
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Qu'avez-vous apprécié ? (Optionnel)
            </Text>
            <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <View className="flex-row flex-wrap">
                {quickFeedbackOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => toggleQuickFeedback(option)}
                    className={`px-3 py-2 rounded-full mr-2 mb-2 border ${
                      selectedQuickFeedback.includes(option)
                        ? 'bg-purple-100 border-purple-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <Text className={`text-sm ${
                      selectedQuickFeedback.includes(option)
                        ? 'text-purple-700'
                        : 'text-gray-600'
                    }`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Written Feedback */}
        {rating > 0 && (
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Commentaires (Optionnel)
            </Text>
            <View className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <TextInput
                className="p-4 text-gray-900"
                placeholder="Partagez vos commentaires ou suggestions..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                value={feedback}
                onChangeText={setFeedback}
                textAlignVertical="top"
              />
            </View>
          </View>
        )}

        {/* Submit Button */}
        {rating > 0 && (
          <View className="px-4 mb-6">
            <TouchableOpacity
              className="bg-purple-600 rounded-xl py-4"
              onPress={handleSubmitFeedback}
            >
              <Text className="text-white font-semibold text-center text-lg">
                Envoyer l'évaluation
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* App Store Links */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Évaluez-nous sur les stores
          </Text>
          
          <TouchableOpacity
            className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm"
            onPress={handleAppStoreRating}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                <FontAwesome6 name="apple" size={20} color="#007AFF" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">App Store</Text>
                <Text className="text-gray-600 text-sm">Évaluez sur l'App Store d'Apple</Text>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
            onPress={handleGooglePlayRating}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
                <FontAwesome6 name="google-play" size={20} color="#34A853" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">Google Play</Text>
                <Text className="text-gray-600 text-sm">Évaluez sur Google Play Store</Text>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Contact Support */}
        <View className="px-4">
          <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <View className="flex-row items-center mb-2">
              <FontAwesome6 name="lightbulb" size={20} color="#F59E0B" />
              <Text className="font-bold text-yellow-800 ml-2">Besoin d'aide ?</Text>
            </View>
            <Text className="text-yellow-700 mb-3">
              Si vous rencontrez des problèmes, notre équipe support est là pour vous aider.
            </Text>
            <TouchableOpacity
              className="bg-yellow-600 rounded-lg py-2 px-4"
              onPress={() => router.push('/help-support')}
            >
              <Text className="text-white font-semibold text-center">
                Contacter le support
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
