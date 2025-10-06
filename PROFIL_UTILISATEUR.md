# 📱 Page Profil - Récupération de l'Utilisateur

## ✅ FONCTIONNEMENT CONFIRMÉ

### Test Réussi
```bash
1. Login avec +243891234567 → Token généré ✅
2. Appel GET /api/auth/me avec token → Données utilisateur récupérées ✅
3. Réponse backend:
   {
     "success": true,
     "data": {
       "user": {
         "id": "1c16b904-490a-4d11-83b0-e8b4caa59d12",
         "fullname": "Alice Dupont",
         "email": "alice.dupont@test.com",
         "phone": "+243891234567",
         "email_verified": false,
         "birth_date": "1992-05-15T00:00:00.000+02:00"
       }
     }
   }
```

---

## 🔧 Correction Appliquée

### Problème
- **Type UserProfile** avait `id: number`
- **Backend retourne** `id: string` (UUID)

### Solution ✅
```typescript
interface UserProfile {
  id: string; // ✅ CORRIGÉ - UUID
  fullName: string;
  email: string;
  phoneNumber: string;
  // ...
}
```

---

## 📊 Mapping des Données

### Backend → Frontend
```typescript
// Dans profile.tsx ligne 30-46
const userData = response.data.data.user;

setProfile({
  id: userData.id,                    // UUID string
  fullName: userData.fullname,        // backend: "fullname"
  email: userData.email,              // ✅
  phoneNumber: userData.phone,        // backend: "phone"
  userUid: userData.id,               // Utilise l'ID comme UID
  policyNumber: null,                 // TODO: Add insurance endpoint
  insuranceStatus: 'INACTIVE',        // TODO: Add insurance endpoint
  isActive: false,                    // TODO: Add insurance endpoint
  activeUntil: null,                  // TODO: Add insurance endpoint
  createdAt: userData.createdAt || new Date().toISOString(),
});
```

---

## 🔐 Authentification

### Comment ça fonctionne

1. **Lors du Login/Signup** (AuthContext):
   ```typescript
   // Token stocké dans AsyncStorage
   await AsyncStorage.setItem("auth_token", token);
   await AsyncStorage.setItem("user_data", JSON.stringify(frontendUser));
   ```

2. **Intercepteur API** (services/api.ts):
   ```typescript
   // Ajoute automatiquement le token à chaque requête
   const token = await AsyncStorage.getItem('auth_token');
   if (token) {
     config.headers.Authorization = `Bearer ${token}`;
   }
   ```

3. **Page Profil** (profile.tsx):
   ```typescript
   // Appelle /api/auth/me avec le token automatiquement
   const response = await api.get('/api/auth/me');
   ```

4. **Backend** (auth_controller.ts):
   ```typescript
   // Récupère l'utilisateur depuis le token
   async me({ auth, response }: HttpContext) {
     const user = auth.getUserOrFail();
     return response.json({ success: true, data: { user } });
   }
   ```

---

## ✅ Statut

- **Récupération utilisateur** : ✅ Fonctionne
- **Token automatique** : ✅ Via intercepteur
- **Mapping des données** : ✅ Correct
- **Type corrigé** : ✅ id: string
- **Protection route** : ✅ Middleware auth()
- **Gestion erreur 401** : ✅ Redirection vers login

---

## 📝 TODO - Améliorations

1. **Utiliser AuthContext** au lieu d'appeler l'API directement
   ```typescript
   // Au lieu de:
   const response = await api.get('/api/auth/me');
   
   // Utiliser:
   const { user } = useAuth();
   ```

2. **Ajouter les endpoints d'assurance**
   - `/api/insurance/policy` → Numéro de police
   - `/api/insurance/status` → Statut actif/inactif
   - `/api/insurance/validity` → Date d'expiration

3. **Synchroniser avec AuthContext**
   - Éviter double appel API
   - Utiliser les données déjà en mémoire

