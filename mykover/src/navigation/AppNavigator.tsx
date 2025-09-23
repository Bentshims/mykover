import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

// Import des écrans
import OnboardingScreen from '../screens/onboarding';
import LoginScreen from '../screens/LoginScreen';
import SignupStep1Screen from '../screens/SignupStep1Screen';
import SignupStep2Screen from '../screens/SignupStep2Screen';
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

/**
 * Navigateur principal de l'application
 * Configure la navigation en pile pour les écrans d'authentification
 */
const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSeenOnboarding(hasSeen === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setHasSeenOnboarding(false);
    } finally {
      setIsCheckingOnboarding(false);
    }
  };

  // Show loading screen while checking auth and onboarding status
  if (isLoading || isCheckingOnboarding) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  // Determine initial route based on onboarding and auth status
  const getInitialRoute = () => {
    if (!hasSeenOnboarding) {
      return 'Onboarding';
    } else if (!isAuthenticated) {
      return 'Login';
    } else {
      // If authenticated, we'll handle this in the app layout
      return 'Login'; // This will be overridden by the app layout
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialRoute()}
        screenOptions={{
          // Masquer l'en-tête pour un design personnalisé
          headerShown: false,
          // Animation de transition fluide
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{ title: 'Bienvenue' }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ title: 'Connexion' }}
        />
        <Stack.Screen 
          name="SignupStep1" 
          component={SignupStep1Screen}
          options={{ title: 'Inscription - Étape 1' }}
        />
        <Stack.Screen 
          name="SignupStep2" 
          component={SignupStep2Screen}
          options={{ title: 'Inscription - Étape 2' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
