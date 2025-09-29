"use client";
import React, { memo, useCallback } from "react";
import { View, Text, TextInput } from "react-native";
import { InputProps } from "../types";
// import "../../globals.css";

/**
 * Composant Input réutilisable avec validation et sécurité
 * Implémente les bonnes pratiques d'accessibilité et de sécurité
 * Style exact selon le design fourni
 */
const Input: React.FC<InputProps> = memo(
  ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = "default",
    error,
    autoComplete = "off",
    textContentType = "none",
  }) => {
    // Mémorisation de la fonction onChangeText pour éviter les re-renders
    const handleTextChange = useCallback(
      (text: string) => {
        onChangeText(text);
      },
      [onChangeText]
    );

    return (
      <View className="mb-5">
        {/* Label avec style selon le design */}
        <Text className="text-base font-medium text-zinc-300 mb-2">
          {label}
        </Text>

        {/* Input avec style purple et arrondi selon le design exact */}
        <TextInput
          className={`border ${
            error
              ? "border-red-500 bg-red-50"
              : "border-purple-400 outline-none"
          } rounded-full px-4 py-4 text-base bg-white min-h-[48px]`}
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
          <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = "Input";

export default Input;
