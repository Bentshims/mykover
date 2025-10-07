import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as Linking from "expo-linking";
import { familyService } from "../services/familyService";

export default function PaymentVerificationScreen() {
  const params = useLocalSearchParams<{
    transactionId: string;
    familyCode: string;
    planName: string;
    amount: string;
  }>();

  const [status, setStatus] = useState<"pending" | "success" | "failed">("pending");
  const [isPolling, setIsPolling] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingCountRef = useRef(0);

  const MAX_POLLING_ATTEMPTS = 60; // 60 * 5s = 5 minutes max

  const verifyPayment = async () => {
    if (!params.transactionId) return;

    try {
      const response = await familyService.verifyPayment(params.transactionId);

      if (response.success && response.data) {
        const paymentStatus = response.data.status;

        if (paymentStatus === "success") {
          setStatus("success");
          setIsPolling(false);
          stopPolling();
        } else if (paymentStatus === "failed") {
          setStatus("failed");
          setIsPolling(false);
          stopPolling();
        }
        // Si pending, on continue le polling
      }
    } catch (error) {
      console.error("Erreur vérification:", error);
    }

    pollingCountRef.current += 1;

    // Arrêter après MAX_POLLING_ATTEMPTS
    if (pollingCountRef.current >= MAX_POLLING_ATTEMPTS) {
      setIsPolling(false);
      stopPolling();
      Alert.alert(
        "Délai dépassé",
        "La vérification prend plus de temps que prévu. Veuillez vérifier votre historique de paiement.",
        [{ text: "OK", onPress: () => router.replace("/(tabs)/home") }]
      );
    }
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    // Première vérification immédiate
    verifyPayment();

    // Polling toutes les 5 secondes
    intervalRef.current = setInterval(() => {
      verifyPayment();
    }, 5000);

    return () => {
      stopPolling();
    };
  }, []);

  const handleRetry = async () => {
    if (!params.familyCode) return;

    Alert.alert(
      "Réessayer le paiement",
      "Voulez-vous réessayer le paiement ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Réessayer",
          onPress: async () => {
            try {
              // Récupérer la famille
              const familyResponse = await familyService.getFamilyByCode(params.familyCode);

              if (!familyResponse.success || !familyResponse.data) {
                throw new Error("Famille introuvable");
              }

              const familyId = familyResponse.data.id;

              // Initier nouveau paiement
              const paymentResponse = await familyService.initiatePayment(familyId);

              if (!paymentResponse.success || !paymentResponse.data) {
                throw new Error(paymentResponse.error || "Erreur initiation paiement");
              }

              const { paymentUrl, transactionId } = paymentResponse.data;

              // Rediriger vers CinetPay
              await Linking.openURL(paymentUrl);

              // Mettre à jour les params et recommencer le polling
              router.setParams({ transactionId });
              setStatus("pending");
              setIsPolling(true);
              pollingCountRef.current = 0;

              intervalRef.current = setInterval(() => {
                verifyPayment();
              }, 5000);
            } catch (error: any) {
              Alert.alert("Erreur", error.message || "Impossible de réessayer");
            }
          },
        },
      ]
    );
  };

  if (status === "success") {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="checkmark-circle" size={64} color="#22C55E" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">Paiement réussi !</Text>
          <Text className="text-gray-500 text-center mb-2">
            Votre souscription au plan {params.planName} a été validée.
          </Text>
          <View className="bg-purple-50 p-4 rounded-xl mb-6 w-full">
            <Text className="text-sm text-gray-600 text-center mb-1">Votre code famille :</Text>
            <Text className="text-2xl font-bold text-[#8A4DFF] text-center">
              {params.familyCode}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/home")}
            className="bg-[#8A4DFF] py-4 px-8 rounded-xl w-full"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-bold text-lg">Retour à l'accueil</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (status === "failed") {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="close-circle" size={64} color="#EF4444" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">Paiement échoué</Text>
          <Text className="text-gray-500 text-center mb-6">
            Le paiement n'a pas pu être complété. Veuillez réessayer.
          </Text>
          <View className="space-y-3 w-full">
            <TouchableOpacity
              onPress={handleRetry}
              className="bg-[#8A4DFF] py-4 px-8 rounded-xl"
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-bold text-lg">Réessayer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.replace("/(tabs)/home")}
              className="bg-gray-200 py-4 px-8 rounded-xl"
              activeOpacity={0.8}
            >
              <Text className="text-gray-700 text-center font-bold text-lg">Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <ActivityIndicator size="large" color="#8A4DFF" />
        <Text className="text-xl font-bold text-gray-900 mt-6 mb-2">
          Vérification du paiement...
        </Text>
        <Text className="text-gray-500 text-center mb-4">
          Veuillez patienter pendant que nous vérifions votre paiement.
        </Text>
        <View className="bg-gray-50 p-4 rounded-xl">
          <Text className="text-sm text-gray-600">
            Plan : <Text className="font-semibold">{params.planName}</Text>
          </Text>
          <Text className="text-sm text-gray-600 mt-1">
            Montant : <Text className="font-semibold">{params.amount}$</Text>
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/home")}
          className="mt-8"
          activeOpacity={0.7}
        >
          <Text className="text-[#8A4DFF] font-semibold">Revenir plus tard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

