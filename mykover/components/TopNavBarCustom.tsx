import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TopNavBarCustomProps {
  avatarSource?: string;
  onAvatarPress?: () => void;
  onNotificationPress?: () => void;
  notificationCount?: number;
}

export default function TopNavBarCustom({
  avatarSource,
  onAvatarPress,
  onNotificationPress,
  notificationCount = 0,
}: TopNavBarCustomProps) {
  
  return (
    <View className="flex-row items-center justify-between px-6 py-4">
      
      {/* Avatar à gauche */}
      <TouchableOpacity 
        onPress={onAvatarPress}
        activeOpacity={0.7}
      >
        <View className="w-12 h-12 overflow-hidden rounded-full">
          {avatarSource ? (
            <Image 
              source={{ uri: avatarSource }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-[#8A4DFF] items-center justify-center">
              <Ionicons name="person" size={24} color="white" />
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Icône Notification avec badge */}
      <View className="flex-row items-center">
        <TouchableOpacity 
          onPress={onNotificationPress}
          className="relative items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm"
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={20} color="#374151" />
          
          {/* Badge de notification avec compteur */}
          {notificationCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-[#8A4DFF] rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
              <Text className="text-xs font-bold text-white">
                {notificationCount > 99 ? '99+' : notificationCount.toString()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View> 
  );
}
