import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { useAuth } from '../../src/contexts/AuthContext';
import TopNavBarCustom from '../../components/TopNavBarCustom';

// Mock data for healthcare facilities with coordinates
const mockFacilities = [
  {
    id: '1',
    name: 'Hôpital Général de Kinshasa',
    type: 'hospital',
    address: 'Avenue de la Justice, Kinshasa',
    latitude: -4.3276,
    longitude: 15.3136,
    rating: 4.5,
    isOpen: true,
    services: ['Urgences', 'Chirurgie', 'Cardiologie'],
  },
  {
    id: '2',
    name: 'Clinique Ngaliema',
    type: 'clinic',
    address: 'Commune de Ngaliema, Kinshasa',
    latitude: -4.3017,
    longitude: 15.2694,
    rating: 4.2,
    isOpen: true,
    services: ['Consultation', 'Laboratoire', 'Radiologie'],
  },
  {
    id: '3',
    name: 'Pharmacie du Peuple',
    type: 'pharmacy',
    address: 'Avenue Kasa-Vubu, Kinshasa',
    latitude: -4.3317,
    longitude: 15.3047,
    rating: 4.0,
    isOpen: false,
    services: ['Médicaments', 'Parapharmacie'],
  },
  {
    id: '4',
    name: 'Centre Médical de Kinshasa',
    type: 'hospital',
    address: 'Boulevard du 30 Juin, Kinshasa',
    latitude: -4.3197,
    longitude: 15.3078,
    rating: 4.3,
    isOpen: true,
    services: ['Urgences', 'Maternité', 'Pédiatrie'],
  },
  {
    id: '5',
    name: 'Clinique Saint-Joseph',
    type: 'clinic',
    address: 'Commune de Limete, Kinshasa',
    latitude: -4.3456,
    longitude: 15.2889,
    rating: 4.1,
    isOpen: true,
    services: ['Consultation', 'Dentaire', 'Ophtalmologie'],
  },
];

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

interface Facility {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  isOpen: boolean;
  services: string[];
  distance?: string;
}

export default function MapScreen() {
  const { user, isAuthenticated } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [facilitiesWithDistance, setFacilitiesWithDistance] = useState<Facility[]>(mockFacilities);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const handleAvatarPress = () => {
    if (isAuthenticated) {
      router.push('/(tabs)/menu');
    } else {
      router.push('/login');
    }
  };

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  // Request location permission and get user location
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationPermission(false);
          setIsLoadingLocation(false);
          Alert.alert(
            'Permission refusée',
            'L\'accès à la localisation est nécessaire pour calculer les distances et obtenir des itinéraires.'
          );
          return;
        }

        setLocationPermission(true);
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
        
        // Calculate distances for all facilities
        const facilitiesWithDist = mockFacilities.map(facility => ({
          ...facility,
          distance: `${calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            facility.latitude,
            facility.longitude
          )} km`
        }));
        
        setFacilitiesWithDistance(facilitiesWithDist);
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert('Erreur', 'Impossible d\'obtenir votre position actuelle.');
      } finally {
        setIsLoadingLocation(false);
      }
    })();
  }, []);

  // Open directions in Google Maps
  const openDirections = async (facility: Facility) => {
    if (!userLocation) {
      Alert.alert('Erreur', 'Position actuelle non disponible.');
      return;
    }

    try {
      const { latitude: destLat, longitude: destLng } = facility;
      const { latitude: originLat, longitude: originLng } = userLocation.coords;
      
      // Google Maps URLs for directions
      const googleMapsUrl = `https://www.google.com/maps/dir/${originLat},${originLng}/${destLat},${destLng}`;
      const googleMapsAppUrl = `comgooglemaps://?saddr=${originLat},${originLng}&daddr=${destLat},${destLng}&directionsmode=driving`;
      
      // Try to open Google Maps app first
      const canOpenGoogleMaps = await Linking.canOpenURL(googleMapsAppUrl);
      if (canOpenGoogleMaps) {
        await Linking.openURL(googleMapsAppUrl);
        return;
      }
      
      // Fallback to web version of Google Maps
      const canOpenWebMaps = await Linking.canOpenURL(googleMapsUrl);
      if (canOpenWebMaps) {
        await Linking.openURL(googleMapsUrl);
        return;
      }
      
      // Final fallback to device's default maps app
      let fallbackUrl = '';
      if (Platform.OS === 'ios') {
        fallbackUrl = `maps://?saddr=${originLat},${originLng}&daddr=${destLat},${destLng}`;
      } else {
        fallbackUrl = `geo:${destLat},${destLng}?q=${encodeURIComponent(facility.name)}`;
      }
      
      const canOpenFallback = await Linking.canOpenURL(fallbackUrl);
      if (canOpenFallback) {
        await Linking.openURL(fallbackUrl);
      } else {
        Alert.alert('Erreur', 'Aucune application de cartes disponible.');
      }
    } catch (error) {
      console.error('Error opening directions:', error);
      Alert.alert('Erreur', 'Impossible d\'ouvrir les directions.');
    }
  };

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case 'hospital': return 'medical';
      case 'clinic': return 'business';
      case 'pharmacy': return 'medical-outline';
      default: return 'location';
    }
  };

  const getFacilityColor = (type: string) => {
    switch (type) {
      case 'hospital': return 'bg-red-100 text-red-600';
      case 'clinic': return 'bg-blue-100 text-blue-600';
      case 'pharmacy': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredFacilities = selectedFilter === 'all' 
    ? facilitiesWithDistance 
    : facilitiesWithDistance.filter(facility => facility.type === selectedFilter);

  const filterOptions = [
    { key: 'all', label: 'Tous', icon: 'grid' },
    { key: 'hospital', label: 'Hôpitaux', icon: 'medical' },
    { key: 'clinic', label: 'Cliniques', icon: 'business' },
    { key: 'pharmacy', label: 'Pharmacies', icon: 'medical-outline' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#7c3aed" />
      
      {/* Custom Top Navigation */}
      <TopNavBarCustom 
        onAvatarPress={handleAvatarPress}
        onNotificationPress={handleNotificationPress}
        notificationCount={3}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Main Content */}
        <View className="px-6 pt-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="mb-2 text-3xl font-bold text-gray-900">
              Établissements de santé
            </Text>
            <Text className="text-base text-gray-600">
              Trouvez les hôpitaux, cliniques et pharmacies près de chez vous
            </Text>
          </View>

          {/* Filter Options */}
          <View className="mb-6">
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  className={`mr-3 px-4 py-2 rounded-full ${
                    selectedFilter === option.key
                      ? 'bg-purple-600'
                      : 'bg-gray-100'
                  }`}
                  onPress={() => setSelectedFilter(option.key)}
                >
                  <View className="flex-row items-center">
                    <Ionicons 
                      name={option.icon as any} 
                      size={16} 
                      color={selectedFilter === option.key ? 'white' : '#6b7280'} 
                    />
                    <Text className={`ml-2 font-medium ${
                      selectedFilter === option.key
                        ? 'text-white'
                        : 'text-gray-600'
                    }`}>
                      {option.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Quick Actions */}
          {/* <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-900">
              Actions rapides
            </Text>
            <View className="flex-row flex-wrap justify-between">
              <TouchableOpacity className="w-[48%] p-4 mb-3 bg-purple-50 border border-purple-200 rounded-xl">
                <View className="items-center">
                  <Ionicons name="location" size={24} color="#7c3aed" />
                  <Text className="mt-2 text-sm font-semibold text-purple-900">
                    Ma position
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity className="w-[48%] p-4 mb-3 bg-blue-50 border border-blue-200 rounded-xl">
                <View className="items-center">
                  <Ionicons name="search" size={24} color="#3b82f6" />
                  <Text className="mt-2 text-sm font-semibold text-blue-900">
                    Rechercher
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View> */}

          {/* Facilities List */}
          <View className="mb-8">
            <Text className="mb-4 text-lg font-semibold text-gray-900">
              Établissements ({filteredFacilities.length})
            </Text>
            
            <View className="space-y-3">
              {filteredFacilities.map((facility) => (
                <TouchableOpacity
                  key={facility.id}
                  className="p-4 bg-white border border-gray-200 rounded-xl"
                  onPress={() => {/* Navigate to facility detail */}}
                >
                  <View className="flex-row items-start">
                    <View className="items-center justify-center w-12 h-12 mr-4 bg-gray-100 rounded-full">
                      <Ionicons 
                        name={getFacilityIcon(facility.type) as any} 
                        size={24} 
                        color="#6b7280" 
                      />
                    </View>
                    
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-lg font-semibold text-gray-900">
                          {facility.name}
                        </Text>
                        <View className={`px-2 py-1 rounded-full ${getFacilityColor(facility.type)}`}>
                          <Text className="text-xs font-medium">
                            {facility.type === 'hospital' ? 'Hôpital' :
                             facility.type === 'clinic' ? 'Clinique' : 'Pharmacie'}
                          </Text>
                        </View>
                      </View>
                      
                      <Text className="mb-2 text-sm text-gray-600">
                        {facility.address}
                      </Text>
                      
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Ionicons name="location" size={14} color="#6b7280" />
                          <Text className="ml-1 text-sm text-gray-600">
                            {isLoadingLocation ? 'Calcul...' : (facility.distance || 'N/A')}
                          </Text>
                        </View>
                        
                        <View className="flex-row items-center">
                          <Ionicons name="star" size={14} color="#fbbf24" />
                          <Text className="ml-1 text-sm font-medium text-gray-900">
                            {facility.rating}
                          </Text>
                        </View>
                        
                        <View className="flex-row items-center">
                          <View className={`w-2 h-2 rounded-full mr-1 ${
                            facility.isOpen ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <Text className="text-sm text-gray-600">
                            {facility.isOpen ? 'Ouvert' : 'Fermé'}
                          </Text>
                        </View>
                      </View>
                      
                      <View className="flex-row flex-wrap mt-2">
                        {facility.services.slice(0, 3).map((service, index) => (
                          <View key={index} className="px-2 py-1 mb-1 mr-2 bg-gray-100 rounded-full">
                            <Text className="text-xs text-gray-600">{service}</Text>
                          </View>
                        ))}
                        {facility.services.length > 3 && (
                          <View className="px-2 py-1 bg-gray-100 rounded-full">
                            <Text className="text-xs text-gray-600">
                              +{facility.services.length - 3} autres
                            </Text>
                          </View>
                        )}
                      </View>
                      
                      {/* Directions Button */}
                      {locationPermission && userLocation && (
                        <TouchableOpacity
                          className="px-4 py-2 mt-3 bg-purple-600 rounded-lg"
                          onPress={() => openDirections(facility)}
                        >
                          <View className="flex-row items-center justify-center">
                            <Ionicons name="navigate" size={16} color="white" />
                            <Text className="ml-2 text-sm font-medium text-white">
                              Itinéraire
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
