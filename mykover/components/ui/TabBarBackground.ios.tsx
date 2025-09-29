import React from 'react';
import { View } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabBarBackground() {
  return (
    <BlurView
      intensity={20}
      tint="light"
      className="absolute inset-0"
    />
  );
} 