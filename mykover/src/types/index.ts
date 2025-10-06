/**
 * Types TypeScript pour l'application MyKover
 * Définit toutes les interfaces et types utilisés dans l'application
 */

// Types pour la navigation
export type RootStackParamList = {
  Login: undefined;
  SignupStep1: undefined;
  SignupStep2: { step1Data: SignupStep1Data };
  Home: undefined;
};

// Types pour les données de formulaire
export interface LoginData {
  phone: string; // Numéro de téléphone (format: +243[89]XXXXXXXX) ✅ CORRIGÉ
  password: string;
}

export interface SignupStep1Data {
  fullName: string;
  phone: string;
}

export interface SignupStep2Data {
  email: string;
  dateOfBirth: string;
  password: string;
}

export interface SignupData extends SignupStep1Data, SignupStep2Data {}

// Types pour les erreurs de validation
export interface ValidationError {
  field: string;
  message: string;
}

// Types pour les composants
export interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string;
  autoComplete?: 'off' | 'name' | 'email' | 'tel' | 'password';
  textContentType?: 'none' | 'name' | 'emailAddress' | 'telephoneNumber' | 'password';
}

export interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

// Types pour les états de chargement
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Types pour les réponses API (simulées)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    fullName: string;
    phone: string;
    email: string;
  };
}

export interface SignupResponse {
  success: boolean;
  message: string;
}
