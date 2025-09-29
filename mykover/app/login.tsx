import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../src/contexts/AuthContext";
import { LoginData } from "../src/types";
import Input from "../src/components/Input";
import PhoneInput from "../src/components/PhoneInput";
import PrimaryButton from "../src/components/PrimaryButton";
import { validateLoginData } from "../src/utils/validation";
import { sanitizeLoginData } from "../src/utils/sanitizer";

/**
 * Écran de connexion avec design purple et validation
 * Correspond exactement au design fourni avec header purple et courbe
 */
const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  // État du formulaire
  const [formData, setFormData] = useState<LoginData>({
    phone: "",
    password: "",
  });

  // État de validation et chargement
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Mémorisation de la fonction de mise à jour des données
  const updateFormData = useCallback(
    (field: keyof LoginData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Supprimer l'erreur du champ modifié
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  // Validation et soumission du formulaire
  const handleSubmit = useCallback(async () => {
    // Sanitisation des données
    const sanitizedData = sanitizeLoginData(formData);

    // Validation
    const validationErrors = validateLoginData(sanitizedData);

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((error) => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      return;
    }

    // Simulation de l'API de connexion
    setIsLoading(true);
    try {
      // Simuler un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Utiliser l'AuthContext pour la connexion
      const success = await login(sanitizedData.phone, sanitizedData.password);

      if (success) {
        Alert.alert("Succès", "Connexion réussie !", [
          {
            text: "OK",
            onPress: () => {
              // Navigation will be handled by the AuthContext
              // The app will automatically redirect to home
            },
          },
        ]);
      } else {
        Alert.alert("Erreur", "Numéro de téléphone ou mot de passe incorrect");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  }, [formData, login]);

  // Navigation vers l'inscription
  const handleSignup = useCallback(() => {
    router.push("/signup");
  }, [router]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-purple-600"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 ">
          {/* Header purple avec courbe selon le design exact */}
          <View
            className=" pt-20 pb-10 px-5"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text className="text-3xl font-bold tracking-wide text-center text-white">
              Connexion
            </Text>
          </View>

          {/* Contenu principal */}
          <View className="flex-1 px-6 pt-24 mt-8 bg-white rounded-tl-[60px] flex flex-col gap-y-7">
            {/* Champ numéro de téléphone */}
            <PhoneInput
              label="Numéro de téléphone"
              value={formData.phone}
              onChangeText={(text: string) => updateFormData("phone", text)}
              placeholder="0000000000"
              error={errors.phone}
            />

            {/* Champ mot de passe */}
            <Input
              label="Mot de passe"
              value={formData.password}
              onChangeText={(text: string) => updateFormData("password", text)}
              placeholder="mon mot de passe"
              secureTextEntry={true}
              error={errors.password}
              autoComplete="off"
              textContentType="password"
            />

            <View className="flex flex-col">
              {/* Bouton de connexion */}
              <View className="mt-8 mb-10">
                <PrimaryButton
                  title="Se connecter"
                  onPress={handleSubmit}
                  loading={isLoading}
                  disabled={isLoading}
                />
              </View>

              {/* Lien vers l'inscription */}
              <View className="items-start mx-auto">
                <Text className="text-base text-gray-500">
                  Pas encore de compte ?{" "}
                  <Text
                    className="font-semibold text-purple-600 py-2 border border-purple-600 rounded-full px-4"
                    onPress={handleSignup}
                  >
                    S'inscrire
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
