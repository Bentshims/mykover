import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { authApi } from '../services/api';

export default function ForgotPasswordScreen() {
  // --- États (inchangés)
  const [formData, setFormData] = useState({ phoneNumber: '', otp: '', newPassword: '' });
  const [errors, setErrors] = useState({ phoneNumber: '', otp: '', newPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp' | 'password'>('phone');
  const [otpSent, setOtpSent] = useState(false);

  // Réfs
  const scrollViewRef = useRef<ScrollView | null>(null);
  const phoneRef = useRef<TextInput | null>(null);
  const otpRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  // --- Validation + logique (inchangés)
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    let fieldError = '';
    switch (field) {
      case 'phoneNumber': fieldError = validatePhoneNumber(value); break;
      case 'otp': fieldError = validateOtp(value); break;
      case 'newPassword': fieldError = validatePassword(value); break;
    }
    setErrors(prev => ({ ...prev, [field]: fieldError }));
  };

  const validatePhoneNumber = (phone: string) => {
    if (!phone) return 'Le numéro de téléphone est requis';
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) return 'Format de téléphone invalide';
    return '';
  };
  const validateOtp = (otp: string) => {
    if (!otp) return 'Le code OTP est requis';
    if (otp.length !== 6) return 'Le code OTP doit contenir 6 chiffres';
    if (!/^\d{6}$/.test(otp)) return 'Le code OTP doit contenir uniquement des chiffres';
    return '';
  };
  const validatePassword = (password: string) => {
    if (!password) return 'Le nouveau mot de passe est requis';
    if (password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères';
    return '';
  };
  const validateCurrentStep = (): boolean => {
    let newErrors = { ...errors };
    if (step === 'phone') newErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber);
    if (step === 'otp') newErrors.otp = validateOtp(formData.otp);
    if (step === 'password') newErrors.newPassword = validatePassword(formData.newPassword);
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  const handleSendOtp = async () => { /* ... logique inchangée ... */ };
  const handleVerifyOtp = async () => { /* ... logique inchangée ... */ };
  const handleResetPassword = async () => { /* ... logique inchangée ... */ };

  const getStepTitle = () => {
    switch (step) {
      case 'phone': return 'Mot de passe oublié';
      case 'otp': return 'Vérification OTP';
      case 'password': return 'Nouveau mot de passe';
    }
  };
  const getStepSubtitle = () => {
    switch (step) {
      case 'phone': return 'Entrez votre numéro de téléphone pour recevoir un code';
      case 'otp': return `Code envoyé au ${formData.phoneNumber}`;
      case 'password': return 'Créez un nouveau mot de passe sécurisé';
      default: return '';
    }
  };
  const handleMainAction = () => {
    switch (step) {
      case 'phone': return handleSendOtp();
      case 'otp': return handleVerifyOtp();
      case 'password': return handleResetPassword();
    }
  };
  const getMainButtonText = () => {
    if (isLoading) {
      if (step === 'phone') return 'Envoi...';
      if (step === 'otp') return 'Vérification...';
      if (step === 'password') return 'Réinitialisation...';
    }
    if (step === 'phone') return 'Envoyer le code';
    if (step === 'otp') return 'Vérifier le code';
    if (step === 'password') return 'Réinitialiser';
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView className="flex-1 bg-[#8A4DFF]">
        
        {/* Titre haut violet */}
        <View className="pt-24 items-center min-h-48">
          <Text className="text-white text-2xl font-semibold">{getStepTitle()}</Text>
        </View>

        {/* Bloc blanc arrondi */}
        <KeyboardAvoidingView 
          className="flex-1 bg-white rounded-tl-[5rem] px-6 pt-24"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            ref={scrollViewRef}
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Sous-titre */}
            <Text className="text-base text-gray-600 mb-8">{getStepSubtitle()}</Text>

            {/* Champs */}
            <View className="flex gap-y-6">
              {step === 'phone' && (
                <View>
                  <Text className="mb-2 text-sm text-gray-500">Numéro de téléphone</Text>
                  <TextInput
                    ref={phoneRef}
                    className={`px-4 py-4 rounded-full border text-gray-800 ${
                      errors.phoneNumber ? 'border-red-500' : 'border-[#8A4DFF]'
                    }`}
                    placeholder="+243 80 0000000"
                    placeholderTextColor="#9CA3AF"
                    value={formData.phoneNumber}
                    onChangeText={(text) => updateFormData('phoneNumber', text)}
                    keyboardType="phone-pad"
                    returnKeyType="done"
                  />
                  {errors.phoneNumber ? (
                    <Text className="text-red-500 text-xs mt-1 ml-2">{errors.phoneNumber}</Text>
                  ) : null}
                </View>
              )}

              {step === 'otp' && (
                <View>
                  <Text className="mb-2 text-sm text-gray-500">Code de vérification</Text>
                  <TextInput
                    ref={otpRef}
                    className={`px-4 py-4 rounded-full border text-gray-800 ${
                      errors.otp ? 'border-red-500' : 'border-[#8A4DFF]'
                    }`}
                    placeholder="123456"
                    placeholderTextColor="#9CA3AF"
                    value={formData.otp}
                    onChangeText={(text) => updateFormData('otp', text)}
                    keyboardType="numeric"
                    maxLength={6}
                    returnKeyType="done"
                  />
                  {errors.otp ? (
                    <Text className="text-red-500 text-xs mt-1 ml-2">{errors.otp}</Text>
                  ) : null}
                </View>
              )}

              {step === 'password' && (
                <View>
                  <Text className="mb-2 text-sm text-gray-500">Nouveau mot de passe</Text>
                  <TextInput
                    ref={passwordRef}
                    className={`px-4 py-4 rounded-full border text-gray-800 ${
                      errors.newPassword ? 'border-red-500' : 'border-[#8A4DFF]'
                    }`}
                    placeholder="Nouveau mot de passe"
                    placeholderTextColor="#9CA3AF"
                    value={formData.newPassword}
                    onChangeText={(text) => updateFormData('newPassword', text)}
                    secureTextEntry
                    returnKeyType="done"
                  />
                  {errors.newPassword ? (
                    <Text className="text-red-500 text-xs mt-1 ml-2">{errors.newPassword}</Text>
                  ) : null}
                </View>
              )}
            </View>

            {/* Bouton principal */}
            <TouchableOpacity
              className={`rounded-full py-4 mt-8 shadow-md ${
                isLoading ? 'bg-gray-400' : 'bg-[#8A4DFF]'
              }`}
              onPress={handleMainAction}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text className="text-lg font-semibold text-center text-white">
                {getMainButtonText()}
              </Text>
            </TouchableOpacity>

            {/* Lien retour / renvoi code */}
            {step === 'phone' && (
              <View className="flex-row justify-center mt-8">
                <Text className="text-gray-600 text-sm">Vous vous souvenez de votre mot de passe ? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text className="text-[#8A4DFF] text-sm font-medium">Se connecter</Text>
                </TouchableOpacity>
              </View>
            )}
            {step === 'otp' && (
              <View className="flex-row justify-center mt-8">
                <Text className="text-gray-600 text-sm">Vous n'avez pas reçu le code ? </Text>
                <TouchableOpacity onPress={handleSendOtp}>
                  <Text className="text-[#8A4DFF] text-sm font-medium">Renvoyer</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
