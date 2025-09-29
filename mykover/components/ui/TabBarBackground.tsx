import React from "react";
import { View } from "react-native";
import { BlurView } from "expo-blur";

export default function TabBarBackground() {
  return (
    <View className="absolute inset-0">
      <BlurView intensity={20} tint="light" className="flex-1" />
    </View>
  );
}
