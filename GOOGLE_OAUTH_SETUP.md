# Configuration Google OAuth pour MyKover

## Étapes de configuration

### 1. Google Cloud Console Setup

1. **Créer un projet Google Cloud**
   - Allez sur [Google Cloud Console](https://console.cloud.google.com/)
   - Créez un nouveau projet ou sélectionnez un projet existant
   - Notez l'ID du projet

2. **Activer l'API Google+**
   - Dans le menu de navigation, allez à "APIs & Services" > "Library"
   - Recherchez "Google+ API" et activez-la
   - Recherchez "Google OAuth2 API" et activez-la

3. **Configurer l'écran de consentement OAuth**
   - Allez à "APIs & Services" > "OAuth consent screen"
   - Choisissez "External" pour les utilisateurs externes
   - Remplissez les informations requises :
     - App name: MyKover
     - User support email: votre email
     - Developer contact information: votre email
   - Ajoutez les scopes : `email`, `profile`

4. **Créer les identifiants OAuth 2.0**
   - Allez à "APIs & Services" > "Credentials"
   - Cliquez sur "Create Credentials" > "OAuth 2.0 Client IDs"
   - Type d'application: "Web application"
   - Nom: MyKover Backend
   - Authorized redirect URIs:
     ```
     http://10.35.66.111:3333/api/auth/google/callback
     http://localhost:3333/api/auth/google/callback
     http://127.0.0.1:3333/api/auth/google/callback
     ```
   - Sauvegardez le Client ID et Client Secret

### 2. Configuration Backend (.env)

Ajoutez ces variables dans votre fichier `.env` du backend :

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://10.35.66.111:3333/api/auth/google/callback

# Server Configuration (IMPORTANT for mobile access)
HOST=0.0.0.0
PORT=3333
```

### 3. Configuration Frontend

Le frontend est déjà configuré pour utiliser l'OAuth flow via le navigateur système.

### 4. Test de l'intégration

1. **Démarrer le backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Démarrer le frontend**
   ```bash
   cd mykover
   npm start
   ```

3. **Tester l'authentification**
   - Ouvrez l'app sur votre appareil/émulateur
   - Cliquez sur "Continuer avec Google" sur l'écran de connexion ou d'inscription
   - Vous serez redirigé vers Google pour l'authentification
   - Après authentification, vous reviendrez dans l'app connecté

## Architecture du flow OAuth

```
1. User clicks "Google Auth" → Frontend opens browser
2. Browser → Backend /api/auth/google → Redirect to Google
3. User authenticates on Google → Google redirects to callback
4. Backend /api/auth/google/callback → Process auth + create user
5. Backend redirects → Frontend success page with token
6. Frontend saves token → User logged in
```

## Fonctionnalités implémentées

- ✅ Authentification Google complète
- ✅ Création automatique d'utilisateur si inexistant
- ✅ Liaison de compte Google à compte existant (par email)
- ✅ Gestion des tokens d'accès
- ✅ Interface utilisateur intégrée
- ✅ Gestion d'erreurs complète

## Sécurité

- Les tokens Google ne sont jamais stockés côté client
- Seuls les tokens d'accès de l'application sont utilisés
- Validation complète des données utilisateur
- Gestion des erreurs OAuth appropriée

## Dépannage

### Erreur "This site can't be reached" / "localhost refused to connect"
- **Cause**: Mobile devices ne peuvent pas accéder à `localhost`
- **Solution**: 
  1. Configurez `HOST=0.0.0.0` dans votre `.env`
  2. Utilisez votre IP réseau (`10.35.66.111`) au lieu de `localhost`
  3. Redémarrez le serveur backend
  4. Ajoutez l'IP réseau dans Google Cloud Console redirect URIs

### Erreur "redirect_uri_mismatch"
- Vérifiez que l'URI de redirection dans Google Cloud Console correspond exactement à `GOOGLE_REDIRECT_URI`
- Assurez-vous d'avoir ajouté l'IP réseau (`http://10.35.66.111:3333/api/auth/google/callback`)

### Erreur "invalid_client"
- Vérifiez que `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` sont corrects

### L'utilisateur n'est pas créé
- Vérifiez les logs backend pour voir les erreurs de base de données
- Assurez-vous que la table `users` a la colonne `google_id`

### Backend non accessible depuis mobile
- Vérifiez que `HOST=0.0.0.0` dans le fichier `.env`
- Vérifiez que le firewall autorise les connexions sur le port 3333
- Testez l'accès avec `http://10.35.66.111:3333` depuis le navigateur mobile
