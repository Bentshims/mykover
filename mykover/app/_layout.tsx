import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";
import { AuthProvider } from "../src/contexts/AuthContext";
import { JSX, useEffect, useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { Text, TextInput, StyleSheet } from "react-native";

SplashScreen.preventAutoHideAsync();

let fontsConfigured = false;

// This is the root layout component
export default function RootLayout(): JSX.Element | null {
  const [fontsLoaded, fontError] = useFonts({
    'Quicksand': require('../assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
    'Quicksand-Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (fontsLoaded && !fontsConfigured) {
      fontsConfigured = true;
      
      // @ts-ignore
      const oldTextRender = Text.render;
      // @ts-ignore
      const oldTextInputRender = TextInput.render;
      
      // @ts-ignore
      Text.render = function (props, ref) {
        return oldTextRender.call(this, {
          ...props,
          style: StyleSheet.flatten([{ fontFamily: 'Quicksand' }, props.style]),
        }, ref);
      };
      
      // @ts-ignore
      TextInput.render = function (props, ref) {
        return oldTextInputRender.call(this, {
          ...props,
          style: StyleSheet.flatten([{ fontFamily: 'Quicksand' }, props.style]),
        }, ref);
      };
      
      onLayoutRootView();
    }
  }, [fontsLoaded, onLayoutRootView]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

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
