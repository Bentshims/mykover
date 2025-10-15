# 🚀 Guide de Déploiement sur Railway

## 📋 Table des matières
1. [Créer un compte Railway](#1-créer-un-compte-railway)
2. [Déployer PostgreSQL](#2-déployer-postgresql)
3. [Déployer le Backend AdonisJS](#3-déployer-le-backend-adonisjs)
4. [Configurer le Frontend](#4-configurer-le-frontend)
5. [Variables d'environnement](#5-variables-denvironnement)
6. [Tester le déploiement](#6-tester-le-déploiement)

---

## 1. Créer un compte Railway

1. Allez sur [railway.app](https://railway.app)
2. Cliquez sur **"Start a New Project"**
3. Connectez-vous avec GitHub
4. Acceptez les permissions

---

## 2. Déployer PostgreSQL

### Étape 1 : Créer un nouveau projet
```bash
1. Cliquez sur "New Project"
2. Sélectionnez "Provision PostgreSQL"
3. Railway créera automatiquement une base de données PostgreSQL
```

### Étape 2 : Récupérer l'URL de connexion
```bash
1. Cliquez sur votre service PostgreSQL
2. Allez dans l'onglet "Connect"
3. Copiez l'URL complète "Postgres Connection URL"
   
   Exemple: 
   postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

### Étape 3 : Configuration PostgreSQL
- **Version** : PostgreSQL 15+ (automatique)
- **Région** : Choisir US-West ou EU-West selon votre localisation
- **Stockage** : 1GB (gratuit) ou plus selon vos besoins

---

## 3. Déployer le Backend AdonisJS

### Étape 1 : Préparer le backend

Dans `/backend`, créez un fichier `Procfile` :

```bash
# /backend/Procfile
web: node bin/server.js
```

Créez aussi un fichier `.railwayignore` :

```bash
# /backend/.railwayignore
node_modules/
.env
.env.local
*.log
.DS_Store
tmp/
build/
```

### Étape 2 : Mettre à jour `package.json`

Ajoutez ces scripts dans `/backend/package.json` :

```json
{
  "scripts": {
    "start": "node bin/server.js",
    "build": "node ace build",
    "postbuild": "cd build && npm ci --omit=dev",
    "railway:migrate": "node ace migration:run --force"
  }
}
```

### Étape 3 : Déployer sur Railway

```bash
# Depuis le dossier /backend

# 1. Installer Railway CLI
npm install -g @railway/cli

# 2. Se connecter à Railway
railway login

# 3. Créer un nouveau service
railway init

# 4. Déployer le backend
railway up

# 5. Lancer les migrations
railway run node ace migration:run --force
```

### Étape 4 : Configuration du service Backend

Dans Railway Dashboard :
1. Allez dans votre service Backend
2. Cliquez sur **"Settings"**
3. Configurez :
   - **Root Directory** : `/backend` (si monorepo) ou `/` si backend seul
   - **Build Command** : `npm run build`
   - **Start Command** : `npm start`
   - **Port** : `3333` (AdonisJS default)

---

## 4. Configurer le Frontend

### Étape 1 : Récupérer l'URL Railway du Backend

```bash
1. Allez dans Railway Dashboard
2. Cliquez sur votre service Backend
3. Allez dans l'onglet "Settings"
4. Copiez l'URL sous "Domains"
   
   Exemple: https://mykover-backend-production.up.railway.app
```

### Étape 2 : Mettre à jour `app.json`

Modifiez `/mykover/app.json` :

```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://mykover-backend-production.up.railway.app",
      "eas": {
        "projectId": "3ad74675-cb66-4b94-bf98-0e1f79613997"
      }
    }
  }
}
```

### Étape 3 : Mettre à jour `eas.json`

Modifiez `/mykover/eas.json` :

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "API_URL": "http://192.168.1.189:3333"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "API_URL": "https://mykover-backend-production.up.railway.app"
      }
    },
    "production": {
      "env": {
        "API_URL": "https://mykover-backend-production.up.railway.app"
      }
    }
  }
}
```

---

## 5. Variables d'environnement

### Backend Railway - Variables à configurer

Dans Railway Dashboard > Backend Service > Variables :

```bash
# Application
TZ=UTC
HOST=0.0.0.0
PORT=3333
NODE_ENV=production
APP_KEY=<générer avec: node ace generate:key>
APP_URL=https://mykover-backend-production.up.railway.app

# Database (copier depuis PostgreSQL service)
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway

# JWT
JWT_SECRET=<votre-secret-jwt-ultra-securise>

# CinetPay
CINETPAY_SITE_ID=105904757
CINETPAY_API_KEY=4852062706895b8dd8be270.28502736
CINETPAY_SECRET_KEY=8837573536895bb9ba75d17.75866775
CINETPAY_NOTIFY_URL=https://mykover-backend-production.up.railway.app/api/payments/callback
CINETPAY_RETURN_URL=mykover://payment-verification

# Cloudinary
CLOUDINARY_CLOUD_NAME=drsd8adkq
CLOUDINARY_API_KEY=<votre-api-key>
CLOUDINARY_API_SECRET=<votre-api-secret>
CLOUDINARY_UPLOAD_PRESET=mykover_unsigned
CLOUDINARY_FOLDER=mykover_subscription_images

# SMTP (pour les emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=<votre-email>
SMTP_PASSWORD=<votre-app-password>
```

### Lier la base de données au Backend

Dans Railway :
1. Cliquez sur votre service Backend
2. Cliquez sur **"Variables"**
3. Cliquez sur **"+ New Variable"** > **"Add Reference"**
4. Sélectionnez `DATABASE_URL` depuis le service PostgreSQL
5. Railway créera automatiquement la variable `DATABASE_URL`

---

## 6. Tester le déploiement

### Test Backend (API)

```bash
# Test de santé
curl https://mykover-backend-production.up.railway.app/api/health

# Test inscription
curl -X POST https://mykover-backend-production.up.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Test User",
    "email": "test@example.com",
    "phone": "+243812345678",
    "password": "test123",
    "birth_date": "1990-01-01"
  }'
```

### Test Frontend (APK)

1. **Rebuild l'APK** :
```bash
cd /home/kadea-dev-3/Documents/mykoverApp/mykover
eas build --profile preview --platform android
```

2. **Télécharger et installer l'APK**

3. **Tester la connexion** :
   - Créer un compte
   - Se connecter
   - Vérifier dans les logs Railway que les requêtes arrivent

---

## 🔧 Commandes utiles Railway

```bash
# Voir les logs en temps réel
railway logs

# Redéployer le backend
railway up

# Lancer les migrations
railway run node ace migration:run --force

# Ouvrir un shell dans le conteneur
railway shell

# Lister toutes les variables
railway variables

# Ajouter une variable
railway variables set KEY=value
```

---

## 📊 Monitoring

### Railway Dashboard
- **Logs** : Voir les logs en temps réel
- **Metrics** : CPU, RAM, Network
- **Deployments** : Historique des déploiements

### Santé du Backend
Créez une route `/api/health` dans votre backend :

```typescript
// backend/start/routes.ts
router.get('/api/health', async ({ response }) => {
  return response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  })
})
```

---

## 🚨 Troubleshooting

### Erreur : "Cannot connect to database"
✅ Vérifiez que `DATABASE_URL` est bien configurée
✅ Vérifiez que le service PostgreSQL est démarré

### Erreur : "Migrations failed"
```bash
# Réinitialiser la base de données
railway run node ace migration:rollback --force
railway run node ace migration:run --force
```

### Erreur : "Port already in use"
✅ Railway utilise automatiquement le `PORT` variable
✅ Assurez-vous que votre backend écoute sur `process.env.PORT`

### Frontend : "Network Error"
✅ Vérifiez l'URL dans `app.json`
✅ Vérifiez que le backend est déployé et actif
✅ Testez l'URL dans un navigateur

---

## 💰 Coûts

### Plan Gratuit (Trial)
- **500h/mois** de runtime
- **1GB** de RAM
- **1GB** de stockage PostgreSQL
- **$5** de crédit gratuit

### Plan Developer ($5/mois)
- **Runtime illimité**
- **8GB** de RAM
- **8GB** de stockage PostgreSQL

---

## ✅ Checklist de déploiement

- [ ] PostgreSQL déployé sur Railway
- [ ] `DATABASE_URL` copiée
- [ ] Backend déployé avec toutes les variables d'env
- [ ] Migrations exécutées avec succès
- [ ] URL Backend copiée
- [ ] `app.json` mis à jour avec l'URL Railway
- [ ] `eas.json` mis à jour pour preview/production
- [ ] APK rebuild avec `eas build --profile preview`
- [ ] Test d'inscription/connexion sur APK
- [ ] CinetPay testé en mode réel

---

🎉 **Félicitations !** Votre application Mykover est maintenant déployée sur Railway !

