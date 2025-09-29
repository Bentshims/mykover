import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import TopNavBarCustom from "../../components/TopNavBarCustom";
import * as WebBrowser from "expo-web-browser";
import api from "../../services/api";
import { Alert } from "react-native";
import { paymentService } from "../../services/paymentService";

// Données des plans d'abonnement
const plansData = {
  basique: {
    name: "Basique",
    price: "15",
    currency: "$",
    description:
      "Le Plan Basique, à seulement 15 $/mois, couvre toute la famille (jusqu'à 3 membres).",
    features: [
      "Consultations illimitées pour toute la famille (jusqu'à 3 membres : parents + enfants)",
      "Hospitalisation de base dans les cliniques partenaires",
      "Couverture partielle pour césariennes, accouchements et soins prénatals",
      "Réductions sur imageries médicales (échographie, radiographie)",
    ],
  },
  libota: {
    name: "Libota",
    price: "30",
    currency: "$",
    description:
      "Le Plan Libota, à seulement 30 $/mois, couvre toute la famille (jusqu'à 5 membres).",
    features: [
      "Consultations illimitées pour toute la famille (jusqu'à 5 membres : parents + enfants)",
      "Hospitalisation de base dans les cliniques partenaires",
      "Couverture partielle pour césariennes, accouchements et soins prénatals",
      "Réductions sur imageries médicales (échographie, radiographie)",
    ],
  },
  premium: {
    name: "Premium",
    price: "50",
    currency: "$",
    description:
      "Le Plan Premium, à seulement 50 $/mois, couvre toute la famille (jusqu'à 7 membres).",
    features: [
      "Consultations illimitées pour toute la famille (jusqu'à 7 membres : parents + enfants)",
      "Hospitalisation complète dans les cliniques partenaires",
      "Couverture complète pour césariennes, accouchements et soins prénatals",
      "Imageries médicales incluses (échographie, radiographie, scanner)",
    ],
  },
};

export default function SubscriptionPlansScreen() {
  const [index, setIndex] = useState(1); // Start with Libota (middle tab)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null); // Track which plan is loading
  const [routes] = useState([
    { key: "basique", title: "Basique" },
    { key: "libota", title: "Libota" },
    { key: "premium", title: "Premium" },
  ]);

  // Fonction pour gérer la souscription directe avec CinetPay
  const handleSubscribe = async (planKey: string) => {
    const plan = plansData[planKey as keyof typeof plansData];
    const amount = parseFloat(plan.price);

    try {
      // Set loading state for this specific plan
      setLoadingPlan(planKey);

      // Initiate payment directly with CinetPay
      const response = await paymentService.initiatePayment({
        amount,
        currency: "USD",
        description: `Abonnement MyKover - Plan ${plan.name}`,
        customer_name: "Utilisateur", // Will be replaced with actual user data
        customer_surname: "MyKover", // Will be replaced with actual user data
        customer_email: "user@mykover.cd", // Will be replaced with actual user data
        customer_phone_number: "+243000000000", // Will be replaced with actual user data
        customer_address: "Kinshasa",
        customer_city: "Kinshasa",
        customer_country: "CD",
        customer_state: "CD",
        customer_zip_code: "00000",
        metadata: `plan_${planKey}`,
      });

      if (response.success && response.data?.payment_url) {
        // Open CinetPay directly in the device's default browser
        const result = await WebBrowser.openBrowserAsync(
          response.data.payment_url,
          {
            presentationStyle:
              WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
            controlsColor: "#8A4DFF",
            toolbarColor: "#FFFFFF",
            showTitle: true,
            enableBarCollapsing: false,
            showInRecents: true,
          }
        );

        // Handle the browser result
        if (result.type === "cancel") {
          Alert.alert(
            "Paiement annulé",
            "Vous avez annulé le processus de paiement.",
            [{ text: "OK" }]
          );
        } else if (result.type === "dismiss") {
          // User closed the browser, check payment status
          setTimeout(async () => {
            try {
              const verification = await paymentService.verifyPayment(
                response.data?.transaction_id || ""
              );
              if (
                verification.success &&
                verification.data?.status === "COMPLETED"
              ) {
                router.push({
                  pathname: "/payment-history",
                  params: {
                    transactionId: response.data?.transaction_id || "",
                    planName: plan.name,
                    amount: plan.price,
                  },
                });
              } else {
                router.push({
                  pathname: "/payment-result",
                  params: {
                    status: verification.data?.status || "PENDING",
                    transactionId: response.data?.transaction_id || "",
                    planName: plan.name,
                    amount: plan.price,
                  },
                });
              }
            } catch (error) {
              Alert.alert(
                "Vérification du paiement",
                "Impossible de vérifier le statut du paiement. Veuillez vérifier votre historique de paiements.",
                [{ text: "OK" }]
              );
            }
          }, 2000); // Wait 2 seconds before checking
        }
      } else {
        throw new Error(
          response.message || "Échec de l'initialisation du paiement"
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Erreur de paiement",
        error.message ||
          "Impossible d'initialiser le paiement. Veuillez réessayer.",
        [{ text: "OK" }]
      );
    } finally {
      // Clear loading state
      setLoadingPlan(null);
    }
  };

  // Helper function to get plan ID
  const getPlanId = (planKey: string): string => {
    switch (planKey) {
      case "basique":
        return "1";
      case "libota":
        return "2";
      case "premium":
        return "3";
      default:
        return "1";
    }
  };

  // Fonction pour gérer les notifications
  const handleNotificationPress = () => {
    // Navigation vers les notifications sera implémentée
  };

  // Fonction pour gérer le clic sur l'avatar
  const handleAvatarPress = () => {
    router.push("/profile");
  };

  // Composant pour chaque plan
  const PlanContent = ({ planKey }: { planKey: string }) => {
    const plan = plansData[planKey as keyof typeof plansData];

    return (
      <View className="flex-1 px-6">
        {/* Carte du plan */}
        <View className="p-6 mb-6 bg-white shadow-sm rounded-2xl">
          {/* Prix */}
          <View className="items-center mb-6">
            <Text className="text-4xl font-bold text-[#8A4DFF] mb-2">
              {plan.price}
              {plan.currency}/mois
            </Text>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="leading-6 text-center text-gray-600">
              {plan.description}
            </Text>
          </View>

          {/* Fonctionnalités */}
          <View className="mb-6">
            {plan.features.map((feature, index) => (
              <View key={index} className="flex-row items-start mb-4">
                <View className="w-6 h-6 bg-[#8A4DFF] rounded-full items-center justify-center mr-3 mt-0.5">
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
                <Text className="flex-1 leading-6 text-gray-700">
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bouton Souscrire */}
        <TouchableOpacity
          className={`rounded-full py-4 shadow-lg mx-6 ${
            loadingPlan === planKey ? "bg-gray-400" : "bg-[#8A4DFF]"
          }`}
          onPress={() => handleSubscribe(planKey)}
          activeOpacity={0.8}
          disabled={loadingPlan !== null}
        >
          <View className="flex-row items-center justify-center">
            {loadingPlan === planKey && (
              <ActivityIndicator size="small" color="white" className="mr-2" />
            )}
            <Text className="text-lg font-semibold text-center text-white">
              {loadingPlan === planKey ? "Initialisation..." : "Souscrire"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Rendu des scènes pour TabView
  const renderScene = SceneMap({
    basique: () => <PlanContent planKey="basique" />,
    libota: () => <PlanContent planKey="libota" />,
    premium: () => <PlanContent planKey="premium" />,
  });

  // Rendu de la barre d'onglets personnalisée
  const renderTabBar = (props: any) => (
    <View className="px-6 py-4">
      <View className="flex-row p-1 bg-white rounded-full">
        {routes.map((route, i) => (
          <TouchableOpacity
            key={route.key}
            onPress={() => setIndex(i)}
            className={`flex-1 py-3 rounded-full ${
              i === index ? "bg-[#8A4DFF]" : "bg-transparent"
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-center font-medium ${
                i === index ? "text-white" : "text-gray-600"
              }`}
            >
              {route.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

      {/* Barre de navigation supérieure */}
      <TopNavBarCustom
        onAvatarPress={handleAvatarPress}
        onNotificationPress={handleNotificationPress}
        notificationCount={3}
      />

      {/* Titre et description */}
      <View className="px-6 py-4">
        <Text className="mb-4 text-2xl font-bold text-gray-900">Nos plans</Text>
        <Text className="leading-6 text-gray-600">
          Protégez ce qui compte le plus.{"\n"}
          Avec MyKover Assurance, accédez à des soins de santé abordables et
          fiables pour toute la famille. Consultations illimitées,
          hospitalisation et assistance d'urgence 24/7
        </Text>
      </View>

      {/* Onglets personnalisés */}
      {renderTabBar({})}

      {/* Contenu du plan sélectionné */}
      <View className="flex-1">
        {index === 0 && <PlanContent planKey="basique" />}
        {index === 1 && <PlanContent planKey="libota" />}
        {index === 2 && <PlanContent planKey="premium" />}
      </View>
    </SafeAreaView>
  );
}
