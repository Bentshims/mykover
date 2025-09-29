import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface TopNavBarCustomProps {
  onAvatarPress: () => void;
  onNotificationPress: () => void;
  notificationCount?: number;
}

export default function TopNavBarCustom({
  onAvatarPress,
  onNotificationPress,
  notificationCount = 0,
}: TopNavBarCustomProps) {
  return (
    <SafeAreaView className="bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        {/* Avatar */}
        <TouchableOpacity
          onPress={onAvatarPress}
          className="items-center justify-center w-10 h-10 bg-purple-100 rounded-full"
        >
          <Ionicons name="person" size={20} color="#7c3aed" />
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-lg font-semibold text-gray-900">
          MyKover
        </Text>

        {/* Right side buttons */}
        <View className="flex-row items-center space-x-3">
          {/* Notifications */}
          <TouchableOpacity
            onPress={onNotificationPress}
            className="relative items-center justify-center w-10 h-10 bg-gray-100 rounded-full"
          >
            <Ionicons name="notifications" size={20} color="#6B7280" />
            {notificationCount > 0 && (
              <View className="absolute items-center justify-center w-5 h-5 bg-red-500 rounded-full -top-1 -right-1">
                <Text className="text-xs font-bold text-white">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
} 