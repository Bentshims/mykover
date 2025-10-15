"use client";
import React, { memo, useCallback, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InputProps } from "../types";

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
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Mémorisation de la fonction onChangeText pour éviter les re-renders
    const handleTextChange = useCallback(
      (text: string) => {
        onChangeText(text);
      },
      [onChangeText]
    );

    const togglePasswordVisibility = useCallback(() => {
      setIsPasswordVisible((prev) => !prev);
    }, []);

    return (
      <View className="mb-5">
        {/* Label avec style selon le design */}
        <Text className="text-base font-medium text-gray-700 mb-2">
          {label}
        </Text>

        {/* Input avec style purple et arrondi selon le design exact */}
        <View className="relative">
          <TextInput
            className={`border ${
              error
                ? "border-red-500 bg-red-50"
                : "border-purple-400 outline-none"
            } rounded-xl px-4 py-4 text-base bg-white min-h-[56px]`}
            style={{ 
              color: '#1F2937',
              fontSize: 16,
              paddingRight: secureTextEntry ? 48 : 16,
            }}
            value={value}
            onChangeText={handleTextChange}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            keyboardType={keyboardType}
            autoComplete={autoComplete}
            textContentType={textContentType}
            autoCorrect={false}
            autoCapitalize="none"
            selectTextOnFocus={!secureTextEntry}
          />

          {/* Bouton toggle pour les champs mot de passe */}
          {secureTextEntry && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ 
                padding: 8,
                transform: [{ translateY: -20 }],
              }}
              activeOpacity={0.6}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="#9333EA"
              />
            </TouchableOpacity>
          )}
        </View>

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
