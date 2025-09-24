import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import { SignupStep1Data, SignupStep2Data } from '../src/types';
import Input from '../src/components/Input';
import PrimaryButton from '../src/components/PrimaryButton';
import { validateSignupStep2Data } from '../src/utils/validation';
import { sanitizeSignupData } from '../src/utils/sanitizer';

/**
 * Écran d'inscription étape 2 - Email, date de naissance et mot de passe
 * Design purple avec header courbe selon les spécifications exactes
 */
const SignupStep2Screen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { signup } = useAuth();
  const step1Data: SignupStep1Data = params.step1Data ? JSON.parse(params.step1Data as string) : { fullName: '', phone: '' };
  
  // État du formulaire  
  const [formData, setFormData] = useState({
    email: '',
    dateOfBirth: '',
    password: ''
  });
  
  // État de validation et chargement
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Mémorisation de la fonction de mise à jour des données
  const updateFormData = useCallback((field: keyof SignupStep2Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Supprimer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Validation et finalisation de l'inscription
  const handleSubmit = useCallback(async () => {
    // Sanitisation des données
    const sanitizedData = sanitizeSignupData({
      ...step1Data,
      ...formData
    });
    
    // Validation des données de l'étape 2
    const validationErrors = validateSignupStep2Data({
      email: sanitizedData.email,
      dateOfBirth: sanitizedData.dateOfBirth
    });
    
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach(error => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      return;
    }

    // Simulation de l'inscription
    setIsLoading(true);
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Utiliser l'AuthContext pour l'inscription
      const signupData = {
        fullName: step1Data.fullName,
        email: sanitizedData.email,
        phoneNumber: step1Data.phone,
        password: sanitizedData.password
      };
      
      const success = await signup(signupData);
      
      if (success) {
        Alert.alert('Succès', 'Inscription réussie !', [
          {
            text: 'OK',
            onPress: () => {
              // Navigation will be handled by the AuthContext
              // The app will automatically redirect to home
            }
          }
        ]);
      } else {
        Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  }, [step1Data, formData, signup]);

  // Retour à l'étape précédente
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-white">
          {/* Header purple avec courbe selon le design exact */}
          <View 
            className="bg-purple-600 pt-16 pb-10 px-5 rounded-bl-[60px]"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text className="text-3xl font-bold tracking-wide text-center text-white">
              Inscription
            </Text>
            <Text className="mt-2 text-base text-center text-white opacity-90">
              Étape 2 sur 2
            </Text>
          </View>
          
          {/* Contenu principal */}
          <View className="flex-1 px-6 pt-12">
            {/* Champ email */}
            <Input
              label="Email"
              value={formData.email}
              onChangeText={(text: string) => updateFormData('email', text)}
              placeholder="email@gmail.com"
              keyboardType="email-address"
              error={errors.email}
              autoComplete="email"
              textContentType="emailAddress"
            />
            
            {/* Champ date de naissance */}
            <Input
              label="Date de naissance"
              value={formData.dateOfBirth}
              onChangeText={(text: string) => updateFormData('dateOfBirth', text)}
              placeholder="DD/MM/YYYY"
              keyboardType="default"
              error={errors.dateOfBirth}
              autoComplete="off"
              textContentType="none"
            />
            
            {/* Champ mot de passe */}
            <Input
              label="Mot de passe"
              value={formData.password}
              onChangeText={(text: string) => updateFormData('password', text)}
              placeholder="mon mot de passe"
              secureTextEntry={true}
              error={errors.password}
              autoComplete="off"
              textContentType="password"
            />
            
            {/* Bouton de finalisation */}
            <View className="mt-8 mb-10">
              <PrimaryButton
                title="S'inscrire"
                onPress={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
              />
            </View>
            
            {/* Lien de retour */}
            <View className="items-center mt-5">
              <Text 
                className="text-base font-semibold text-purple-600"
                onPress={handleBack}
              >
                ← Retour à l'étape précédente
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignupStep2Screen;
