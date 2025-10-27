// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
// import { router } from 'expo-router';
// import { FontAwesome6 } from '@expo/vector-icons';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface SettingsState {
//   notifications: boolean;
//   biometric: boolean;
//   autoRenewal: boolean;
//   emailUpdates: boolean;
//   smsAlerts: boolean;
// }

// export default function SettingsScreen() {
//   const [settings, setSettings] = useState<SettingsState>({
//     notifications: true,
//     biometric: false,
//     autoRenewal: true,
//     emailUpdates: true,
//     smsAlerts: false,
//   });

//   useEffect(() => {
//     loadSettings();
//   }, []);

//   const loadSettings = async () => {
//     try {
//       const savedSettings = await AsyncStorage.getItem('app_settings');
//       if (savedSettings) {
//         setSettings(JSON.parse(savedSettings));
//       }
//     } catch (error) {
//       console.error('Error loading settings:', error);
//     }
//   };

//   const saveSettings = async (newSettings: SettingsState) => {
//     try {
//       await AsyncStorage.setItem('app_settings', JSON.stringify(newSettings));
//       setSettings(newSettings);
//     } catch (error) {
//       console.error('Error saving settings:', error);
//       Alert.alert('Erreur', 'Impossible de sauvegarder les paramètres');
//     }
//   };

//   const toggleSetting = (key: keyof SettingsState) => {
//     const newSettings = { ...settings, [key]: !settings[key] };
//     saveSettings(newSettings);
//   };

//   const handleLogout = () => {
//     Alert.alert(
//       'Déconnexion',
//       'Êtes-vous sûr de vouloir vous déconnecter ?',
//       [
//         { text: 'Annuler', style: 'cancel' },
//         {
//           text: 'Déconnexion',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await AsyncStorage.removeItem('auth_token');
//               router.replace('/login');
//             } catch (error) {
//               console.error('Error during logout:', error);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleDeleteAccount = () => {
//     Alert.alert(
//       'Supprimer le compte',
//       'Cette action est irréversible. Toutes vos données seront supprimées définitivement.',
//       [
//         { text: 'Annuler', style: 'cancel' },
//         {
//           text: 'Supprimer',
//           style: 'destructive',
//           onPress: () => {
//             Alert.alert('Info', 'Fonctionnalité en développement');
//           },
//         },
//       ]
//     );
//   };

//   const SettingItem = ({ 
//     icon, 
//     title, 
//     subtitle, 
//     value, 
//     onToggle, 
//     showSwitch = true 
//   }: {
//     icon: string;
//     title: string;
//     subtitle?: string;
//     value?: boolean;
//     onToggle?: () => void;
//     showSwitch?: boolean;
//   }) => (
//     <View className="p-4 mb-3 bg-white border border-gray-100 rounded-xl">
//       <View className="flex-row items-center justify-between">
//         <View className="flex-row items-center flex-1">
//           <FontAwesome6 name={icon} size={20} color="#6B7280" />
//           <View className="flex-1 ml-3">
//             <Text className="font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>{title}</Text>
//             {subtitle && (
//               <Text className="mt-1 text-sm text-gray-600" style={{ fontFamily: 'Quicksand' }}>{subtitle}</Text>
//             )}
//           </View>
//         </View>
//         {showSwitch && (
//           <Switch
//             value={value}
//             onValueChange={onToggle}
//             trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
//             thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
//           />
//         )}
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100">
//         <TouchableOpacity onPress={() => router.back()} className="mr-4">
//           <FontAwesome6 name="arrow-left" size={20} color="#374151" />
//         </TouchableOpacity>
//         <Text className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Paramètres</Text>
//       </View>

//       <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 30 }}>
//         {/* Notifications Section */}
//         <View className="mb-6">
//           <Text className="mb-4 text-lg font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Notifications</Text>
          
//           <SettingItem
//             icon="bell"
//             title="Notifications Push"
//             subtitle="Recevoir des notifications sur votre appareil"
//             value={settings.notifications}
//             onToggle={() => toggleSetting('notifications')}
//           />

//           <SettingItem
//             icon="envelope"
//             title="Mises à jour par Email"
//             subtitle="Recevoir des informations importantes par email"
//             value={settings.emailUpdates}
//             onToggle={() => toggleSetting('emailUpdates')}
//           />

//           <SettingItem
//             icon="message"
//             title="Alertes SMS"
//             subtitle="Recevoir des alertes importantes par SMS"
//             value={settings.smsAlerts}
//             onToggle={() => toggleSetting('smsAlerts')}
//           />
//         </View>

//         {/* Security Section */}
//         <View className="mb-6">
//           <Text className="mb-4 text-lg font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Sécurité</Text>
          
//           <SettingItem
//             icon="fingerprint"
//             title="Authentification Biométrique"
//             subtitle="Utiliser l'empreinte digitale ou Face ID"
//             value={settings.biometric}
//             onToggle={() => toggleSetting('biometric')}
//           />

//           {/* <TouchableOpacity className="p-4 mb-3 bg-white border border-gray-100 rounded-xl">
//             <View className="flex-row items-center justify-between">
//               <View className="flex-row items-center">
//                 <FontAwesome6 name="key" size={20} color="#6B7280" />
//                 <Text className="ml-3 font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>Changer le mot de passe</Text>
//               </View>
//               <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
//             </View>
//           </TouchableOpacity> */}
//         </View>

//         {/* Subscription Section */}
//         <View className="mb-6">
//           <Text className="mb-4 text-lg font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Abonnement</Text>
          
//           {/* <SettingItem
//             icon="rotate"
//             title="Renouvellement Automatique"
//             subtitle="Renouveler automatiquement votre assurance"
//             value={settings.autoRenewal}
//             onToggle={() => toggleSetting('autoRenewal')}
//           /> */}

//           <TouchableOpacity 
//             className="p-4 mb-3 bg-white border border-gray-100 rounded-xl"
//             onPress={() => router.push('/plans')}
//           >
//             <View className="flex-row items-center justify-between">
//               <View className="flex-row items-center">
//                 <FontAwesome6 name="credit-card" size={20} color="#6B7280" />
//                 <Text className="ml-3 font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>Gérer l'abonnement</Text>
//               </View>
//               <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
//             </View>
//           </TouchableOpacity>
//         </View>

//         {/* Support Section */}
//         <View className="mb-6">
//           <Text className="mb-4 text-lg font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Support</Text>
          
//           <TouchableOpacity 
//             className="p-4 mb-3 bg-white border border-gray-100 rounded-xl"
//             onPress={() => Alert.alert('Info', 'Fonctionnalité en développement')}
//           >
//             <View className="flex-row items-center justify-between">
//               <View className="flex-row items-center">
//                 <FontAwesome6 name="headset" size={20} color="#6B7280" />
//                 <Text className="ml-3 font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>Centre d'aide</Text>
//               </View>
//               <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             className="p-4 mb-3 bg-white border border-gray-100 rounded-xl"
//             onPress={() => Alert.alert('Info', 'Fonctionnalité en développement')}
//           >
//             <View className="flex-row items-center justify-between">
//               <View className="flex-row items-center">
//                 <FontAwesome6 name="bug" size={20} color="#6B7280" />
//                 <Text className="ml-3 font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>Signaler un problème</Text>
//               </View>
//               <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             className="p-4 mb-3 bg-white border border-gray-100 rounded-xl"
//             onPress={() => Alert.alert('Info', 'Fonctionnalité en développement')}
//           >
//             <View className="flex-row items-center justify-between">
//               <View className="flex-row items-center">
//                 <FontAwesome6 name="file-lines" size={20} color="#6B7280" />
//                 <Text className="ml-3 font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>Conditions d'utilisation</Text>
//               </View>
//               <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             className="p-4 mb-3 bg-white border border-gray-100 rounded-xl"
//             onPress={() => Alert.alert('Info', 'Fonctionnalité en développement')}
//           >
//             <View className="flex-row items-center justify-between">
//               <View className="flex-row items-center">
//                 <FontAwesome6 name="shield-halved" size={20} color="#6B7280" />
//                 <Text className="ml-3 font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>Politique de confidentialité</Text>
//               </View>
//               <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
//             </View>
//           </TouchableOpacity>
//         </View>

//         {/* App Info Section */}
//         <View className="mb-6">
//           <Text className="mb-4 text-lg font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Application</Text>
          
//           <View className="p-4 mb-3 bg-white border border-gray-100 rounded-xl">
//             <View className="flex-row items-center justify-between">
//               <View className="flex-row items-center">
//                 <FontAwesome6 name="mobile-screen" size={20} color="#6B7280" />
//                 <Text className="ml-3 font-medium text-gray-900" style={{ fontFamily: 'Quicksand' }}>Version</Text>
//               </View>
//               <Text className="text-gray-600" style={{ fontFamily: 'Quicksand' }}>1.0.0</Text>
//             </View>
//           </View>
//         </View>

//         {/* Danger Zone */}
//         <View className="mb-6">
//           <Text className="mb-4 text-lg font-bold text-red-600" style={{ fontFamily: 'Quicksand' }}>Zone de danger</Text>
          
//           <TouchableOpacity 
//             className="p-4 mb-3 bg-white border border-red-200 rounded-xl"
//             onPress={handleLogout}
//           >
//             <View className="flex-row items-center">
//               <FontAwesome6 name="right-from-bracket" size={20} color="#DC2626" />
//               <Text className="ml-3 font-medium text-red-600" style={{ fontFamily: 'Quicksand' }}>Se déconnecter</Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             className="p-4 mb-3 bg-white border border-red-200 rounded-xl"
//             onPress={handleDeleteAccount}
//           >
//             <View className="flex-row items-center">
//               <FontAwesome6 name="trash" size={20} color="#DC2626" />
//               <Text className="ml-3 font-medium text-red-600" style={{ fontFamily: 'Quicksand' }}>Supprimer le compte</Text>
//             </View>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  notifications: boolean;
  biometric: boolean;
  autoRenewal: boolean;
  emailUpdates: boolean;
  smsAlerts: boolean;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    biometric: false,
    autoRenewal: true,
    emailUpdates: true,
    smsAlerts: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('app_settings');
      if (saved) setSettings(JSON.parse(saved));
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const saveSettings = async (newSettings: SettingsState) => {
    try {
      await AsyncStorage.setItem('app_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de sauvegarder les paramètres');
    }
  };

  const toggleSetting = (key: keyof SettingsState) => {
    const updated = { ...settings, [key]: !settings[key] };
    saveSettings(updated);
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('auth_token');
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Vos données seront définitivement supprimées.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => Alert.alert('Info', 'Fonctionnalité en développement'),
        },
      ]
    );
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    value,
    onToggle,
    showSwitch = true,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value?: boolean;
    onToggle?: () => void;
    showSwitch?: boolean;
  }) => (
    <View className="p-4 mb-3 bg-white shadow-sm rounded-2xl">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-9 h-9 rounded-full bg-[#F3E8FF] items-center justify-center">
            <FontAwesome6 name={icon} size={18} color="#8A4DFF" />
          </View>
          <View className="flex-1 ml-3">
            <Text className="font-semibold text-gray-900" style={{ fontFamily: 'Quicksand' }}>{title}</Text>
            {subtitle && <Text className="mt-1 text-sm text-gray-500" style={{ fontFamily: 'Quicksand' }}>{subtitle}</Text>}
          </View>
        </View>
        {showSwitch && (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: '#E5E7EB', true: '#8A4DFF' }}
            thumbColor={'#FFFFFF'}
          />
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <FontAwesome6 name="arrow-left" size={20} color="#374151" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Paramètres</Text>
          <Text className="text-sm text-gray-500" style={{ fontFamily: 'Quicksand' }}>Gérez vos préférences et votre compte</Text>
        </View>
      </View>

      <ScrollView className="px-5 pt-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Notifications */}
        <Text className="mb-3 text-lg font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Notifications</Text>
        <SettingItem
          icon="bell"
          title="Notifications Push"
          subtitle="Recevoir des alertes sur votre appareil"
          value={settings.notifications}
          onToggle={() => toggleSetting('notifications')}
        />
        <SettingItem
          icon="envelope"
          title="Emails"
          subtitle="Recevoir des mises à jour importantes"
          value={settings.emailUpdates}
          onToggle={() => toggleSetting('emailUpdates')}
        />
        <SettingItem
          icon="message"
          title="Alertes SMS"
          subtitle="Recevoir des alertes de paiement et santé"
          value={settings.smsAlerts}
          onToggle={() => toggleSetting('smsAlerts')}
        />

        {/* Security */}
        <Text className="mt-6 mb-3 text-lg font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Sécurité</Text>
        <SettingItem
          icon="fingerprint"
          title="Authentification Biométrique"
          subtitle="Utilisez votre empreinte digitale ou Face ID"
          value={settings.biometric}
          onToggle={() => toggleSetting('biometric')}
        />

        {/* Subscription */}
        <Text className="mt-6 mb-3 text-lg font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Abonnement</Text>
        <TouchableOpacity
          onPress={() => router.push('/plans')}
          className="flex-row items-center justify-between p-4 bg-white shadow-sm rounded-2xl"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center">
            <View className="w-9 h-9 rounded-full bg-[#EDE9FE] items-center justify-center">
              <FontAwesome6 name="credit-card" size={18} color="#8A4DFF" />
            </View>
            <View className="ml-3">
              <Text className="font-semibold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Gérer mon abonnement</Text>
              <Text className="mt-1 text-sm text-gray-500" style={{ fontFamily: 'Quicksand' }}>Voir ou modifier votre plan actuel</Text>
            </View>
          </View>
          <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Support */}
        <Text className="mt-6 mb-3 text-lg font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Assistance & Support</Text>
        {[
          { icon: 'headset', title: "Centre d'aide" },
          { icon: 'bug', title: 'Signaler un problème' },
          { icon: 'file-lines', title: "Conditions d'utilisation" },
          { icon: 'shield-halved', title: 'Politique de confidentialité' },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            className="flex-row items-center justify-between p-4 mb-3 bg-white shadow-sm rounded-2xl"
            onPress={() => Alert.alert('Info', 'Fonctionnalité en développement')}
          >
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-full bg-[#F3E8FF] items-center justify-center">
                <FontAwesome6 name={item.icon} size={18} color="#8A4DFF" />
              </View>
              <Text className="ml-3 font-semibold text-gray-900" style={{ fontFamily: 'Quicksand' }}>{item.title}</Text>
            </View>
            <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        {/* App Info */}
        <Text className="mt-6 mb-3 text-lg font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Application</Text>
        <View className="flex-row items-center justify-between p-4 bg-white shadow-sm rounded-2xl">
          <View className="flex-row items-center">
            <View className="w-9 h-9 rounded-full bg-[#F3E8FF] items-center justify-center">
              <FontAwesome6 name="mobile-screen" size={18} color="#8A4DFF" />
            </View>
            <Text className="ml-3 font-semibold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Version</Text>
          </View>
          <Text className="text-gray-600" style={{ fontFamily: 'Quicksand' }}>1.0.0</Text>
        </View>

        {/* Danger Zone */}
        <View className="p-5 mt-10 bg-red-50 rounded-2xl">
          <Text className="mb-4 text-lg font-bold text-red-600" style={{ fontFamily: 'Quicksand' }}>Zone de danger</Text>
          <TouchableOpacity onPress={handleLogout} className="flex-row items-center mb-4">
            <FontAwesome6 name="right-from-bracket" size={18} color="#DC2626" />
            <Text className="ml-3 font-semibold text-red-600" style={{ fontFamily: 'Quicksand' }}>Se déconnecter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteAccount} className="flex-row items-center">
            <FontAwesome6 name="trash" size={18} color="#DC2626" />
            <Text className="ml-3 font-semibold text-red-600" style={{ fontFamily: 'Quicksand' }}>Supprimer le compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
