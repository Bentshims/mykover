const CLOUDINARY_CLOUD_NAME = 'your-cloud-name' // À configurer
const CLOUDINARY_UPLOAD_PRESET = 'mykover_unsigned' // À configurer

interface CloudinaryUploadResult {
  success: boolean
  data?: {
    secure_url: string
    public_id: string
  }
  error?: string
}

export const uploadToCloudinary = async (
  imageUri: string
): Promise<CloudinaryUploadResult> => {
  try {
    const formData = new FormData()
    
    // Créer le blob depuis l'URI
    const response = await fetch(imageUri)
    const blob = await response.blob()
    
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    formData.append('folder', 'mykover/members')

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!uploadResponse.ok) {
      throw new Error('Upload échoué')
    }

    const data = await uploadResponse.json()

    return {
      success: true,
      data: {
        secure_url: data.secure_url,
        public_id: data.public_id,
      },
    }
  } catch (error: any) {
    console.error('Cloudinary upload error:', error)
    return {
      success: false,
      error: error.message || 'Erreur upload',
    }
  }
}

