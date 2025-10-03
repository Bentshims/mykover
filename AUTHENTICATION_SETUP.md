# 🔐 Configuration du Système d'Authentification MyKover

## ✅ Tâches Complétées

### 1. Backend (AdonisJS + PostgreSQL)
- ✅ Base de données PostgreSQL locale configurée (`mykover`)
- ✅ Migrations exécutées (users, access_tokens, otps)
- ✅ Fichier `.env` configuré avec les bonnes valeurs
- ✅ Serveur backend démarré sur `http://localhost:3333`
- ✅ API d'authentification complète :
  - POST `/api/auth/register` - Inscription
  - POST `/api/auth/login` - Connexion
  - POST `/api/auth/forgot` - Mot de passe oublié
  - POST `/api/auth/reset` - Réinitialisation
  - POST `/api/auth/logout` - Déconnexion
  - GET `/api/auth/me` - Utilisateur actuel
  - GET `/api/auth/google` - OAuth Google

### 2. Frontend (React Native + Expo)
- ✅ AuthContext connecté au backend réel (plus de mock data)
- ✅ Pages d'authentification mises à jour :
  - `signup.tsx` - Inscription en 3 étapes
  - `login.tsx` - Connexion avec téléphone/email
  - `forgot-password.tsx` - Réinitialisation par OTP
- ✅ Boutons Google OAuth ajoutés dans signup et login
- ✅ PhoneInput déjà présent dans forgot-password
- ✅ Protection de la page home et des routes (tabs)
- ✅ Composant ProtectedRoute implémenté

### 3. Supabase
- ✅ Toutes les références Supabase supprimées

## 🧪 Tests à Effectuer

### 1. Tester le Backend Directement

#### a) Inscription
```bash
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname":"Marie Dupont",
    "email":"marie@example.com",
    "phone":"+243891234567",
    "password":"password123",
    "birth_date":"1995-05-20"
  }'
```

#### b) Connexion
```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier":"+243891234567",
    "password":"password123"
  }'
```

#### c) Mot de passe oublié
```bash
curl -X POST http://localhost:3333/api/auth/forgot \
  -H "Content-Type: application/json" \
  -d '{
    "identifier":"+243891234567"
  }'
```

### 2. Tester le Frontend

#### Démarrer l'application
```bash
cd /home/kadea-dev-3/Documents/mykoverApp/mykover
npm start
```

#### Tests à effectuer:
1. **Inscription** :
   - Ouvrir la page signup
   - Remplir le formulaire en 3 étapes
   - Vérifier que l'inscription fonctionne
   - Vérifier la redirection vers home

2. **Connexion** :
   - Se déconnecter
   - Ouvrir la page login
   - Se connecter avec le téléphone et mot de passe
   - Vérifier la redirection vers home

3. **Protection des routes** :
   - Se déconnecter
   - Essayer d'accéder à /(tabs)/home
   - Vérifier la redirection vers login

4. **Mot de passe oublié** :
   - Cliquer sur "Mot de passe oublié"
   - Entrer le numéro de téléphone
   - Demander le code OTP
   - Note: Les emails/SMS ne seront pas envoyés car les services ne sont pas configurés

## ⚙️ Configuration Requise

### 1. Variables d'Environnement Backend
Fichier : `/home/kadea-dev-3/Documents/mykoverApp/backend/.env`

**Configuré** :
- ✅ Base de données PostgreSQL
- ✅ JWT secret
- ⚠️ Google OAuth (à configurer avec vos identifiants)
- ⚠️ SMTP Email (à configurer avec vos identifiants Gmail)
- ⚠️ SMS Provider (à configurer avec votre fournisseur SMS)

### 2. Pour Activer Google OAuth

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet
3. Activer l'API Google+
4. Créer des identifiants OAuth 2.0
5. Ajouter l'URI de redirection : `http://localhost:3333/api/auth/google/callback`
6. Copier le Client ID et Client Secret dans `.env`:
   ```env
   GOOGLE_CLIENT_ID=votre-client-id
   GOOGLE_CLIENT_SECRET=votre-client-secret
   ```

### 3. Pour Activer l'Envoi d'Emails

1. Activer l'authentification à deux facteurs sur votre compte Gmail
2. Générer un mot de passe d'application
3. Mettre à jour `.env`:
   ```env
   SMTP_USER=votre-email@gmail.com
   SMTP_PASSWORD=votre-mot-de-passe-application
   ```

### 4. Pour Activer l'Envoi de SMS

Configurer avec un fournisseur SMS (Twilio, Nexmo, etc.) :
```env
SMS_PROVIDER_API_KEY=votre-api-key
SMS_PROVIDER_API_SECRET=votre-api-secret
```

## 🚀 Commandes Utiles

### Backend
```bash
cd /home/kadea-dev-3/Documents/mykoverApp/backend

# Démarrer le serveur
npm run dev

# Exécuter les migrations
node ace migration:run

# Réinitialiser la base de données
node ace migration:rollback --batch=0
node ace migration:run

# Voir les routes
node ace list:routes
```

### Frontend
```bash
cd /home/kadea-dev-3/Documents/mykoverApp/mykover

# Démarrer l'application
npm start

# Démarrer sur Android
npm run android

# Démarrer sur iOS
npm run ios
```

## 📝 Notes Importantes

1. **Mot de passe** : Le minimum est de 8 caractères dans le backend, assurez-vous que le frontend respecte cela.

2. **Format du téléphone** : Doit être au format international `+243[89]XXXXXXXX` pour la RDC.

3. **Format de la date** : `YYYY-MM-DD` pour l'API backend.

4. **JWT Token** : Expire après 7 jours (configurable dans `.env`).

5. **OTP** : Expire après 10 minutes (configurable dans `.env`).

## 🐛 Dépannage

### Le backend ne démarre pas
```bash
# Vérifier que PostgreSQL est en cours d'exécution
sudo systemctl status postgresql

# Vérifier les logs
cd backend
npm run dev
```

### Les migrations échouent
```bash
# Vérifier la connexion PostgreSQL
psql -U postgres -d mykover -c "SELECT 1"

# Réinitialiser complètement
node ace migration:rollback --batch=0
node ace migration:run
```

### Le frontend ne se connecte pas au backend
1. Vérifier que le backend tourne sur `http://localhost:3333`
2. Vérifier l'URL dans `mykover/services/api.ts`
3. Si vous testez sur un appareil physique, remplacer `localhost` par l'IP de votre ordinateur

## 📚 Structure du Projet

```
mykoverApp/
├── backend/                  # Backend AdonisJS
│   ├── app/
│   │   ├── controllers/     # Contrôleurs (auth_controller.ts)
│   │   ├── models/          # Modèles (user.ts, otp.ts)
│   │   ├── services/        # Services métier
│   │   └── validators/      # Validation des données
│   ├── database/
│   │   └── migrations/      # Migrations SQL
│   └── .env                 # Configuration
│
└── mykover/                 # Frontend React Native
    ├── app/                 # Pages (signup, login, etc.)
    ├── components/          # Composants réutilisables
    ├── src/
    │   ├── contexts/        # AuthContext
    │   └── components/      # Input, PhoneInput, etc.
    └── services/            # API client
```

## ✨ Prochaines Étapes

1. **Tester toutes les fonctionnalités** dans l'application mobile
2. **Configurer Google OAuth** avec de vrais identifiants
3. **Configurer l'envoi d'emails** pour la réinitialisation de mot de passe
4. **Configurer l'envoi de SMS** pour les OTP
5. **Ajouter la vérification email/SMS** après l'inscription
6. **Améliorer la sécurité** (rate limiting, CSRF protection, etc.)

---

**Système d'authentification configuré et prêt à l'emploi! 🎉**

