import React from 'react';
import { AppRegistry } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import './global.css';

/**
 * Composant principal de l'application MyKover
 * Configure les providers nécessaires et la navigation
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#7c3aed" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

// Register the main component
AppRegistry.registerComponent('main', () => App);
