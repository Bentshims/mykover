import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { paymentService } from '../services/paymentService';

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const { paymentUrl, transactionId, planName, amount } = params;
  
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const timeoutRef = useRef<any>(null);

  // Set up loading timeout
  useEffect(() => {
    // Set a timeout for WebView loading
    timeoutRef.current = setTimeout(() => {
      if (loading) {
        setLoadTimeout(true);
        setLoading(false);
        Alert.alert(
          'Chargement lent',
          'Le chargement de la page prend plus de temps que prévu. Voulez-vous continuer à attendre ou réessayer ?',
          [
            {
              text: 'Attendre',
              onPress: () => {
                setLoadTimeout(false);
                // Reset timeout for another 30 seconds
                timeoutRef.current = setTimeout(() => {
                  setLoadTimeout(true);
                }, 30000);
              }
            },
            {
              text: 'Réessayer',
              onPress: handleRefresh
            },
            {
              text: 'Retour',
              onPress: () => router.back(),
              style: 'cancel'
            }
          ]
        );
      }
    }, 30000); // 30 second timeout

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loading]);

  const handleNavigationStateChange = async (navState: any) => {
    const { url, loading: navLoading } = navState;
    
    console.log('Navigation state change:', { url, loading: navLoading });
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Check if user returned from payment
    if (url.includes('/api/payments/callback') || url.includes('payment-success')) {
      setVerifying(true);
      
      try {
        // Verify payment status
        const verification = await paymentService.verifyPayment(transactionId as string);
        
        if (verification.success && verification.data?.status === 'COMPLETED') {
          // Payment successful
          router.replace({
            pathname: '/payment-history',
            params: {
              transactionId,
              planName,
              amount,
              status: 'success'
            }
          });
        } else {
          // Payment failed or pending
          router.replace({
            pathname: '/payment-result',
            params: {
              transactionId,
              planName,
              amount,
              status: verification.data?.status || 'failed',
              message: verification.message
            }
          });
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        router.replace({
          pathname: '/payment-result',
          params: {
            transactionId,
            planName,
            amount,
            status: 'error',
            message: 'Erreur lors de la vérification du paiement'
          }
        });
      }
      
      setVerifying(false);
    } else if (url.includes('/api/payments/cancel') || url.includes('payment-cancelled')) {
      // Payment cancelled
      router.replace({
        pathname: '/payment-result',
        params: {
          transactionId,
          planName,
          amount,
          status: 'cancelled',
          message: 'Paiement annulé par l\'utilisateur'
        }
      });
    }
  };

  const handleGoBack = () => {
    Alert.alert(
      'Annuler le paiement',
      'Êtes-vous sûr de vouloir annuler ce paiement ?',
      [
        {
          text: 'Non',
          style: 'cancel'
        },
        {
          text: 'Oui',
          style: 'destructive',
          onPress: () => {
            router.back();
          }
        }
      ]
    );
  };

  const handleRefresh = () => {
    setLoading(true);
    setLoadTimeout(false);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  if (verifying) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        
        <View className="items-center justify-center flex-1 px-6">
          <ActivityIndicator size="large" color="#8A4DFF" />
          <Text className="mt-4 text-lg font-medium text-center text-gray-700" style={{ fontFamily: 'Quicksand' }}>
            Vérification du paiement en cours...
          </Text>
          <Text className="mt-2 text-sm text-center text-gray-500" style={{ fontFamily: 'Quicksand' }}>
            Veuillez patienter pendant que nous confirmons votre paiement.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity
          onPress={handleGoBack}
          className="p-2"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        
        <View className="flex-1 mx-4">
          <Text className="text-lg font-semibold text-center text-gray-900" style={{ fontFamily: 'Quicksand' }}>
            Paiement CinetPay
          </Text>
          <Text className="text-sm text-center text-gray-500" style={{ fontFamily: 'Quicksand' }}>
            {planName} - {amount}$
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={handleRefresh}
          className="p-2"
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Loading indicator */}
      {(loading || loadTimeout) && (
        <View className="absolute left-0 right-0 z-10 items-center top-20">
          <View className="flex-row items-center px-4 py-2 bg-white rounded-full shadow-md">
            {loading && <ActivityIndicator size="small" color="#8A4DFF" />}
            <Text className="ml-2 text-sm text-gray-600" style={{ fontFamily: 'Quicksand' }}>
              {loadTimeout ? 'Chargement lent...' : 'Chargement...'}
            </Text>
          </View>
        </View>
      )}

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: paymentUrl as string }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        mixedContentMode="compatibility"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
          Alert.alert(
            'Erreur de chargement',
            'Impossible de charger la page de paiement. Veuillez réessayer.',
            [
              {
                text: 'Réessayer',
                onPress: handleRefresh
              },
              {
                text: 'Retour',
                onPress: () => router.back()
              }
            ]
          );
        }}
        renderError={(errorName) => (
          <View className="items-center justify-center flex-1 px-6">
            <Ionicons name="warning-outline" size={64} color="#EF4444" />
            <Text className="mt-4 text-lg font-medium text-center text-gray-700" style={{ fontFamily: 'Quicksand' }}>
              Erreur de chargement
            </Text>
            <Text className="mt-2 text-sm text-center text-gray-500" style={{ fontFamily: 'Quicksand' }}>
              {errorName || 'Une erreur est survenue lors du chargement de la page de paiement.'}
            </Text>
            <TouchableOpacity
              onPress={handleRefresh}
              className="mt-6 bg-[#8A4DFF] px-6 py-3 rounded-full"
              activeOpacity={0.8}
            >
              <Text className="font-medium text-white" style={{ fontFamily: 'Quicksand' }}>
                Réessayer
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
