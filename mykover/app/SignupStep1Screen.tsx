import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, SignupStep1Data, ValidationError } from '../types';
import Input from '../components/Input';
import PrimaryButton from '../components/PrimaryButton';
import { validateSignupStep1Data } from '../utils/validation';
import { sanitizeSignupData } from '../utils/sanitizer';

type SignupStep1NavigationProp = StackNavigationProp<RootStackParamList, 'SignupStep1'>;

/**
 * Écran d'inscription étape 1 - Nom complet et numéro de téléphone
 * Design purple avec header courbe selon les spécifications exactes
 */
const SignupStep1Screen: React.FC = () => {
  const navigation = useNavigation<SignupStep1NavigationProp>();
  
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
      navigation.navigate('SignupStep2', { 
        step1Data: {
          fullName: sanitizedData.fullName,
          phone: sanitizedData.phone
        }
      });
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la validation');
    } finally {
      setIsLoading(false);
    }
  }, [formData, navigation]);

  // Retour à la connexion
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Header purple avec courbe selon le design exact */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Inscription</Text>
          </View>
          
          {/* Contenu principal */}
          <View style={styles.content}>
            {/* Champ nom complet */}
            <Input
              label="Nom et Prenom"
              value={formData.fullName}
              onChangeText={(text) => updateFormData('fullName', text)}
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
              onChangeText={(text) => updateFormData('phone', text)}
              placeholder="+243 80 0000000"
              keyboardType="phone-pad"
              error={errors.phone}
              autoComplete="tel"
              textContentType="telephoneNumber"
            />
            
            {/* Bouton suivant */}
            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="S'inscrire"
                onPress={handleNext}
                loading={isLoading}
                disabled={isLoading}
              />
            </View>
            
            {/* Lien de retour */}
            <View style={styles.backContainer}>
              <Text 
                style={styles.backLink}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#7c3aed',
    paddingTop: 60, // Plus d'espace pour la status bar
    paddingBottom: 40,
    paddingHorizontal: 20,
    // Courbe plus prononcée selon le design
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 0,
    // Ombre subtile pour la profondeur
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50, // Plus d'espace depuis le header
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 40,
  },
  backContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  backLink: {
    fontSize: 16,
    color: '#7c3aed',
    fontWeight: '600',
  },
});

export default SignupStep1Screen;
