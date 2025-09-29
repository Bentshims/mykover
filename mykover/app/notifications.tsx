import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import TopNavBarCustom from '../components/TopNavBarCustom';

// Mock notification data
const mockNotifications = [
  {
    id: '1',
    title: 'Rappel de rendez-vous',
    description: 'Votre consultation avec Dr. Mukendi est prévue demain à 14h30',
    timestamp: 'il y a 2h',
    type: 'appointment',
    isRead: false,
  },
  {
    id: '2',
    title: 'Résultats d\'analyse disponibles',
    description: 'Vos résultats de laboratoire sont maintenant disponibles dans votre dossier médical',
    timestamp: 'il y a 5h',
    type: 'results',
    isRead: false,
  },
  {
    id: '3',
    title: 'Nouveau message du médecin',
    description: 'Dr. Kalala a envoyé un message concernant votre traitement',
    timestamp: 'il y a 1j',
    type: 'message',
    isRead: true,
  },
  {
    id: '4',
    title: 'Rappel de prise de médicament',
    description: 'N\'oubliez pas de prendre votre médicament Paracétamol 500mg',
    timestamp: 'il y a 2j',
    type: 'medication',
    isRead: true,
  },
  {
    id: '5',
    title: 'Mise à jour de votre assurance',
    description: 'Votre couverture d\'assurance santé a été renouvelée avec succès',
    timestamp: 'il y a 3j',
    type: 'insurance',
    isRead: true,
  },
];

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: string;
  isRead: boolean;
}

export default function NotificationScreen() {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleAvatarPress = () => {
    if (isAuthenticated) {
      router.push('/(tabs)/menu');
    } else {
      router.push('/login');
    }
  };

  const handleNotificationPress = () => {
    // Already on notifications screen
  };

  // Simulate API call to fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch('/api/notifications');
        // const data = await response.json();
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        Alert.alert('Erreur', 'Impossible de charger les notifications.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment': return 'calendar';
      case 'results': return 'document-text';
      case 'message': return 'mail';
      case 'medication': return 'medical';
      case 'insurance': return 'shield-checkmark';
      default: return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'bg-blue-100 text-blue-600';
      case 'results': return 'bg-green-100 text-green-600';
      case 'message': return 'bg-purple-100 text-purple-600';
      case 'medication': return 'bg-orange-100 text-orange-600';
      case 'insurance': return 'bg-teal-100 text-teal-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleNotificationTap = (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
    }

    // TODO: Navigate to specific screens based on notification type
    switch (notification.type) {
      case 'appointment':
        // router.push('/appointments');
        break;
      case 'results':
        // router.push('/medical-records');
        break;
      case 'message':
        // router.push('/messages');
        break;
      case 'medication':
        // router.push('/medications');
        break;
      case 'insurance':
        // router.push('/insurance');
        break;
      default:
        break;
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      className={`mx-6 mb-3 p-4 bg-white border rounded-xl ${
        item.isRead ? 'border-gray-200' : 'border-purple-200 bg-purple-50'
      }`}
      onPress={() => handleNotificationTap(item)}
    >
      <View className="flex-row items-start">
        <View className={`items-center justify-center w-12 h-12 mr-4 rounded-full ${getNotificationColor(item.type)}`}>
          <Ionicons 
            name={getNotificationIcon(item.type) as any} 
            size={24} 
            color="currentColor" 
          />
        </View>
        
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className={`text-base font-semibold ${
              item.isRead ? 'text-gray-900' : 'text-purple-900'
            }`}>
              {item.title}
            </Text>
            {!item.isRead && (
              <View className="w-2 h-2 bg-purple-600 rounded-full" />
            )}
          </View>
          
          <Text className="mb-2 text-sm text-gray-600 leading-5">
            {item.description}
          </Text>
          
          <Text className="text-xs text-gray-500">
            {item.timestamp}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-6">
      <Ionicons name="notifications-outline" size={64} color="#d1d5db" />
      <Text className="mt-4 text-xl font-semibold text-gray-900">
        Aucune notification
      </Text>
      <Text className="mt-2 text-center text-gray-600">
        Aucune notification pour le moment.{'\n'}
        Nous vous tiendrons informé des mises à jour importantes.
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View className="flex-1 items-center justify-center">
      <Text className="text-gray-600">Chargement des notifications...</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#7c3aed" />
      
      {/* Custom Top Navigation */}
      <TopNavBarCustom 
        onAvatarPress={handleAvatarPress}
        onNotificationPress={handleNotificationPress}
        notificationCount={notifications.filter(n => !n.isRead).length}
        title="Notifications"
      />

      {/* Header */}
      <View className="px-6 pt-6 pb-4 bg-white">
        <Text className="text-2xl font-bold text-gray-900">
          Notifications
        </Text>
        {notifications.length > 0 && (
          <Text className="mt-1 text-sm text-gray-600">
            {notifications.filter(n => !n.isRead).length} non lues sur {notifications.length}
          </Text>
        )}
      </View>

      {/* Notifications List */}
      {isLoading ? (
        renderLoadingState()
      ) : notifications.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
        />
      )}
    </SafeAreaView>
  );
}
