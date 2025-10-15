# 📋 Étapes de Déploiement Mykover

## 🎯 Résumé des corrections effectuées

### ✅ 1. Corrections Frontend (Mot de passe invisible)
- **Problème** : Texte invisible dans les champs mot de passe sur APK
- **Solution** : 
  - Ajout de `color: '#1F2937'` en style inline pour Android
  - Toggle eye/eye-slash déjà présent, amélioré le positionnement
  - Labels changés de `text-zinc-300` à `text-gray-700` (plus lisibles)
  - Hauteur uniforme `min-h-[56px]` pour tous les champs

### ✅ 2. Configuration Railway
- Création du guide complet `RAILWAY_DEPLOYMENT.md`
- Configuration dynamique de l'URL API selon l'environnement
- Variables d'environnement pour development/preview/production

---

## 🚀 Prochaines étapes (À faire maintenant)

### Étape 1 : Déployer sur Railway (20 min)

#### A. Créer la base de données PostgreSQL
```bash
1. Allez sur https://railway.app
2. Créez un compte (avec GitHub)
3. New Project > Provision PostgreSQL
4. Copiez l'URL de connexion (DATABASE_URL)
```

#### B. Déployer le Backend
```bash
# Depuis le terminal
cd /home/kadea-dev-3/Documents/mykoverApp/backend

# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Créer un projet
railway init

# Déployer
railway up

# Configurer les variables (dans Railway Dashboard)
# Copier les variables depuis: backend/.env.railway.example

# Lancer les migrations
railway run node ace migration:run --force
```

#### C. Récupérer l'URL du Backend
```bash
1. Allez dans Railway Dashboard
2. Cliquez sur votre service Backend
3. Settings > Domains
4. Copiez l'URL (ex: https://mykover-production-xxxx.up.railway.app)
```

---

### Étape 2 : Configurer le Frontend (5 min)

#### A. Mettre à jour `eas.json`
```bash
# Ouvrez: mykover/eas.json
# Remplacez RAILWAY_URL_HERE par votre vraie URL Railway

# Dans "preview" et "production":
"env": {
  "API_URL": "https://votre-url-railway.up.railway.app"
}
```

#### B. Mettre à jour `app.json` (optionnel)
```bash
# Ouvrez: mykover/app.json
# Changez apiUrl:

"extra": {
  "apiUrl": "https://votre-url-railway.up.railway.app",
  ...
}
```

---

### Étape 3 : Rebuild l'APK (10 min)

```bash
cd /home/kadea-dev-3/Documents/mykoverApp/mykover

# Rebuild avec les corrections
eas build --profile preview --platform android

# Attendez le build (5-10 min)
# Téléchargez l'APK depuis le lien fourni
```

---

### Étape 4 : Tester l'application (5 min)

#### A. Installer l'APK sur votre téléphone

#### B. Tests à effectuer
- [ ] Créer un compte (signup)
- [ ] Se connecter (login)
- [ ] Vérifier que le mot de passe est **VISIBLE** avec toggle eye/eye-slash
- [ ] Souscrire à un plan
- [ ] Ajouter un membre avec photo
- [ ] Initier un paiement CinetPay
- [ ] Vérifier le paiement

---

## 📝 Checklist complète

### Backend
- [ ] PostgreSQL déployé sur Railway
- [ ] Backend déployé sur Railway
- [ ] Variables d'environnement configurées (voir `.env.railway.example`)
- [ ] Migrations exécutées avec succès
- [ ] Endpoint `/api/health` fonctionne
- [ ] Test de signup/login via Postman ou curl

### Frontend
- [ ] `eas.json` mis à jour avec l'URL Railway
- [ ] `app.json` mis à jour avec l'URL Railway
- [ ] APK rebuild avec `eas build --profile preview`
- [ ] APK téléchargé et installé sur téléphone
- [ ] Champs mot de passe **visibles** avec toggle
- [ ] Connexion au backend Railway fonctionne

### Paiement
- [ ] CinetPay configuré avec les bonnes URLs
- [ ] `CINETPAY_NOTIFY_URL` = `https://votre-backend.railway.app/api/payments/callback`
- [ ] `CINETPAY_RETURN_URL` = `mykover://payment-verification`
- [ ] Test de paiement en mode réel

---

## 🔧 Commandes utiles

### Backend Local
```bash
cd backend
npm run dev
```

### Backend Railway
```bash
# Voir les logs
railway logs

# Redéployer
railway up

# Variables
railway variables
```

### Frontend
```bash
cd mykover

# Dev local
npx expo start

# Build APK
eas build --profile preview --platform android

# Build Production
eas build --profile production --platform android
```

---

## ❓ Troubleshooting

### Problème : Mot de passe invisible sur APK
✅ **CORRIGÉ** : Style `color: '#1F2937'` ajouté

### Problème : Pas de toggle eye/eye-slash
✅ **CORRIGÉ** : Toggle amélioré et bien positionné

### Problème : Backend inaccessible depuis APK
🔍 Vérifiez :
1. L'URL Railway est correcte dans `eas.json`
2. Le backend est bien déployé et actif
3. Testez l'URL dans un navigateur : `https://votre-url.railway.app/api/health`

### Problème : Build APK échoue
🔍 Vérifiez :
1. `compileSdk: 36` dans `app.json` ✅
2. `.expo/` dans `.gitignore` ✅
3. Relancez avec : `eas build --profile preview --platform android --clear-cache`

---

## 📞 Support

Si vous rencontrez des problèmes :

1. **Backend** : Consultez `RAILWAY_DEPLOYMENT.md`
2. **Frontend** : Vérifiez les logs Expo avec `npx expo start`
3. **Build** : Consultez les logs EAS : https://expo.dev/accounts/bentshims/projects/mykover/builds

---

🎉 **Bonne chance avec votre déploiement !**

