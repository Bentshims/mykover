import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAvatarForUser } from '../src/utils/avatarUtils';

interface TopNavBarCustomProps {
  avatarSource?: string;
  onAvatarPress?: () => void;
  onNotificationPress?: () => void;
  notificationCount?: number;
  title?: string;
  userProfile?: { id?: number | string } | null;
}

export default function TopNavBarCustom({
  avatarSource,
  onAvatarPress,
  onNotificationPress,
  notificationCount = 0,
  title,
  userProfile,
}: TopNavBarCustomProps) {
  
  const avatarUrl = avatarSource || (userProfile?.id ? getAvatarForUser(userProfile.id) : null);
  
  return (
    <View className="flex-row items-center justify-between px-6 py-4">
      
      {/* Avatar à gauche */}
      <TouchableOpacity 
        onPress={onAvatarPress}
        activeOpacity={0.7}
      >
        <View className="w-12 h-12 overflow-hidden rounded-full">
          {avatarUrl ? (
            <Image 
              source={{ uri: avatarUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-white items-center justify-center ">
              <Ionicons name="person" size={24} color="#8A4DFF" />
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Title au centre */}
      {title && (
        <Text className="text-lg font-semibold text-white flex-1 text-center" style={{ fontFamily: 'Quicksand' }}>
          {title}
        </Text>
      )}

      {/* Icône Notification avec badge */}
      <View className="flex-row items-center bg-[#8A4DFF] rounded-full">
        <TouchableOpacity 
          onPress={onNotificationPress}
          className="relative items-center justify-center w-10 h-10"
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={24} color="white" />
          
          {/* Badge de notification avec compteur */}
          {notificationCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
              <Text className="text-xs font-bold text-white" style={{ fontFamily: 'Quicksand' }}>
                {notificationCount > 99 ? '99+' : notificationCount.toString()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View> 
  );
}
