import React, { useState, useCallback, useEffect, useRef } from "react";
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
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../src/contexts/AuthContext";
import Input from "../src/components/Input";
import PhoneInput from "../src/components/PhoneInput";
import PrimaryButton from "../src/components/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const PANEL_WIDTH = width - 48; // largeur utile (padding horizontal 24*2)

// Types pour les données du formulaire
interface SignupFormData {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
}

/**
 * Écran d'inscription moderne avec système en 2 étapes
 * Design purple avec barre de progression et Google Auth
 */
const SignupScreen: React.FC = () => {
  const router = useRouter();
  const { signup } = useAuth();

  // État du formulaire
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    phone: "+243",
    email: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });

  // État de validation et chargement
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Animations (persistantes)
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;

  // Animation de la barre de progression
  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: currentStep / 3, // 1/3, 2/3, 1
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  // Animation du slide
  useEffect(() => {
    const targetX = -PANEL_WIDTH * (currentStep - 1);
    Animated.timing(slideAnimation, {
      toValue: targetX,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  // Validation du téléphone RDC (+243[89]XXXXXXXX)
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+243[89]\d{8}$/;
    return phoneRegex.test(phone);
  };

  // Validation de l'email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validation du nom complet
  const validateFullName = (fullName: string): boolean => {
    const words = fullName.trim().split(/\s+/);
    return words.length >= 2 && !words.some((word) => /\d/.test(word));
  };

  // Validation et conversion de la date de naissance
  const validateDateOfBirth = (
    dateOfBirth: string
  ): { isValid: boolean; isoDate?: string } => {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateOfBirth.match(dateRegex);
    if (!match) return { isValid: false };

    const [, day, month, year] = match;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    const isValid =
      date.getDate() === parseInt(day) &&
      date.getMonth() === parseInt(month) - 1 &&
      date.getFullYear() === parseInt(year);

    if (!isValid) return { isValid: false };

    // Convertir en format ISO YYYY-MM-DD pour le backend
    const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    return { isValid: true, isoDate };
  };

  // Mise à jour des données du formulaire
  const updateFormData = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Gestion du champ téléphone pour maintenir +243
  const handlePhoneChange = (value: string) => {
    if (!value.startsWith("+243")) {
      value = "+243" + value.replace("+243", "");
    }
    updateFormData("phone", value);
  };

  // Validation de l'étape 1
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateFullName(formData.fullName)) {
      newErrors.fullName =
        "Le nom complet doit contenir au moins 2 mots sans chiffres";
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone =
        "Le numéro doit être +243 suivi de 8 ou 9, puis 8 chiffres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation de l'étape 2
  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse email valide";
    }

    const dateValidation = validateDateOfBirth(formData.dateOfBirth);
    if (!dateValidation.isValid) {
      newErrors.dateOfBirth = "Format requis: DD/MM/YYYY (ex: 15/08/1990)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation de l'étape 3 (mots de passe)
  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Étape 1 -> Étape 2
  const handleNextFromStep1 = () => {
    if (validateStep1()) setCurrentStep(2);
  };

  // Étape 2 -> Étape 3
  const handleNextFromStep2 = () => {
    if (validateStep2()) setCurrentStep(3);
  };

  // Revenir à l'étape précédente
  const handlePreviousToStep1 = () => setCurrentStep(1);
  const handlePreviousToStep2 = () => setCurrentStep(2);

  // Soumission finale
  const handleSubmit = useCallback(async () => {
    if (!validateStep3()) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const dateValidation = validateDateOfBirth(formData.dateOfBirth);
      if (!dateValidation.isValid) {
        Alert.alert("Erreur", "Format de date invalide");
        return;
      }

      console.log('[SIGNUP DEBUG] Données envoyées:', {
        fullname: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        birth_date: dateValidation.isoDate!,
      });

      const success = await signup({
        fullname: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        birth_date: dateValidation.isoDate!,
      });

      if (success) {
        // Redirection automatique vers la page home
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Erreur", "Une erreur est survenue lors de l'inscription");
      }
    } catch (error) {
      Alert.alert("Erreur", "Connexion impossible");
    } finally {
      setIsLoading(false);
    }
  }, [formData, signup, router]);

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

  // Navigation vers login
  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-purple-600"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          {/* Header avec courbe purple */}
          <View className="pt-20 pb-8 px-6">
            <View className="flex flex-col gap-y-7">
              <Text className="text-white text-3xl font-semibold text-center" style={{ fontFamily: 'Quicksand-SemiBold' }}>
                Créer un compte
              </Text>
              <View className="w-full" />
              {/* Barre de progression */}
              <View className="bg-white h-2 rounded-full">
                <Animated.View
                  className="bg-purple-700 h-2 rounded-full"
                  style={{
                    width: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  }}
                />
              </View>
            </View>
          </View>

          {/* Contenu du formulaire */}
          <ScrollView
            className="flex-1 px-6 pt-20 bg-white rounded-tl-[60px]"
            showsVerticalScrollIndicator={false}
          >
            {/* Wrapper pour masquer les étapes non actives */}
            <View
              style={{
                width: PANEL_WIDTH,
                alignSelf: "center",
                overflow: "hidden",
              }}
            >
              <Animated.View
                style={{
                  flexDirection: "row",
                  width: PANEL_WIDTH * 3,
                  transform: [{ translateX: slideAnimation }],
                }}
              >
                {/* Étape 1 */}
                <View style={{ width: PANEL_WIDTH, paddingRight: 24 }}>
                  <View className="mb-6">
                    <Input
                      label="Nom complet *"
                      value={formData.fullName}
                      onChangeText={(value) =>
                        updateFormData("fullName", value)
                      }
                      placeholder="Ex: Jean Baptiste Mukendi"
                      error={errors.fullName}
                      autoComplete="name"
                      textContentType="name"
                    />
                  </View>

                  <View className="mb-6">
                    <PhoneInput
                      label="Numéro de téléphone *"
                      value={formData.phone}
                      onChangeText={handlePhoneChange}
                      placeholder="0000000000"
                      error={errors.phone}
                    />
                    <Text className="text-gray-500 text-xs mt-1 ml-1" style={{ fontFamily: 'Quicksand' }}>
                      Format: +243 suivi de 8 ou 9, puis 8 chiffres
                    </Text>
                  </View>

                  <PrimaryButton
                    title="Continuer"
                    onPress={handleNextFromStep1}
                  />
                  <View className="px-6 py-4 border-t border-gray-100">
                    <View className="flex-row items-center justify-center">
                      <Text className="text-gray-600" style={{ fontFamily: 'Quicksand' }}>
                        Vous avez déjà un compte ?{" "}
                      </Text>
                      <TouchableOpacity onPress={handleLogin}>
                        <Text className="text-purple-600 font-semibold py-2" style={{ fontFamily: 'Quicksand-SemiBold' }}>
                          Se connecter
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Séparateur avec Google Auth */}
                  <View className="my-8">
                    <View className="flex-row items-center mb-4">
                      <View className="flex-1 h-px bg-gray-200" />
                      <Text className="px-4 text-gray-500 text-sm" style={{ fontFamily: 'Quicksand' }}>
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
                      <Text className="text-gray-700 font-medium" style={{ fontFamily: 'Quicksand-Medium' }}>
                        Continuer avec Google
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Étape 2 */}
                <View style={{ width: PANEL_WIDTH, paddingRight: 24 }}>
                  <View className="mb-6">
                    <Input
                      label="Adresse email *"
                      value={formData.email}
                      onChangeText={(value) => updateFormData("email", value)}
                      placeholder="votre@email.com"
                      keyboardType="email-address"
                      error={errors.email}
                      autoComplete="email"
                      textContentType="emailAddress"
                    />
                  </View>

                  <View className="mb-6">
                    <Input
                      label="Date de naissance *"
                      value={formData.dateOfBirth}
                      onChangeText={(value) =>
                        updateFormData("dateOfBirth", value)
                      }
                      placeholder="DD/MM/YYYY (ex: 15/08/1990)"
                      //keyboardType=""
                      error={errors.dateOfBirth}
                    />
                  </View>

                  <View className="flex-row space-x-3">
                    <TouchableOpacity
                      onPress={handlePreviousToStep1}
                      className="flex-1 bg-gray-100 rounded-2xl py-4 items-center justify-center"
                    >
                      <Text className="text-gray-700 font-semibold" style={{ fontFamily: 'Quicksand-SemiBold' }}>
                        Retour
                      </Text>
                    </TouchableOpacity>

                    <View className="flex-1">
                      <PrimaryButton
                        title="Continuer"
                        onPress={handleNextFromStep2}
                      />
                    </View>
                  </View>
                </View>

                {/* Étape 3 */}
                <View style={{ width: PANEL_WIDTH }}>
                  <View className="mb-6">
                    <Input
                      label="Mot de passe *"
                      value={formData.password}
                      onChangeText={(value) =>
                        updateFormData("password", value)
                      }
                      placeholder="Au moins 6 caractères"
                      secureTextEntry
                      error={errors.password}
                      autoComplete="off"
                      textContentType="password"
                    />
                  </View>

                  <View className="mb-8">
                    <Input
                      label="Confirmer le mot de passe *"
                      value={formData.confirmPassword}
                      onChangeText={(value) =>
                        updateFormData("confirmPassword", value)
                      }
                      placeholder="Répétez votre mot de passe"
                      secureTextEntry
                      error={errors.confirmPassword}
                      autoComplete="off"
                      textContentType="password"
                    />
                  </View>

                  <View className="flex-row space-x-3">
                    <TouchableOpacity
                      onPress={handlePreviousToStep2}
                      className="flex-1 bg-gray-100 rounded-2xl py-4 items-center justify-center"
                    >
                      <Text className="text-gray-700 font-semibold" style={{ fontFamily: 'Quicksand-SemiBold' }}>
                        Retour
                      </Text>
                    </TouchableOpacity>

                    <View className="flex-1">
                      <PrimaryButton
                        title="Créer mon compte"
                        onPress={handleSubmit}
                        loading={isLoading}
                      />
                    </View>
                  </View>
                </View>
              </Animated.View>
            </View>
          </ScrollView>

          {/* Footer */}
          {/* <View className="px-6 py-4">
            
          </View> */}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
