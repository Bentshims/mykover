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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList, LoginData, ValidationError } from '../types';
import Input from '../components/Input';
import PrimaryButton from '../components/PrimaryButton';
import { validateLoginData } from '../utils/validation';
import { sanitizeLoginData } from '../utils/sanitizer';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

/**
 * Écran de connexion avec design purple et validation
 * Correspond exactement au design fourni avec header purple et courbe
 */
const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  
  // État du formulaire
  const [formData, setFormData] = useState<LoginData>({
    phone: '',
    password: ''
  });
  
  // État de validation et chargement
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Mémorisation de la fonction de mise à jour des données
  const updateFormData = useCallback((field: keyof LoginData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Supprimer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Validation et soumission du formulaire
  const handleSubmit = useCallback(async () => {
    // Sanitisation des données
    const sanitizedData = sanitizeLoginData(formData);
    
    // Validation
    const validationErrors = validateLoginData(sanitizedData);
    
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach(error => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      return;
    }

    // Simulation de l'API de connexion
    setIsLoading(true);
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Utiliser l'AuthContext pour la connexion
      const success = await login(sanitizedData.phone, sanitizedData.password);
      
      if (success) {
        Alert.alert('Succès', 'Connexion réussie !', [
          {
            text: 'OK',
            onPress: () => {
              // Navigation will be handled by the AuthContext
              // The app will automatically redirect to home
            }
          }
        ]);
      } else {
        Alert.alert('Erreur', 'Numéro de téléphone ou mot de passe incorrect');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  }, [formData, login]);

  // Navigation vers l'inscription
  const handleSignup = useCallback(() => {
    navigation.navigate('SignupStep1');
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
            <Text style={styles.headerTitle}>Connexion</Text>
          </View>
          
          {/* Contenu principal */}
          <View style={styles.content}>
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
            
            {/* Bouton de connexion */}
            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="Se connecter"
                onPress={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
              />
            </View>
            
            {/* Lien vers l'inscription */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Pas encore de compte ?{' '}
                <Text 
                  style={styles.signupLink}
                  onPress={handleSignup}
                >
                  S'inscrire
                </Text>
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
  signupContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
    color: '#6B7280',
  },
  signupLink: {
    color: '#7c3aed',
    fontWeight: '600',
  },
});

export default LoginScreen;
