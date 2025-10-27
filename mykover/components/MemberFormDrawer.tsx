import React, { useState } from 'react'
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Platform,
  Alert,
  Pressable,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { uploadToCloudinary } from '../services/cloudinaryService'
import DateTimePicker from '@react-native-community/datetimepicker'

interface MemberFormDrawerProps {
  visible: boolean
  onClose: () => void
  onSubmit: (member: {
    firstName: string
    lastName: string
    birthDate: string
    isSick: boolean
    photoUrl: string
    photoPublicId: string
  }) => void
  memberIndex: number
}

export default function MemberFormDrawer({
  visible,
  onClose,
  onSubmit,
  memberIndex,
}: MemberFormDrawerProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthDate, setBirthDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isSick, setIsSick] = useState(false)
  const [photoUri, setPhotoUri] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [uploadedPublicId, setUploadedPublicId] = useState<string | null>(null)

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin d\'accéder à votre caméra')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'] as any,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri)
      await handleUpload(result.assets[0].uri)
    }
  }

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin d\'accéder à vos photos')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'] as any,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri)
      await handleUpload(result.assets[0].uri)
    }
  }

  const handleUpload = async (uri: string) => {
    setUploading(true)
    const result = await uploadToCloudinary(uri)
    setUploading(false)

    if (result.success && result.data) {
      setUploadedUrl(result.data.secure_url)
      setUploadedPublicId(result.data.public_id)
      Alert.alert('Succès', 'Photo uploadée avec succès')
    } else {
      Alert.alert('Erreur', result.error || 'Échec upload')
      setPhotoUri(null)
    }
  }

  const handleSubmit = () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs')
      return
    }

    if (!uploadedUrl) {
      Alert.alert('Erreur', 'Veuillez ajouter une photo')
      return
    }

    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      birthDate: birthDate.toISOString().split('T')[0],
      isSick,
      photoUrl: uploadedUrl,
      photoPublicId: uploadedPublicId || '',
    })

    // Reset
    setFirstName('')
    setLastName('')
    setBirthDate(new Date())
    setIsSick(false)
    setPhotoUri(null)
    setUploadedUrl(null)
    setUploadedPublicId(null)
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable 
        className="flex-1 justify-end bg-black/50" 
        onPress={onClose}
      >
        <Pressable 
          className="bg-white rounded-t-3xl p-6 max-h-[90%]" 
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold" style={{ fontFamily: 'Quicksand' }}>Membre {memberIndex + 1}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Photo */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Quicksand' }}>Photo *</Text>
              {photoUri ? (
                <View className="items-center">
                  <Image source={{ uri: photoUri }} className="w-32 h-32 rounded-full mb-3" />
                  {uploading && <ActivityIndicator size="small" color="#8A4DFF" />}
                </View>
              ) : (
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={pickImage}
                    className="flex-1 bg-[#8A4DFF] py-3 rounded-full flex-row justify-center items-center"
                    activeOpacity={0.8}
                  >
                    <Ionicons name="camera" size={20} color="#fff" />
                    <Text className="text-white font-semibold ml-2" style={{ fontFamily: 'Quicksand' }}>Caméra</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={pickFromGallery}
                    className="flex-1 bg-gray-200 py-3 rounded-full flex-row justify-center items-center"
                    activeOpacity={0.8}
                  >
                    <Ionicons name="images" size={20} color="#374151" />
                    <Text className="text-gray-700 font-semibold ml-2" style={{ fontFamily: 'Quicksand' }}>Galerie</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Prénom */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Quicksand' }}>Prénom *</Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Ex: Jean"
                className="border border-gray-300 rounded-xl px-4 py-3"
              />
            </View>

            {/* Nom */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Quicksand' }}>Nom *</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Ex: Dupont"
                className="border border-gray-300 rounded-xl px-4 py-3"
              />
            </View>

            {/* Date de naissance */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Quicksand' }}>Date de naissance *</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="border border-gray-300 rounded-xl px-4 py-3"
              >
                <Text>{birthDate.toLocaleDateString('fr-FR')}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={birthDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker(Platform.OS === 'ios')
                    if (date) setBirthDate(date)
                  }}
                  maximumDate={new Date()}
                />
              )}
            </View>

            {/* Statut malade - Case à cocher */}
            <View className="mb-6">
              <TouchableOpacity 
                onPress={() => setIsSick(!isSick)}
                className="flex-row items-center py-3"
                activeOpacity={0.7}
              >
                <View className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${isSick ? 'bg-[#8A4DFF] border-[#8A4DFF]' : 'border-gray-300'}`}>
                  {isSick && <Ionicons name="checkmark" size={18} color="#fff" />}
                </View>
                <Text className="text-gray-700 font-medium" style={{ fontFamily: 'Quicksand' }}>A un problème de santé</Text>
              </TouchableOpacity>
            </View>

            {/* Bouton Valider */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={uploading}
              className="bg-[#8A4DFF] py-4 rounded-full"
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-bold text-lg" style={{ fontFamily: 'Quicksand' }}>
                {uploading ? 'Upload en cours...' : 'Valider'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

