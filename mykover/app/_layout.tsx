import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { View, ActivityIndicator } from 'react-native';
import "../global.css";
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Navigation wrapper component
function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (hasSeenOnboarding !== null && !isLoading) {
      if (!hasSeenOnboarding) {
        // First time user - show onboarding
        router.replace('/onboarding');
      } else {
        // Returning user - go directly to home (no auth required for now)
        router.replace('/(tabs)/home');
      }
    }
  }, [hasSeenOnboarding, isLoading, router]);

  const checkOnboardingStatus = async () => {
    try {
      const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSeenOnboarding(hasSeen === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setHasSeenOnboarding(false);
    }
  };

  if (hasSeenOnboarding === null || isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return <>{children}</>;
}

// This is the root layout component
export default function RootLayout(): JSX.Element | null {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Don't render anything until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <NavigationWrapper>
        <Stack screenOptions={{ headerShown: false }}>
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
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </NavigationWrapper>
    </AuthProvider>
  );
}
