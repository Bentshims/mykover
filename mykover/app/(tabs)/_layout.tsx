import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#8A4DFF', // Changement de couleur lors du focus
          tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
          headerShown: false,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
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
        }}>
      
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
    </ProtectedRoute>
  );
}
