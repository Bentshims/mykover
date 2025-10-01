import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function RateUsScreen() {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const ratingLabels = [
    { value: 1, label: 'Très mauvais', emoji: '😞' },
    { value: 2, label: 'Mauvais', emoji: '😕' },
    { value: 3, label: 'Correct', emoji: '😐' },
    { value: 4, label: 'Bon', emoji: '😊' },
    { value: 5, label: 'Excellent', emoji: '😍' },
  ];

  const handleRatingPress = (value: number) => {
    setRating(value);
  };

  const handleSubmitFeedback = () => {
    if (rating === 0) {
      Alert.alert('Évaluation requise', 'Veuillez sélectionner une note avant de continuer.');
      return;
    }

    setSubmitted(true);
    Alert.alert(
      'Merci !',
      'Votre évaluation a été envoyée. Nous apprécions vos commentaires !',
      [{ text: 'OK', onPress: () => router.back() }]
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
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <FontAwesome6 name="arrow-left" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Évaluez MyKover</Text>
      </View>

      <View className="flex-1 px-4 pt-6">
        {/* Introduction */}
        <View className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
          <View className="items-center mb-4">
            <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mb-3">
              <FontAwesome6 name="star" size={24} color="#8B5CF6" />
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
              Que pensez-vous de MyKover ?
            </Text>
            <Text className="text-gray-600 text-center">
              Votre avis nous aide à améliorer notre service et à mieux vous servir.
            </Text>
          </View>
        </View>

        {/* Rating Section */}
        <View className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4 text-center">Votre évaluation</Text>
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

        {/* Submit Button */}
        {rating > 0 && (
          <TouchableOpacity
            className="bg-purple-600 rounded-xl py-4"
            onPress={handleSubmitFeedback}
          >
            <Text className="text-white font-semibold text-center text-lg">
              Envoyer l'évaluation
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
