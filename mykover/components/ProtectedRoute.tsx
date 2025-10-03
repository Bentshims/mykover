import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const isAuthPage = ['login', 'signup', 'onboarding'].includes(segments[0] as string);

    // If user is not authenticated and trying to access protected routes
    if (!isAuthenticated && inAuthGroup) {
      router.replace('/login');
    }

    // If user is authenticated and on auth pages, redirect to home
    if (isAuthenticated && isAuthPage) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isLoading, segments]);

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8A4DFF" />
      </View>
    );
  }

  return <>{children}</>;
}
