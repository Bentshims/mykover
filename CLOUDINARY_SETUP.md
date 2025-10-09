# 📸 Configuration Cloudinary - Guide Complet

## ⚠️ IMPORTANT : Configuration requise avant de tester l'upload

Le cloud name actuel `mykover_cloud` dans le `.env` **N'EXISTE PAS** sur Cloudinary.  
Vous devez créer votre propre compte et preset.

---

## 🚀 Étapes de configuration

### 1️⃣ **Créer un compte Cloudinary**

1. Aller sur https://cloudinary.com/
2. Cliquer sur "Sign Up" (gratuit)
3. Créer un compte (email + mot de passe)
4. Confirmer l'email

### 2️⃣ **Récupérer le Cloud Name**

Une fois connecté :
1. Dashboard → En haut à gauche, vous verrez : **"Product Environment"**
2. Copier le **Cloud Name** (ex: `dxyz123abc `)
3. Noter aussi l'**API Key** et l'**API Secret** (pour référence)

### 3️⃣ **Créer l'Upload Preset (UNSIGNED)**

1. Aller dans **Settings** (roue dentée en haut à droite)
2. Cliquer sur **Upload** dans le menu de gauche
3. Scroller jusqu'à **"Upload presets"**
4. Cliquer sur **"Add upload preset"**
5. Configurer :
   - **Preset name** : `mykover_unsigned`
   - **Signing Mode** : **Unsigned** ⚠️ (TRÈS IMPORTANT)
   - **Folder** : `mykover_subscription_images`
   - **Allowed formats** : `jpg, jpeg, png`
   - **Max file size** : `2 MB`
   - **Transformation** : (optionnel)
     - Width: 800
     - Height: 800
     - Crop: limit
6. Cliquer sur **Save**

### 4️⃣ **Mettre à jour la configuration**

#### **Backend (.env)**
```env
CLOUDINARY_CLOUD_NAME=VOTRE_CLOUD_NAME_ICI  # Ex: dxyz123abc
CLOUDINARY_UPLOAD_PRESET=mykover_unsigned
CLOUDINARY_FOLDER=mykover_subscription_images
```

#### **Frontend (mykover/services/cloudinaryService.ts)**
Ligne 1 :
```typescript
const CLOUDINARY_CLOUD_NAME = 'VOTRE_CLOUD_NAME_ICI' // Ex: dxyz123abc
```

---

## 🧪 Tester l'upload

### **Test direct dans le navigateur** (sans l'app)

1. Ouvrir https://cloudinary.com/console/c-console
2. Upload Preset : sélectionner `mykover_unsigned`
3. Upload une image
4. Vérifier qu'elle apparaît dans le dossier `mykover_subscription_images`

### **Test dans l'app mobile**

1. Lancer l'app Expo Go
2. Se connecter
3. Aller dans **Plans**
4. Cliquer sur "Souscrire" (ex: Libota)
5. Dans le drawer → Cliquer sur **Caméra** ou **Galerie**
6. Prendre/choisir une photo
7. Vérifier dans les logs :
   ```
   [Cloudinary] Upload début... { cloudName: 'VOTRE_CLOUD_NAME', preset: 'mykover_unsigned' }
   [Cloudinary] Réponse brute: {...}
   [Cloudinary] Upload réussi: https://res.cloudinary.com/...
   ```

---

## ❌ Erreurs courantes

### **Erreur : "Upload échoué: 401"**
→ **Cause** : Preset non trouvé ou signing mode = "Signed"  
→ **Solution** : Vérifier que le preset existe et est bien en mode **Unsigned**

### **Erreur : "Upload échoué: 400 - Invalid cloud_name"**
→ **Cause** : Le cloud_name n'existe pas  
→ **Solution** : Copier le bon cloud_name depuis le dashboard Cloudinary

### **Erreur : "Upload échoué: 404"**
→ **Cause** : URL incorrecte ou preset inexistant  
→ **Solution** : Vérifier l'URL et le nom du preset

### **Erreur : "Network request failed"**
→ **Cause** : Problème réseau ou URL incorrecte  
→ **Solution** : Vérifier la connexion internet

---

## 📊 Vérifier les uploads

1. Dashboard Cloudinary → **Media Library**
2. Dossier : `mykover_subscription_images`
3. Vous devriez voir les photos uploadées

---

## 🔐 Sécurité

### **Pourquoi "Unsigned" ?**
- Expo Managed ne permet pas de signer côté serveur facilement
- L'upload unsigned est limité par le preset (formats, taille, dossier)
- Pas de clé API exposée côté frontend

### **Limitations du preset**
- ✅ Formats : jpg, jpeg, png uniquement
- ✅ Taille max : 2 MB
- ✅ Dossier verrouillé : `mykover_subscription_images`
- ✅ Transformation auto : resize si trop grand

---

## 📝 Checklist finale

Avant de tester l'app :

- [ ] Compte Cloudinary créé
- [ ] Cloud Name récupéré
- [ ] Upload preset `mykover_unsigned` créé en mode **Unsigned**
- [ ] `.env` backend mis à jour avec le cloud name
- [ ] `cloudinaryService.ts` frontend mis à jour avec le cloud name
- [ ] Backend redémarré : `npm run dev`
- [ ] Frontend redémarré : `npx expo start --clear`

---

## 🎯 Configuration actuelle (à remplacer)

**Backend `.env` (ligne 42)** :
```env
CLOUDINARY_CLOUD_NAME=mykover_cloud  # ❌ N'existe pas ! À remplacer
```

**Frontend `cloudinaryService.ts` (ligne 1)** :
```typescript
const CLOUDINARY_CLOUD_NAME = 'mykover_cloud' // ❌ N'existe pas ! À remplacer
```

---

**Une fois configuré, l'upload fonctionnera parfaitement !** 🚀


