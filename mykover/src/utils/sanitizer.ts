/**
 * Utilitaires de sanitisation pour la sécurité des données
 * Nettoie et sécurise toutes les entrées utilisateur
 */

/**
 * Caractères dangereux à supprimer pour la sécurité
 */
const DANGEROUS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi, // Scripts HTML
  /<iframe[^>]*>.*?<\/iframe>/gi, // Iframes
  /javascript:/gi, // JavaScript URLs
  /data:text\/html/gi, // Data URLs HTML
  /vbscript:/gi, // VBScript
  /onload\s*=/gi, // Event handlers
  /onerror\s*=/gi,
  /onclick\s*=/gi,
  /onmouseover\s*=/gi,
  /onfocus\s*=/gi,
  /onblur\s*=/gi,
  /onchange\s*=/gi,
  /onsubmit\s*=/gi,
  /onreset\s*=/gi,
  /onkeydown\s*=/gi,
  /onkeyup\s*=/gi,
  /onkeypress\s*=/gi,
  /onmousedown\s*=/gi,
  /onmouseup\s*=/gi,
  /onmouseover\s*=/gi,
  /onmouseout\s*=/gi,
  /onmousemove\s*=/gi,
  /onmouseenter\s*=/gi,
  /onmouseleave\s*=/gi,
  /oncontextmenu\s*=/gi,
  /onresize\s*=/gi,
  /onscroll\s*=/gi,
  /onunload\s*=/gi,
  /onbeforeunload\s*=/gi,
  /onhashchange\s*=/gi,
  /onpopstate\s*=/gi,
  /onstorage\s*=/gi,
  /onmessage\s*=/gi,
  /onerror\s*=/gi,
  /onabort\s*=/gi,
  /oncanplay\s*=/gi,
  /oncanplaythrough\s*=/gi,
  /ondurationchange\s*=/gi,
  /onemptied\s*=/gi,
  /onended\s*=/gi,
  /onerror\s*=/gi,
  /onloadeddata\s*=/gi,
  /onloadedmetadata\s*=/gi,
  /onloadstart\s*=/gi,
  /onpause\s*=/gi,
  /onplay\s*=/gi,
  /onplaying\s*=/gi,
  /onprogress\s*=/gi,
  /onratechange\s*=/gi,
  /onseeked\s*=/gi,
  /onseeking\s*=/gi,
  /onstalled\s*=/gi,
  /onsuspend\s*=/gi,
  /ontimeupdate\s*=/gi,
  /onvolumechange\s*=/gi,
  /onwaiting\s*=/gi,
];

/**
 * Caractères de contrôle à supprimer
 */
const CONTROL_CHARACTERS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

/**
 * Métacaractères SQL dangereux
 */
const SQL_META_CHARS = /['"`;\\]/g;

/**
 * Nettoie une chaîne de caractères en supprimant les éléments dangereux
 * @param input - La chaîne à nettoyer
 * @returns La chaîne nettoyée
 */
export const sanitizeString = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  let cleaned = input;
  
  // Supprimer les patterns dangereux
  DANGEROUS_PATTERNS.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Supprimer les caractères de contrôle
  cleaned = cleaned.replace(CONTROL_CHARACTERS, '');
  
  // Échapper les métacaractères SQL (remplacer par des espaces pour éviter les injections)
  cleaned = cleaned.replace(SQL_META_CHARS, ' ');
  
  // Supprimer les espaces multiples
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  // Supprimer les espaces en début et fin
  cleaned = cleaned.trim();
  
  return cleaned;
};

/**
 * Nettoie un nom complet en supprimant les caractères dangereux
 * @param fullName - Le nom à nettoyer
 * @returns Le nom nettoyé
 */
export const sanitizeFullName = (fullName: string): string => {
  const cleaned = sanitizeString(fullName);
  
  // Supprimer les caractères non-alphabétiques et espaces
  return cleaned.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
};

/**
 * Nettoie un numéro de téléphone en gardant seulement les chiffres et le +
 * @param phone - Le numéro à nettoyer
 * @returns Le numéro nettoyé
 */
export const sanitizePhone = (phone: string): string => {
  if (!phone) return '';
  
  // Garder seulement les chiffres, + et espaces
  return phone.replace(/[^\d+\s]/g, '');
};

/**
 * Nettoie une adresse email en supprimant les caractères dangereux
 * @param email - L'email à nettoyer
 * @returns L'email nettoyé
 */
export const sanitizeEmail = (email: string): string => {
  const cleaned = sanitizeString(email);
  
  // Garder seulement les caractères valides pour un email
  return cleaned.replace(/[^a-zA-Z0-9@._-]/g, '');
};

/**
 * Nettoie une date de naissance en gardant seulement les chiffres et /
 * @param dateOfBirth - La date à nettoyer
 * @returns La date nettoyée
 */
export const sanitizeDateOfBirth = (dateOfBirth: string): string => {
  if (!dateOfBirth) return '';
  
  // Garder seulement les chiffres et /
  return dateOfBirth.replace(/[^\d/]/g, '');
};

/**
 * Nettoie un mot de passe (sanitisation minimale pour ne pas affecter la sécurité)
 * @param password - Le mot de passe à nettoyer
 * @returns Le mot de passe nettoyé
 */
export const sanitizePassword = (password: string): string => {
  // Sanitisation minimale pour les mots de passe
  // On ne supprime que les caractères de contrôle dangereux
  return password.replace(CONTROL_CHARACTERS, '');
};

/**
 * Nettoie toutes les données d'un formulaire de connexion
 * @param data - Les données à nettoyer
 * @returns Les données nettoyées
 */
export const sanitizeLoginData = (data: { phone: string; password: string }) => {
  return {
    phone: sanitizePhone(data.phone),
    password: sanitizePassword(data.password),
  };
};

/**
 * Nettoie toutes les données d'un formulaire d'inscription
 * @param data - Les données à nettoyer
 * @returns Les données nettoyées
 */
export const sanitizeSignupData = (data: {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  password: string;
}) => {
  return {
    fullName: sanitizeFullName(data.fullName),
    phone: sanitizePhone(data.phone),
    email: sanitizeEmail(data.email),
    dateOfBirth: sanitizeDateOfBirth(data.dateOfBirth),
    password: sanitizePassword(data.password),
  };
};
