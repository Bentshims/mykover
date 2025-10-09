"use client";
import React, { memo, useCallback } from "react";
import { View, Text, TextInput } from "react-native";
// import "../globals.css";

type PhoneInputProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
};

/**
 * Champ téléphone moderne avec drapeau RDC et indicatif +243
 * Affiche un input pour les 9 chiffres, impose le préfixe +243
 */
const PhoneInput: React.FC<PhoneInputProps> = memo(
  ({
    label = "Numéro de téléphone",
    value,
    onChangeText,
    placeholder = "0000000000",
    error,
  }) => {
    // Nettoie et limite aux 9 chiffres après +243
    const toDigits = (text: string): string =>
      text.replace(/[^\d]/g, "").slice(0, 9);

    const handleChange = useCallback(
      (text: string) => {
        const digits = toDigits(text);
        const composed = `+243${digits}`;
        onChangeText(composed);
      },
      [onChangeText]
    );

    // Valeur affichée dans l'input (sans le préfixe +243)
    const displayDigits = toDigits(value.replace(/^\+243\s?/, ""));

    return (
      <View className="mb-5">
        {label ? (
          <Text className="text-base font-medium text-zinc-300 mb-2">
            {label}
          </Text>
        ) : null}

        <View
          className={`flex-row items-center rounded-xl px-4 py-1 bg-white min-h-[48px] border ${
            error ? "border-red-500 bg-red-50" : "border-purple-400"
          }`}
        >
          {/* Drapeau RDC */}
          <View className="w-6 h-6 items-center justify-center mr-2">
            <Text style={{ fontSize: 18 }}>🇨🇩</Text>
          </View>

          {/* Indicatif fixe */}
          <Text className="text-gray-700 mr-2 font-medium">+243</Text>

          {/* Séparateur vertical */}
          <View className="w-px h-5 bg-gray-300 mr-2" />

          {/* Saisie des 9 chiffres */}
          <TextInput
            className="flex-1 text-base text-gray-800"
            value={displayDigits}
            onChangeText={handleChange}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
            autoCorrect={false}
            autoCapitalize="none"
            maxLength={9}
          />
        </View>

        {error ? (
          <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>
        ) : null}
      </View>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
export default PhoneInput;
