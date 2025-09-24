import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SignupStep1Data } from '../src/types';
import Input from '../src/components/Input';
import PrimaryButton from '../src/components/PrimaryButton';
import { validateSignupStep1Data } from '../src/utils/validation';
import { sanitizeSignupData } from '../src/utils/sanitizer';

/**
 * Écran d'inscription étape 1 - Nom complet et numéro de téléphone
 * Design purple avec header courbe selon les spécifications exactes
 */
const SignupStep1Screen: React.FC = () => {
  const router = useRouter();
  
  // État du formulaire
  const [formData, setFormData] = useState<SignupStep1Data>({
    fullName: '',
    phone: ''
  });
  
  // État de validation et chargement
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Mémorisation de la fonction de mise à jour des données
  const updateFormData = useCallback((field: keyof SignupStep1Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Supprimer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Validation et passage à l'étape suivante
  const handleNext = useCallback(async () => {
    // Sanitisation des données
    const sanitizedData = sanitizeSignupData({
      ...formData,
      email: '',
      dateOfBirth: '',
      password: ''
    });
    
    // Validation des données de l'étape 1
    const validationErrors = validateSignupStep1Data({
      fullName: sanitizedData.fullName,
      phone: sanitizedData.phone
    });
    
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach(error => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      return;
    }

    // Simulation d'une validation côté serveur
    setIsLoading(true);
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigation vers l'étape 2 avec les données préservées  
      router.push({
        pathname: '/SignupStep2Screen',
        params: {
          step1Data: JSON.stringify({
            fullName: sanitizedData.fullName,
            phone: sanitizedData.phone
          })
        }
      });
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la validation');
    } finally {
      setIsLoading(false);
    }
  }, [formData, router]);

  // Retour à la connexion
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
          </View>
          
          {/* Contenu principal */}
          <View className="flex-1 px-6 pt-12">
            {/* Champ nom complet */}
            <Input
              label="Nom et Prenom"
              value={formData.fullName}
              onChangeText={(text: string) => updateFormData('fullName', text)}
              placeholder="mon nom"
              keyboardType="default"
              error={errors.fullName}
              autoComplete="name"
              textContentType="name"
            />
            
            {/* Champ numéro de téléphone */}
            <Input
              label="Numero de telephone"
              value={formData.phone}
              onChangeText={(text: string) => updateFormData('phone', text)}
              placeholder="+243 80 0000000"
              keyboardType="phone-pad"
              error={errors.phone}
              autoComplete="tel"
              textContentType="telephoneNumber"
            />
            
            {/* Bouton suivant */}
            <View className="mt-8 mb-10">
              <PrimaryButton
                title="S'inscrire"
                onPress={handleNext}
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
                ← Retour à la connexion
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignupStep1Screen;
