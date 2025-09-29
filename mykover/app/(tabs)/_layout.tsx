import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, Text } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

import TabBarBackground from "@/components/ui/TabBarBackground";
import { useAuth } from "../../src/contexts/AuthContext";
import "../../global.css";

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <Text className="text-gray-600">Chargement...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <Text className="mb-4 text-lg text-gray-900">
          Authentification requise
        </Text>
        <Text className="px-6 text-center text-gray-600">
          Veuillez vous connecter pour accéder à cette section.
        </Text>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#8A4DFF", // Changement de couleur lors du focus
        tabBarInactiveTintColor: "#8A4DFF",
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            height: 90,
            paddingBottom: 25,
            paddingTop: 10,
            paddingHorizontal: 10,
          },
          default: {
            height: 70,
            paddingBottom: 12,
            paddingTop: 10,
            paddingHorizontal: 8,
          },
        }),
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="flex items-center justify-center w-8 h-8">
              <FontAwesome6
                size={focused ? 26 : 24}
                name="house"
                color={color}
                solid={focused}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="plans"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="flex items-center justify-center w-8 h-8">
              <FontAwesome6
                size={focused ? 26 : 24}
                name="credit-card"
                color={color}
                solid={focused}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="flex items-center justify-center w-8 h-8">
              <FontAwesome6
                size={focused ? 26 : 24}
                name="location-dot"
                color={color}
                solid={focused}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="flex items-center justify-center w-8 h-8">
              <FontAwesome6
                size={focused ? 26 : 24}
                name="gear"
                color={color}
                solid={focused}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
