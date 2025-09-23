/**
 * Utilitaires de validation pour les formulaires d'authentification
 * Implémente toutes les règles de validation selon les spécifications
 */

// Types pour les erreurs de validation
export interface ValidationError {
  field: string;
  message: string;
}

// Types pour les données de formulaire
export interface LoginData {
  phone: string;
  password: string;
}

export interface SignupStep1Data {
  fullName: string;
  phone: string;
}

export interface SignupStep2Data {
  email: string;
  dateOfBirth: string;
}

export interface SignupData extends SignupStep1Data, SignupStep2Data {}

/**
 * Valide un nom complet - doit contenir au moins 2 mots, pas de chiffres ni séquences spéciales
 * @param fullName - Le nom complet à valider
 * @returns true si valide, false sinon
 */
export const validateFullName = (fullName: string): boolean => {
  if (!fullName || fullName.trim().length === 0) {
    return false;
  }
  
  // Vérifier qu'il y a au moins 2 mots séparés par des espaces
  const words = fullName.trim().split(/\s+/);
  if (words.length < 2) {
    return false;
  }
  
  // Vérifier qu'aucun mot ne contient de chiffres ou de séquences spéciales
  const hasNumbersOrSpecial = words.some(word => 
    /\d/.test(word) || /[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/.test(word)
  );
  
  return !hasNumbersOrSpecial;
};

/**
 * Valide un numéro de téléphone - doit commencer par +243, numérique seulement, 9-12 chiffres
 * @param phone - Le numéro de téléphone à valider
 * @returns true si valide, false sinon
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone || phone.trim().length === 0) {
    return false;
  }
  
  // Nettoyer le numéro (supprimer les espaces)
  const cleanPhone = phone.replace(/\s/g, '');
  
  // Vérifier qu'il commence par +243
  if (!cleanPhone.startsWith('+243')) {
    return false;
  }
  
  // Vérifier que le reste est numérique
  const numericPart = cleanPhone.substring(4);
  if (!/^\d+$/.test(numericPart)) {
    return false;
  }
  
  // Vérifier la longueur totale (9-12 chiffres après +243)
  const totalDigits = cleanPhone.length - 1; // -1 pour le +
  return totalDigits >= 9 && totalDigits <= 12;
};

/**
 * Valide une adresse email selon le format standard
 * @param email - L'email à valider
 * @returns true si valide, false sinon
 */
export const validateEmail = (email: string): boolean => {
  if (!email || email.trim().length === 0) {
    return false;
  }
  
  // Regex pour validation email standard
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

/**
 * Valide une date de naissance - doit être une date valide
 * @param dateOfBirth - La date de naissance à valider (format DD/MM/YYYY)
 * @returns true si valide, false sinon
 */
export const validateDateOfBirth = (dateOfBirth: string): boolean => {
  if (!dateOfBirth || dateOfBirth.trim().length === 0) {
    return false;
  }
  
  // Vérifier le format DD/MM/YYYY
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateOfBirth.trim().match(dateRegex);
  
  if (!match) {
    return false;
  }
  
  const [, day, month, year] = match;
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  // Vérifier que la date est valide
  const date = new Date(yearNum, monthNum - 1, dayNum);
  return date.getDate() === dayNum && 
         date.getMonth() === monthNum - 1 && 
         date.getFullYear() === yearNum;
};

/**
 * Valide un mot de passe - règles de base pour la sécurité
 * @param password - Le mot de passe à valider
 * @returns true si valide, false sinon
 */
export const validatePassword = (password: string): boolean => {
  if (!password || password.length === 0) {
    return false;
  }
  
  // Minimum 6 caractères pour la sécurité de base
  return password.length >= 6;
};

/**
 * Valide toutes les données de connexion
 * @param data - Les données de connexion
 * @returns Array d'erreurs de validation
 */
export const validateLoginData = (data: LoginData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!validatePhone(data.phone)) {
    errors.push({
      field: 'phone',
      message: 'Le numéro de téléphone doit commencer par +243 et contenir 9-12 chiffres'
    });
  }
  
  if (!validatePassword(data.password)) {
    errors.push({
      field: 'password',
      message: 'Le mot de passe est requis'
    });
  }
  
  return errors;
};

/**
 * Valide les données de l'étape 1 d'inscription
 * @param data - Les données de l'étape 1
 * @returns Array d'erreurs de validation
 */
export const validateSignupStep1Data = (data: SignupStep1Data): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!validateFullName(data.fullName)) {
    errors.push({
      field: 'fullName',
      message: 'Le nom complet doit contenir au moins 2 mots sans chiffres ni caractères spéciaux'
    });
  }
  
  if (!validatePhone(data.phone)) {
    errors.push({
      field: 'phone',
      message: 'Le numéro de téléphone doit commencer par +243 et contenir 9-12 chiffres'
    });
  }
  
  return errors;
};

/**
 * Valide les données de l'étape 2 d'inscription
 * @param data - Les données de l'étape 2
 * @returns Array d'erreurs de validation
 */
export const validateSignupStep2Data = (data: SignupStep2Data): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!validateEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Veuillez entrer une adresse email valide'
    });
  }
  
  if (!validateDateOfBirth(data.dateOfBirth)) {
    errors.push({
      field: 'dateOfBirth',
      message: 'Veuillez entrer une date de naissance valide (DD/MM/YYYY)'
    });
  }
  
  return errors;
};

/**
 * Valide toutes les données d'inscription complètes
 * @param data - Les données d'inscription complètes
 * @returns Array d'erreurs de validation
 */
export const validateSignupData = (data: SignupData): ValidationError[] => {
  const step1Errors = validateSignupStep1Data({
    fullName: data.fullName,
    phone: data.phone
  });
  
  const step2Errors = validateSignupStep2Data({
    email: data.email,
    dateOfBirth: data.dateOfBirth
  });
  
  return [...step1Errors, ...step2Errors];
};
