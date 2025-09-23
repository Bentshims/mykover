import React, { memo, useCallback } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { PrimaryButtonProps } from '../types';

/**
 * Composant PrimaryButton réutilisable avec état de chargement
 * Implémente les bonnes pratiques d'accessibilité et de performance
 * Style exact selon le design fourni
 */
const PrimaryButton: React.FC<PrimaryButtonProps> = memo(({
  title,
  onPress,
  loading = false,
  disabled = false
}) => {
  // Mémorisation de la fonction onPress pour éviter les re-renders
  const handlePress = useCallback(() => {
    if (!loading && !disabled) {
      onPress();
    }
  }, [onPress, loading, disabled]);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        (disabled || loading) && styles.buttonDisabled
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      // Accessibilité
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text style={styles.buttonText}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#7c3aed',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    // Ombre subtile pour la profondeur
    shadowColor: '#7c3aed',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
