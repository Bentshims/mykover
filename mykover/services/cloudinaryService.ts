const CLOUDINARY_CLOUD_NAME = 'drsd8adkq' // Ton vrai cloud name
const CLOUDINARY_UPLOAD_PRESET = 'mykover_unsigned'

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
    // Créer FormData pour upload
    const formData = new FormData()
    
    // Extraire le nom du fichier depuis l'URI
    const filename = imageUri.split('/').pop() || 'photo.jpg'
    
    // Ajouter le fichier au FormData (IMPORTANT: fichier en premier)
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: filename,
    } as any)
    
    // IMPORTANT: Pour unsigned upload, SEULEMENT upload_preset est requis
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

    console.log('[Cloudinary] Upload début...', { 
      cloudName: CLOUDINARY_CLOUD_NAME, 
      preset: CLOUDINARY_UPLOAD_PRESET,
      uri: imageUri
    })

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const responseText = await uploadResponse.text()
    console.log('[Cloudinary] Réponse brute:', responseText)

    if (!uploadResponse.ok) {
      throw new Error(`Upload échoué: ${uploadResponse.status} - ${responseText}`)
    }

    const data = JSON.parse(responseText)
    console.log('[Cloudinary] Upload réussi:', data.secure_url)

    return {
      success: true,
      data: {
        secure_url: data.secure_url,
        public_id: data.public_id,
      },
    }
  } catch (error: any) {
    console.error('[Cloudinary] Erreur upload:', error)
    return {
      success: false,
      error: error.message || 'Erreur upload',
    }
  }
}

