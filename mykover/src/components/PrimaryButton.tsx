import React, { memo, useCallback } from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
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
      className={`bg-purple-600 rounded-full py-4 px-8 items-center justify-center min-h-[56px] shadow-lg ${(disabled || loading) ? 'opacity-60' : ''}`}
      onPress={handlePress}
      disabled={disabled || loading}
      // Accessibilité
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
      style={{
        shadowColor: '#7c3aed',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text className="text-white text-lg font-semibold tracking-wide">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
});

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
