import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  TouchableOpacity,
  Image,
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
    phone: "", // ✅ CORRIGÉ
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

    // Connexion via API
    setIsLoading(true);
    try {
      // Utiliser l'AuthContext pour la connexion
      const success = await login(sanitizedData.phone, sanitizedData.password); // ✅ CORRIGÉ

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
        Alert.alert("Erreur", "Email/Téléphone ou mot de passe incorrect");
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

  // Google Auth
  const handleGoogleAuth = async () => {
    try {
      const googleAuthUrl = `http://10.35.66.111:3333/api/auth/google`;
      
      // Pour React Native, nous devons ouvrir le navigateur système
      // L'utilisateur sera redirigé vers notre app après l'authentification
      const WebBrowser = await import('expo-web-browser');
      
      Alert.alert(
        "Authentification Google",
        "Vous allez être redirigé vers Google pour vous connecter. Après l'authentification, vous reviendrez automatiquement dans l'application.",
        [
          {
            text: "Continuer",
            onPress: async () => {
              try {
                await WebBrowser.openBrowserAsync(googleAuthUrl);
              } catch (error) {
                Alert.alert("Erreur", "Impossible d'ouvrir le navigateur");
              }
            }
          },
          { text: "Annuler", style: "cancel" }
        ]
      );
    } catch (error) {
      Alert.alert("Erreur", "Impossible de se connecter avec Google");
    }
  };

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
            {/* Champ téléphone uniquement ✅ CORRIGÉ */}
            <PhoneInput
              label="Numéro de téléphone"
              value={formData.phone}
              onChangeText={(text: string) => updateFormData("phone", text)}
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

              {/* Séparateur avec Google Auth */}
              <View className="mb-6">
                <View className="flex-row items-center mb-4">
                  <View className="flex-1 h-px bg-gray-200" />
                  <Text className="px-4 text-gray-500 text-sm">
                    ou continuer avec
                  </Text>
                  <View className="flex-1 h-px bg-gray-200" />
                </View>

                <TouchableOpacity
                  onPress={handleGoogleAuth}
                  className="flex-row items-center justify-center bg-white rounded-full py-4 px-6 border border-zinc-200"
                >
                  <Image
                    source={require("../assets/images/google.png")}
                    className="w-6 h-6 rounded-full mr-3"
                  />
                  <Text className="text-gray-700 font-medium">
                    Continuer avec Google
                  </Text>
                </TouchableOpacity>
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
