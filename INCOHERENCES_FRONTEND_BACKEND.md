# Incohérences Frontend ↔️ Backend

## 🔴 ERREURS CRITIQUES À CORRIGER

### 1. **Route d'inscription incorrecte**
- **Frontend** (`services/api.ts` ligne 70): `/api/auth/register`
- **Backend** (`start/routes.ts`): `/api/auth/signup`
- ❌ **Ne fonctionnera pas**

### 2. **Format de login incorrect**
- **Frontend** (`services/api.ts` ligne 76): Envoie `identifier` et `password`
- **Backend** (`validators/auth.ts`): Attend `phone` et `password`
- ❌ **Ne fonctionnera pas**

### 3. **Route forgot password incorrecte**
- **Frontend** (`services/api.ts` ligne 85): `/api/auth/forgot`
- **Backend** (`start/routes.ts`): `/api/auth/forgot-password`
- ❌ **Ne fonctionnera pas**

### 4. **Route reset password manquante**
- **Frontend** (`services/api.ts` ligne 91): `/api/auth/reset`
- **Backend**: Cette route n'existe PAS
- ❌ **Ne fonctionnera pas**

### 5. **Format de date incorrect**
- **Frontend** (`AuthContext.tsx` ligne 38): Commentaire dit `YYYY-MM-DD`
- **Backend** (`validators/auth.ts`): Attend `DD-MM-YYYY`
- ❌ **Validation échouera**

## 📋 CORRECTIONS À APPLIQUER

### Frontend `services/api.ts`
```typescript
// LIGNE 70 - Changer
register: async (data) => {
  const response = await api.post('/api/auth/signup', data); // ✅ CORRIGER ICI
  return response.data;
},

// LIGNE 75-80 - Changer
login: async (phone: string, password: string) => { // ✅ CORRIGER ICI
  const response = await api.post('/api/auth/login', {
    phone, // ✅ CORRIGER ICI
    password,
  });
  return response.data;
},

// LIGNE 84-86 - Changer
forgotPassword: async (email: string) => { // ✅ CORRIGER ICI
  const response = await api.post('/api/auth/forgot-password', { email }); // ✅ CORRIGER ICI
  return response.data;
},

// LIGNE 90-96 - SUPPRIMER (route n'existe pas)
// resetPassword n'existe pas côté backend
```

### Frontend `AuthContext.tsx`
```typescript
// LIGNE 38 - Corriger le commentaire
birth_date: string; // Correspond au backend: birth_date (DD-MM-YYYY) ✅

// LIGNE 96 - Corriger la signature de login
login: (phone: string, password: string) => Promise<boolean>; // ✅
```

## ✅ CE QUI FONCTIONNE CORRECTEMENT

- Header Authorization avec Bearer token ✅
- Stockage du token dans AsyncStorage ✅
- Intercepteur pour ajouter le token ✅
- Routes `/logout` et `/me` ✅
- Transformation des données user ✅

