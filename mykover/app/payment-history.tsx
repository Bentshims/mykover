import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { paymentService } from '../services/paymentService';

// Types for transaction data
interface Transaction {
  id: string;
  transaction_id: string;
  amount: number;
  currency: string;
  description: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
  created_at: string;
  updated_at: string;
  metadata?: string;
  payment_method?: string;
  customer_name?: string;
  customer_email?: string;
}

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return '#10B981'; // Green
    case 'PENDING':
      return '#F59E0B'; // Orange
    case 'FAILED':
      return '#EF4444'; // Red
    case 'CANCELLED':
      return '#6B7280'; // Gray
    case 'EXPIRED':
      return '#DC2626'; // Dark red
    default:
      return '#6B7280';
  }
};

// Status icon mapping
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'checkmark-circle';
    case 'PENDING':
      return 'time';
    case 'FAILED':
      return 'close-circle';
    case 'CANCELLED':
      return 'ban';
    case 'EXPIRED':
      return 'alert-circle';
    default:
      return 'help-circle';
  }
};

// Status text mapping (French)
const getStatusText = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'Complété';
    case 'PENDING':
      return 'En attente';
    case 'FAILED':
      return 'Échoué';
    case 'CANCELLED':
      return 'Annulé';
    case 'EXPIRED':
      return 'Expiré';
    default:
      return 'Inconnu';
  }
};

// Format date to French locale
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function PaymentHistoryScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const filters = [
    { key: 'ALL', label: 'Tous' },
    { key: 'COMPLETED', label: 'Complétés' },
    { key: 'PENDING', label: 'En attente' },
    { key: 'FAILED', label: 'Échoués' },
  ];

  // Load payment history
  const loadPaymentHistory = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await paymentService.getPaymentHistory();
      
      if (response.success && response.data) {
        // Gérer les deux formats de réponse possibles
        const transactionsList = Array.isArray(response.data) 
          ? response.data 
          : response.data.transactions || [];
        setTransactions(transactionsList);
      } else {
        throw new Error(response.message || 'Impossible de charger l\'historique');
      }
    } catch (error: any) {
      console.error('Payment history error:', error);
      Alert.alert(
        'Erreur',
        error.message || 'Impossible de charger l\'historique des paiements.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter transactions based on selected filter
  const filteredTransactions = transactions.filter(transaction => {
    if (selectedFilter === 'ALL') return true;
    return transaction.status === selectedFilter;
  });

  // Handle transaction details
  const handleTransactionDetails = async (transaction: Transaction) => {
    try {
      // Get detailed transaction info from CinetPay
      const response = await paymentService.getTransaction(transaction.transaction_id);
      
      if (response.success && response.data) {
        // Navigate to transaction details screen or show modal
        Alert.alert(
          'Détails de la transaction',
          `ID: ${transaction.transaction_id}\n` +
          `Montant: ${transaction.amount} ${transaction.currency}\n` +
          `Statut: ${getStatusText(transaction.status)}\n` +
          `Date: ${formatDate(transaction.created_at)}\n` +
          `Description: ${transaction.description}`,
          [
            {
              text: 'Fermer',
              style: 'cancel'
            },
            {
              text: 'Vérifier le statut',
              onPress: () => verifyTransactionStatus(transaction.transaction_id)
            }
          ]
        );
      }
    } catch (error) {
      console.error('Transaction details error:', error);
      Alert.alert(
        'Erreur',
        'Impossible de charger les détails de la transaction.',
        [{ text: 'OK' }]
      );
    }
  };

  // Verify transaction status with CinetPay
  const verifyTransactionStatus = async (transactionId: string) => {
    try {
      Alert.alert(
        'Vérification en cours',
        'Vérification du statut auprès de CinetPay...',
        [],
        { cancelable: false }
      );

      const response = await paymentService.verifyPayment(transactionId);
      
      if (response.success && response.data) {
        const status = response.data.status;
        Alert.alert(
          'Statut vérifié',
          `Le statut actuel de cette transaction est: ${getStatusText(status)}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Refresh the list to update status
                loadPaymentHistory(true);
              }
            }
          ]
        );
      } else {
        throw new Error(response.message || 'Vérification échouée');
      }
    } catch (error: any) {
      console.error('Status verification error:', error);
      Alert.alert(
        'Erreur de vérification',
        error.message || 'Impossible de vérifier le statut de la transaction.',
        [{ text: 'OK' }]
      );
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadPaymentHistory();
  }, []);

  // Render transaction item
  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      className="bg-white mx-4 mb-3 p-4 rounded-xl shadow-sm border border-gray-100"
      onPress={() => handleTransactionDetails(item)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center flex-1">
          <View 
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${getStatusColor(item.status)}20` }}
          >
            <Ionicons 
              name={getStatusIcon(item.status) as any} 
              size={20} 
              color={getStatusColor(item.status)} 
            />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Quicksand' }}>
              {item.description}
            </Text>
            <Text className="text-sm text-gray-500" style={{ fontFamily: 'Quicksand' }}>
              {formatDate(item.created_at)}
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: 'Quicksand' }}>
            {item.amount} {item.currency}
          </Text>
          <View 
            className="px-2 py-1 rounded-full"
            style={{ backgroundColor: `${getStatusColor(item.status)}20` }}
          >
            <Text 
              className="text-xs font-medium"
              style={{ color: getStatusColor(item.status) }}
            >
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>
      </View>
      
      {item.metadata && (
        <View className="mt-2 pt-2 border-t border-gray-100">
          <Text className="text-xs text-gray-400" style={{ fontFamily: 'Quicksand' }}>
            ID: {item.transaction_id}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Render filter buttons
  const renderFilterButton = (filter: { key: string; label: string }) => (
    <TouchableOpacity
      key={filter.key}
      className={`px-4 py-2 rounded-full mr-3 ${
        selectedFilter === filter.key 
          ? 'bg-[#8A4DFF]' 
          : 'bg-gray-100'
      }`}
      onPress={() => setSelectedFilter(filter.key)}
      activeOpacity={0.7}
    >
      <Text className={`text-sm font-medium ${
        selectedFilter === filter.key 
          ? 'text-white' 
          : 'text-gray-600'
      }`}>
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-6">
      <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
        <Ionicons name="receipt-outline" size={40} color="#6B7280" />
      </View>
      <Text className="text-xl font-semibold text-gray-900 mb-2 text-center" style={{ fontFamily: 'Quicksand' }}>
        Aucune transaction
      </Text>
      <Text className="text-gray-500 text-center mb-6" style={{ fontFamily: 'Quicksand' }}>
        {selectedFilter === 'ALL' 
          ? 'Vous n\'avez encore effectué aucun paiement.'
          : `Aucune transaction ${filters.find(f => f.key === selectedFilter)?.label.toLowerCase()}.`
        }
      </Text>
      <TouchableOpacity
        className="bg-[#8A4DFF] px-6 py-3 rounded-full"
        onPress={() => router.push('/(tabs)/plans')}
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold" style={{ fontFamily: 'Quicksand' }}>
          Souscrire à un plan
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        
        <Text className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Quicksand' }}>
          Historique des paiements
        </Text>
        
        <TouchableOpacity
          onPress={() => loadPaymentHistory(true)}
          className="w-10 h-10 items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View className="py-4">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          data={filters}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => renderFilterButton(item)}
        />
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#8A4DFF" />
          <Text className="text-gray-500 mt-4" style={{ fontFamily: 'Quicksand' }}>Chargement...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransactionItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadPaymentHistory(true)}
              colors={['#8A4DFF']}
              tintColor="#8A4DFF"
            />
          }
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
}
