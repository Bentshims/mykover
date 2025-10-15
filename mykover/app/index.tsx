import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../src/contexts/AuthContext";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    checkInitialRoute();
  }, [isLoading, isAuthenticated]);

  const checkInitialRoute = async () => {
    // Attendre que l'authentification soit vérifiée
    if (isLoading) return;

    try {
      // Vérifier si l'utilisateur a déjà vu l'onboarding
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

      if (hasSeenOnboarding !== "true") {
        // Première visite - afficher l'onboarding
        router.replace("/onboarding");
      } else if (isAuthenticated) {
        // Utilisateur authentifié - aller à l'accueil
        router.replace("/(tabs)/home");
      } else {
        // Utilisateur a vu l'onboarding mais non connecté - aller au login
        router.replace("/login");
      }
    } catch (error) {
      console.error("Error checking initial route:", error);
      // En cas d'erreur, afficher l'onboarding par défaut
      router.replace("/onboarding");
    }
  };

  // Afficher un écran de chargement pendant la vérification
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#7c3aed" />
    </View>
  );
}



