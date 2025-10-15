import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";
import { AuthProvider } from "../src/contexts/AuthContext";
import { JSX } from "react";

// This is the root layout component
export default function RootLayout(): JSX.Element | null {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Index/Entry point */}
        <Stack.Screen name="index" />
        
        {/* Onboarding and Auth screens */}
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot-password" />

        {/* Main app screens */}
        <Stack.Screen name="(tabs)" />

        {/* Other screens */}
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="payment-history" />
        <Stack.Screen name="payment-result" />
        <Stack.Screen name="payment-verification" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="help-support" />
        <Stack.Screen name="about-us" />
        <Stack.Screen name="faq" />
        <Stack.Screen name="rate-us" />
        <Stack.Screen name="terms-conditions" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
