import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // User not authenticated
      }
    } catch (error) {
      // Handle error silently in production
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    // Loading state
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text className="mt-4 text-gray-600">Vérification de l'authentification...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    // Not authenticated, show a message for now
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <Text className="mb-4 text-lg text-gray-900">Authentification requise</Text>
        <Text className="px-6 text-center text-gray-600">
          Veuillez vous connecter pour accéder à cette section.
        </Text>
      </View>
    );
  }

  // Authenticated, render children
  return <>{children}</>;
} 