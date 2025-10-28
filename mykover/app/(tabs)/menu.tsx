// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Image,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { FontAwesome6 } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useAuth } from '../../src/contexts/AuthContext';
// import api from '../../services/api';

// interface UserProfile {
//   id: number;
//   fullName: string;
//   phoneNumber: string;
//   email: string;
// }

// export default function MenuScreen() {
//   const { user, logout } = useAuth();
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   const fetchUserProfile = async () => {
//     try {
//       const response = await api.get('/api/me');
//       if (response.data.success) {
//         setUserProfile(response.data.data.user);
//       }
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     Alert.alert(
//       'Déconnexion',
//       'Êtes-vous sûr de vouloir vous déconnecter?',
//       [
//         { text: 'Annuler', style: 'cancel' },
//         {
//           text: 'Déconnexion',
//           style: 'destructive',
//           onPress: async () => {
//             await logout();
//             router.replace('/login');
//           },
//         },
//       ]
//     );
//   };

//   const menuItems = [
//     {
//       id: 'transactions',
//       title: 'Transactions',
//       icon: 'receipt',
//       onPress: () => router.push('/payment-history'),
//     },
//     {
//       id: 'notifications',
//       title: 'Notification Inbox',
//       icon: 'bell',
//       badge: 5,
//       // onPress: () => Alert.alert('Info', 'Fonctionnalité en développement'),
//       onPress: () => router.push('/notifications'),
//     },
//     {
//       id: 'settings',
//       title: 'Settings',
//       icon: 'gear',
//       onPress: () => router.push('/settings'),
//     },
//     // {
//     //   id: 'hospitals',
//     //   title: 'Partner Hospitals',
//     //   icon: 'hospital',
//     //   onPress: () => router.push('/map'),
//     // },
//     {
//       id: 'support',
//       title: 'Help & Support',
//       icon: 'headset',
//       // onPress: () => Alert.alert('Support', 'Contactez-nous à support@mykover.cd'),
//       onPress: () => router.push('/help-support'),
//     },
//     {
//       id: 'terms',
//       title: 'Terms & Conditions',
//       icon: 'file-contract',
//       // onPress: () => Alert.alert('Info', 'Conditions d\'utilisation'),
//       onPress: () => router.push('/terms-conditions'),
//     },
//     {
//       id: 'about',
//       title: 'About Us',
//       icon: 'info-circle',
//       // onPress: () => Alert.alert('MyKover', 'Votre assurance santé numérique à Kinshasa'),
//       onPress: () => router.push('/about-us'),
//     },
//     {
//       id: 'rate',
//       title: 'Rate Us',
//       icon: 'star',
//       // onPress: () => Alert.alert('Merci!', 'Évaluez-nous sur l\'App Store'),
//       onPress: () => router.push('/rate-us'),
//     },
//   ];

//   const MenuItem = ({ item }: { item: typeof menuItems[0] }) => (
//     <TouchableOpacity
//       className="flex-row items-center p-4 mb-3 bg-white border border-gray-100 shadow-sm rounded-xl"
//       onPress={item.onPress}
//     >
//       <View className="items-center justify-center w-10 h-10 mr-4 rounded-full bg-blue-50">
//         <FontAwesome6 name={item.icon} size={18} color="#007AFF" />
//       </View>
      
//       <View className="flex-1">
//         <Text className="text-base font-medium text-gray-900">{item.title}</Text>
//       </View>

//       {item.badge && (
//         <View className="items-center justify-center w-6 h-6 mr-2 bg-red-500 rounded-full">
//           <Text className="text-xs font-bold text-white">{item.badge}</Text>
//         </View>
//       )}

//       <FontAwesome6 name="chevron-right" size={14} color="#9CA3AF" />
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="px-4 py-4 bg-white border-b border-gray-100">
//         <Text className="text-2xl font-bold text-gray-900">Menu</Text>
//       </View>

//       <ScrollView className="flex-1 px-4 py-4">
//         {/* Profile Summary */}
//         <View className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
//           <View className="flex-row items-center">
//             <View className="items-center justify-center w-16 h-16 mr-4 bg-blue-100 rounded-full">
//               <FontAwesome6 name="user" size={24} color="#007AFF" />
//             </View>
            
//             <View className="flex-1">
//               <Text className="text-xl font-bold text-gray-900">
//                 {user?.fullName || userProfile?.fullName || 'Chargement...'}
//               </Text>
//               <Text className="mt-1 text-gray-600">
//                 {user?.phoneNumber || userProfile?.phoneNumber || ''}
//               </Text>
//             </View>

//             <TouchableOpacity
//               className="p-2"
//               onPress={() => router.push('/profile')}
//             >
//               <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Menu Items */}
//         {menuItems.map((item) => (
//           <MenuItem key={item.id} item={item} />
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import api, { authApi } from '../../services/api';
import { getAvatarForUser } from '../../src/utils/avatarUtils';

interface UserProfile {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
}

export default function MenuScreen() {
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authApi.me();
      if (response.success) {
        setUserProfile(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const menuItems = [
    // ACCOUNT & PLAN
    {
      id: 'transactions',
      title: 'Transactions',
      icon: 'receipt',
      section: 'account',
      onPress: () => router.push('/payment-history'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'bell',
      badge: 0,
      section: 'account',
      onPress: () => router.push('/notifications'),
    },
   // {
   //   id: 'settings',
   //   title: 'Paramètres',
   //   icon: 'gear',
   //   section: 'account',
   //   onPress: () => router.push('/settings'),
   // },

    // SUPPORT & INFO
    {
      id: 'support',
      title: 'Aide & Support',
      icon: 'headset',
      section: 'support',
      onPress: () => router.push('/help-support'),
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: 'circle-question',
      section: 'support',
      onPress: () => router.push('/faq'),
    },
    {
      id: 'terms',
      title: 'Conditions d\'utilisation',
      icon: 'file-contract',
      section: 'support',
      onPress: () => router.push('/terms-conditions'),
    },
    {
      id: 'about',
      title: 'À propos',
      icon: 'info',
      section: 'support',
      onPress: () => router.push('/about-us'),
    },

    // FEEDBACK
    {
      id: 'rate',
      title: 'Évaluer l\'app',
      icon: 'star',
      section: 'feedback',
      onPress: () => router.push('/rate-us'),
    },
    {
      id: 'feature-request',
      title: 'Demander une fonctionnalité',
      icon: 'message',
      section: 'feedback',
      onPress: () => Linking.openURL('https://wa.me/243971379450'),
    },
  ];

  const MenuItem = ({ item }: { item: typeof menuItems[0] }) => {
    const handlePress = () => {
      if (item.onPress) {
        item.onPress();
      }
    };

    return (
      <TouchableOpacity
        className="flex-row items-center p-4 mb-3 bg-white border border-gray-100 shadow-sm rounded-xl"
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View className="items-center justify-center w-12 h-12 mr-4 rounded-full bg-[#8A4DFF]">
          <FontAwesome6 name={item.icon} size={20} color="white" />
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Quicksand-SemiBold' }}>
            {item.title}
          </Text>
        </View>

        {item.badge && item.badge > 0 && (
          <View className="items-center justify-center w-6 h-6 mr-2 bg-red-500 rounded-full">
            <Text className="text-xs font-bold text-white" style={{ fontFamily: 'Quicksand-Bold' }}>
              {item.badge}
            </Text>
          </View>
        )}

        <FontAwesome6 name="chevron-right" size={14} color="#9CA3AF" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#8A4DFF" />
          <Text className="mt-4 text-gray-600" style={{ fontFamily: 'Quicksand' }}>
            Chargement...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#8A4DFF" />
      
      {/* Header */}
      <View className="px-4 py-4 bg-[#8A4DFF]">
        <Text className="text-2xl font-bold text-white">Menu</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Profile Summary */}
        <TouchableOpacity
          className="flex-row items-center p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl"
          onPress={() => router.push('/profile')}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: getAvatarForUser(user?.id || userProfile?.id) }}
            className="w-16 h-16 mr-4 rounded-full"
          />
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Quicksand-Bold' }}>
              {user?.fullName || userProfile?.fullName || 'Utilisateur'}
            </Text>
            <Text className="mt-1 text-gray-600" style={{ fontFamily: 'Quicksand' }}>
              {user?.phoneNumber || userProfile?.phoneNumber || ''}
            </Text>
          </View>
          <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Menu Items by Section */}
        {['account', 'support', 'feedback'].map((section) => {
          const sectionTitles = {
            account: 'Mon compte',
            support: 'Support & Aide',
            feedback: 'Votre avis'
          };
          
          return (
            <View key={section} className="mb-6">
              <Text className="px-2 mb-3 text-sm font-semibold text-gray-500 uppercase" style={{ fontFamily: 'Quicksand-SemiBold' }}>
                {sectionTitles[section as keyof typeof sectionTitles]}
              </Text>
              {menuItems
                .filter((item) => item.section === section)
                .map((item) => (
                  <MenuItem key={item.id} item={item} />
                ))}
            </View>
          );
        })}

        {/* Logout */}
        <TouchableOpacity
          className="items-center p-4 mb-6 bg-red-100 border border-red-200 rounded-xl"
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text className="font-semibold text-red-700" style={{ fontFamily: 'Quicksand-SemiBold' }}>
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
