import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TabView } from "react-native-tab-view";
import { useAuth } from "../../src/contexts/AuthContext";
import MemberFormDrawer from "../../components/MemberFormDrawer";
import { familyService, MemberData } from "../../services/familyService";
import * as Linking from 'expo-linking';

const PLAN_CONFIG = {
  basique: { name: "Basique", price: 15, min: 1, max: 1, color: "#8A4DFF" },
  libota: { name: "Libota", price: 30, min: 2, max: 3, color: "#8A4DFF" },
  libota_plus: { name: "Libota+", price: 50, min: 2, max: 5, color: "#8A4DFF" },
};

type PlanType = keyof typeof PLAN_CONFIG;

export default function SubscriptionPlansScreen() {
  const { user } = useAuth();
  const [index, setIndex] = useState(1);
  const [routes] = useState([
    { key: "basique", title: "Basique" },
    { key: "libota", title: "Libota" },
    { key: "libota_plus", title: "Libota+" },
  ]);

  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [showMemberDrawer, setShowMemberDrawer] = useState(false);
  const [showRecapDrawer, setShowRecapDrawer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (planKey: string) => {
    const plan = planKey === "libota_plus" ? "libota_plus" : planKey as PlanType;
    setSelectedPlan(plan);
    setMembers([]);
    setShowMemberDrawer(true);
  };

  const handleMemberSubmit = (member: MemberData) => {
    const updatedMembers = [...members, member];
    setMembers(updatedMembers);
    setShowMemberDrawer(false);

    if (!selectedPlan) return;

    const config = PLAN_CONFIG[selectedPlan];

    // Vérifier si on a atteint le max
    if (updatedMembers.length >= config.max) {
      // Afficher le récapitulatif
      setShowRecapDrawer(true);
    } else {
      // Demander s'il veut ajouter un autre membre
      Alert.alert(
        "Membre ajouté",
        `${updatedMembers.length}/${config.max} membre(s) ajouté(s). Voulez-vous ajouter un autre membre ?`,
        [
          { text: "Voir le récap", onPress: () => setShowRecapDrawer(true) },
          { text: "Ajouter", onPress: () => setShowMemberDrawer(true) },
        ]
      );
    }
  };

  const handleFinalSubmit = async () => {
    if (!selectedPlan) return;

    const config = PLAN_CONFIG[selectedPlan];

    // Validation
    if (members.length < config.min || members.length > config.max) {
      Alert.alert(
        "Erreur",
        `Le plan ${config.name} nécessite entre ${config.min} et ${config.max} membre(s)`
      );
      return;
    }

    setShowRecapDrawer(false);
    setIsSubmitting(true);

    try {
      // 1. Créer la famille
      const familyResponse = await familyService.createFamily({
        planType: selectedPlan,
        members: members,
      });

      if (!familyResponse.success || !familyResponse.data) {
        throw new Error(familyResponse.error || "Erreur création famille");
      }

      const familyId = familyResponse.data.family.id;
      const familyCode = familyResponse.data.family.code;

      // 2. Initier le paiement
      const paymentResponse = await familyService.initiatePayment(familyId);

      if (!paymentResponse.success || !paymentResponse.data) {
        throw new Error(paymentResponse.error || "Erreur initiation paiement");
      }

      const { paymentUrl, transactionId } = paymentResponse.data;

      // 3. Rediriger vers CinetPay
      await Linking.openURL(paymentUrl);

      // 4. Naviguer vers écran de vérification
                router.push({
        pathname: "/payment-verification" as any,
                  params: {
          transactionId,
          familyCode,
          planName: config.name,
          amount: config.price.toString(),
                  },
                });

      // Reset
      setSelectedPlan(null);
      setMembers([]);
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPlanCard = (planKey: string) => {
    const plan = planKey === "libota+" ? "libota_plus" : planKey as PlanType;
    const config = PLAN_CONFIG[plan];

    return (
      <View className="flex-1 bg-white p-6">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="items-center mb-6">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: `${config.color}20` }}
            >
              <Ionicons name="shield-checkmark" size={40} color={config.color} />
            </View>
            <Text className="text-3xl font-bold" style={{ color: config.color }}>
              {config.price}$/mois
            </Text>
            <Text className="text-gray-500 mt-1">
              {config.min === config.max
                ? `${config.max} membre`
                : `${config.min}-${config.max} membres`}
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">Avantages</Text>
            <View className="space-y-2">
              <FeatureItem text="Consultations illimitées" />
              <FeatureItem text="Hospitalisation dans cliniques partenaires" />
              {plan !== "basique" && <FeatureItem text="Couverture complète césariennes" />}
              {plan === "libota_plus" && <FeatureItem text="Imageries médicales incluses" />}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => handleSubscribe(planKey)}
            disabled={isSubmitting}
            className="py-4 rounded-full mt-4"
            style={{ backgroundColor: config.color }}
          activeOpacity={0.8}
          >
            {isSubmitting && selectedPlan === plan ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">Souscrire</Text>
            )}
        </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  const renderScene = ({ route }: any) => {
    return renderPlanCard(route.key);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Plans d'assurance</Text>
        <Text className="text-gray-500 mt-1">Choisissez le plan qui vous convient</Text>
      </View>

      <View className="px-4 py-4 bg-white pt-8">
        <View className="flex-row p-1 bg-gray-100 rounded-full">
          {routes.map((route, idx) => {
            const isActive = index === idx;
            return (
              <View key={route.key} className="flex-1" style={{ paddingLeft: idx === 0 ? 0 : 2 }}>
                <TouchableOpacity
                  className={`px-4 py-3 rounded-full ${
                    isActive
                      ? 'bg-purple-600'
                      : 'bg-transparent'
                  }`}
                  onPress={() => setIndex(idx)}
                  activeOpacity={0.7}
                >
                  <Text className={`text-base font-semibold text-center ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-600'
                  }`}>
                    {route.title}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={() => null}
      />

      {selectedPlan && (
        <MemberFormDrawer
          visible={showMemberDrawer}
          onClose={() => {
            setShowMemberDrawer(false);
            setSelectedPlan(null);
            setMembers([]);
          }}
          onSubmit={handleMemberSubmit}
          memberIndex={members.length}
        />
      )}

      {/* Récapitulatif des membres */}
      {selectedPlan && (
        <Modal visible={showRecapDrawer} animationType="slide" transparent>
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold">Récapitulatif</Text>
                <TouchableOpacity onPress={() => setShowRecapDrawer(false)}>
                  <Ionicons name="close" size={28} color="#374151" />
                </TouchableOpacity>
              </View>

              <Text className="text-gray-600 mb-4">
                Plan: <Text className="font-bold text-[#8A4DFF]">{PLAN_CONFIG[selectedPlan].name}</Text> - {PLAN_CONFIG[selectedPlan].price}$
              </Text>

              <ScrollView className="mb-4">
                {members.map((member, index) => (
                  <View key={index} className="flex-row items-center bg-gray-50 p-4 rounded-xl mb-3">
                    <Image
                      source={{ uri: member.photoUrl }}
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <View className="flex-1">
                      <Text className="font-bold text-gray-900">
                        {member.firstName} {member.lastName}
                      </Text>
                      <Text className="text-sm text-gray-500">{member.birthDate}</Text>
                      {member.isSick && (
                        <View className="flex-row items-center mt-1">
                          <Ionicons name="medical" size={14} color="#F59E0B" />
                          <Text className="text-xs text-orange-600 ml-1">Problème de santé</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => {
                    setShowRecapDrawer(false);
                    setShowMemberDrawer(true);
                  }}
                  className="flex-1 bg-gray-200 py-4 rounded-xl"
                  activeOpacity={0.8}
                  disabled={members.length >= PLAN_CONFIG[selectedPlan].max}
                >
                  <Text className="text-gray-700 text-center font-bold">
                    Ajouter membre
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-[#8A4DFF] py-4 rounded-xl"
                  activeOpacity={0.8}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white text-center font-bold">
                      Confirmer & Payer
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const FeatureItem = ({ text }: { text: string }) => (
  <View className="flex-row items-center my-2">
    <Ionicons name="checkmark-circle" size={20} color="#8A4DFF" />
    <Text className="text-gray-700 ml-2">{text}</Text>
  </View>
);
