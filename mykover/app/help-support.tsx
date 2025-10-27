// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Linking,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { FontAwesome6 } from '@expo/vector-icons';
// import { router } from 'expo-router';

// export default function HelpSupportScreen() {
//   const contactMethods = [
//     {
//       id: 'email',
//       title: 'Email',
//       subtitle: 'support@mykover.cd',
//       icon: 'envelope',
//       action: () => Linking.openURL('mailto:support@mykover.cd'),
//     },
//     {
//       id: 'phone',
//       title: 'Téléphone',
//       subtitle: '+243971379450',
//       icon: 'phone',
//       action: () => Linking.openURL('tel:+243971379450'),
//     },
//     {
//       id: 'whatsapp',
//       title: 'WhatsApp',
//       subtitle: 'Chat en direct',
//       icon: 'message',
//       action: () => Linking.openURL('https://wa.me/243971379450'),
//     },
//     {
//       id: 'whatsapp',
//       title: 'Demander Une fonctionalite',
//       subtitle: 'Chat en direct',
//       icon: 'message',
//       action: () => Linking.openURL('https://wa.me/243971379450'),
//     },
//   ];

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100">
//         <TouchableOpacity onPress={() => router.back()} className="mr-4">
//           <FontAwesome6 name="arrow-left" size={20} color="#374151" />
//         </TouchableOpacity>
//         <Text className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Aide & Support</Text>
//       </View>

//       <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
//         {/* FAQ Section */}
//         <View className="px-4 pt-6 mb-6">
//           <TouchableOpacity
//             className="p-4 mb-3 bg-white border border-gray-100 shadow-sm rounded-xl"
//             onPress={() => router.push('/faq')}
//           >
//             <View className="flex-row items-center">
//               <View className="items-center justify-center w-12 h-12 mr-4 rounded-full bg-purple-50">
//                 <FontAwesome6 name="circle-question" size={20} color="#8B5CF6" />
//               </View>
//               <View className="flex-1">
//                 <Text className="font-semibold text-gray-900" style={{ fontFamily: 'Quicksand' }}>FAQ</Text>
//               </View>
//               <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
//             </View>
//           </TouchableOpacity>
//         </View>

//         {/* Contact Methods */}
//         <View className="px-4">
//           <Text className="mb-4 text-lg font-bold text-gray-600" style={{ fontFamily: 'Quicksand' }}>Contact Us</Text>
//           {contactMethods.map((method) => (
//             <TouchableOpacity
//               key={method.id}
//               className="p-4 mb-3 bg-white border border-gray-100 shadow-sm rounded-xl"
//               onPress={method.action}
//             >
//               <View className="flex-row items-center">
//                 <View className="items-center justify-center w-12 h-12 mr-4 rounded-full bg-purple-50">
//                   <FontAwesome6 name={method.icon} size={20} color="#8B5CF6" />
//                 </View>
//                 <View className="flex-1">
//                   <Text className="font-semibold text-gray-900" style={{ fontFamily: 'Quicksand' }}>{method.title}</Text>
//                   <Text className="text-sm text-gray-600" style={{ fontFamily: 'Quicksand' }}>{method.subtitle}</Text>
//                 </View>
//                 <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HelpSupportScreen() {
  const contactMethods = [
    {
      id: 'email',
      title: 'Email',
      subtitle: 'support@mykover.cd',
      icon: 'envelope',
      action: () => Linking.openURL('mailto:support@mykover.cd'),
    },
    {
      id: 'phone',
      title: 'Téléphone',
      subtitle: '+243971379450',
      icon: 'phone',
      action: () => Linking.openURL('tel:+243971379450'),
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      subtitle: 'Chat en direct',
      icon: 'message',
      action: () => Linking.openURL('https://wa.me/243971379450'),
    },
    {
      id: 'feature_request',
      title: 'Demander une fonctionnalité',
      subtitle: 'Partagez vos idées avec nous',
      icon: 'lightbulb',
      action: () => Linking.openURL('https://wa.me/243971379450'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <FontAwesome6 name="arrow-left" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Quicksand' }}>Aide & Support</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* FAQ Section */}
        <View className="px-4 pt-6 mb-6">
          <TouchableOpacity
            className="p-4 mb-3 bg-white border border-gray-100 shadow-sm rounded-xl"
            onPress={() => router.push('/faq')}
          >
            <View className="flex-row items-center">
              <View className="items-center justify-center w-12 h-12 mr-4 rounded-full bg-purple-50">
                <FontAwesome6 name="circle-question" size={20} color="#8A4DFF" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900" style={{ fontFamily: 'Quicksand' }}>FAQ</Text>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Contact Methods */}
        <View className="px-4">
          <Text className="mb-4 text-lg font-bold text-gray-600" style={{ fontFamily: 'Quicksand' }}>Contact & Support</Text>
          {contactMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              className="p-4 mb-3 bg-white border border-gray-100 shadow-sm rounded-xl"
              onPress={method.action}
            >
              <View className="flex-row items-center">
                <View className="items-center justify-center w-12 h-12 mr-4 rounded-full bg-purple-50">
                  <FontAwesome6 name={method.icon} size={20} color="#8A4DFF" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900" style={{ fontFamily: 'Quicksand' }}>{method.title}</Text>
                  <Text className="text-sm text-gray-600" style={{ fontFamily: 'Quicksand' }}>{method.subtitle}</Text>
                </View>
                <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
