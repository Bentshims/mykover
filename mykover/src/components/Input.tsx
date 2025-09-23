import React, { memo, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { InputProps } from '../types';

/**
 * Composant Input réutilisable avec validation et sécurité
 * Implémente les bonnes pratiques d'accessibilité et de sécurité
 * Style exact selon le design fourni
 */
const Input: React.FC<InputProps> = memo(({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  autoComplete = 'off',
  textContentType = 'none'
}) => {
  // Mémorisation de la fonction onChangeText pour éviter les re-renders
  const handleTextChange = useCallback((text: string) => {
    onChangeText(text);
  }, [onChangeText]);

  return (
    <View style={styles.container}>
      {/* Label avec style selon le design */}
      <Text style={styles.label}>
        {label}
      </Text>
      
      {/* Input avec style purple et arrondi selon le design exact */}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError
        ]}
        value={value}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF" // Couleur grise pour les placeholders
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoComplete={autoComplete}
        textContentType={textContentType}
        // Sécurité : désactiver l'autofill pour les mots de passe
        autoCorrect={false}
        autoCapitalize="none"
        // Désactiver le copier/coller pour les mots de passe
        selectTextOnFocus={!secureTextEntry}
      />
      
      {/* Message d'erreur avec style rouge */}
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#7c3aed',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    minHeight: 48,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
});

Input.displayName = 'Input';

export default Input;
