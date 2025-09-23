import React, { useState, useCallback } from 'react';
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList, SignupStep1Data, SignupStep2Data, ValidationError } from '../types';
import Input from '../components/Input';
import PrimaryButton from '../components/PrimaryButton';
import { validateSignupStep2Data } from '../utils/validation';
import { sanitizeSignupData } from '../utils/sanitizer';

type SignupStep2NavigationProp = StackNavigationProp<RootStackParamList, 'SignupStep2'>;
type SignupStep2RouteProp = RouteProp<RootStackParamList, 'SignupStep2'>;

/**
 * Écran d'inscription étape 2 - Email, date de naissance et mot de passe
 * Design purple avec header courbe selon les spécifications exactes
 */
const SignupStep2Screen: React.FC = () => {
  const navigation = useNavigation<SignupStep2NavigationProp>();
  const route = useRoute<SignupStep2RouteProp>();
  const { signup } = useAuth();
  const { step1Data } = route.params;
  
  // État du formulaire
  const [formData, setFormData] = useState<SignupStep2Data>({
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
      dateOfBirth: sanitizedData.dateOfBirth,
      password: sanitizedData.password
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
            <Text style={styles.headerSubtitle}>Étape 2 sur 2</Text>
          </View>
          
          {/* Contenu principal */}
          <View style={styles.content}>
            {/* Champ email */}
            <Input
              label="Email"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
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
              onChangeText={(text) => updateFormData('dateOfBirth', text)}
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
              onChangeText={(text) => updateFormData('password', text)}
              placeholder="mon mot de passe"
              secureTextEntry={true}
              error={errors.password}
              autoComplete="off"
              textContentType="password"
            />
            
            {/* Bouton de finalisation */}
            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="S'inscrire"
                onPress={handleSubmit}
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
                ← Retour à l'étape précédente
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
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
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

export default SignupStep2Screen;
