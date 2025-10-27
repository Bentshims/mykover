# Configuration API - MyKover App

## 📱 Configuration pour Développement Local

### 1. Vérifier votre IP locale

```bash
# Sur Linux/Mac
hostname -I | awk '{print $1}'

# Sur Windows (PowerShell)
(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias Wi-Fi).IPAddress
```

**IP actuelle configurée : `192.168.1.189`**

### 2. Démarrer le backend

```bash
cd backend
npm run dev
# Le backend devrait démarrer sur http://0.0.0.0:3333
```

### 3. Tester la connexion

```bash
# Depuis votre machine
curl http://localhost:3333/api/health

# Depuis votre téléphone (même WiFi)
curl http://192.168.1.189:3333/api/health
```

### 4. Configuration selon l'appareil

#### 📲 Appareil physique (Android/iOS)
- ✅ **Déjà configuré** : Utilise `http://192.168.1.189:3333`
- Assurez-vous que votre téléphone et PC sont sur le **même réseau WiFi**
- Si votre IP change, mettez à jour dans :
  - `mykover/services/api.ts` → `LOCAL_BACKEND_IP`
  - `mykover/app.json` → `extra.apiUrl`

#### 🖥️ Émulateur Android
- Décommentez dans `mykover/services/api.ts` ligne 45 :
  ```typescript
  devUrl = `http://10.0.2.2:${LOCAL_BACKEND_PORT}`;
  ```
- `10.0.2.2` est l'alias pour `localhost` de la machine hôte

#### 📱 iOS Simulator
- ✅ **Déjà configuré** : Utilise l'IP WiFi
- Peut aussi utiliser `localhost` directement

---

## 🚀 Déploiement sur Railway (Production)

### 1. Déployer le backend sur Railway

```bash
cd backend
railway login
railway init
railway up
```

### 2. Récupérer l'URL Railway

Après déploiement, Railway vous donnera une URL comme :
```
https://mykover-production.up.railway.app
```

### 3. Mettre à jour app.json

```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://mykover-production.up.railway.app"
    }
  }
}
```

### 4. Rebuilder l'APK

```bash
cd mykover
eas build --platform android --profile preview
```

---

## 🔍 Debug & Troubleshooting

### Problème : "Erreur réseau - Pas de réponse du serveur"

**Solutions :**

1. **Vérifier que le backend est démarré**
   ```bash
   cd backend
   npm run dev
   ```

2. **Vérifier que le backend écoute sur 0.0.0.0 (pas 127.0.0.1)**
   
   Dans `backend/.env` ou configuration :
   ```env
   HOST=0.0.0.0
   PORT=3333
   ```

3. **Vérifier le firewall**
   ```bash
   # Linux - Autoriser le port 3333
   sudo ufw allow 3333
   
   # Windows - Ajouter une règle dans Windows Firewall
   ```

4. **Vérifier que téléphone et PC sont sur le même WiFi**
   ```bash
   # Ping depuis votre téléphone vers votre PC
   ping 192.168.1.189
   ```

5. **Vérifier l'IP actuelle**
   Si votre IP a changé, mettez à jour `LOCAL_BACKEND_IP` dans `api.ts`

### Logs de debug

L'application affiche des logs détaillés dans la console :

```
═══════════════════════════════════════════════════
🚀 [API] Configuration API Client
═══════════════════════════════════════════════════
📍 Base URL: http://192.168.1.189:3333
⏱️  Timeout: 30000 ms
🏗️  Environment: DEVELOPMENT
📱 Platform: android
═══════════════════════════════════════════════════
```

Pour chaque requête :
- `➡️` Requête envoyée
- `✅` Succès
- `❌` Erreur avec détails

---

## 📝 Checklist avant le build de production

- [ ] Backend déployé sur Railway
- [ ] URL Railway configurée dans `app.json`
- [ ] Test de connexion avec l'URL Railway
- [ ] Variables d'environnement configurées sur Railway
- [ ] Base de données configurée et migrée
- [ ] CORS configuré pour accepter le domaine Railway
- [ ] Build APK avec le profil `production`

---

## 🔐 Variables d'environnement (Backend)

Assurez-vous que ces variables sont configurées :

### Local (.env)
```env
HOST=0.0.0.0
PORT=3333
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_DATABASE=mykover

# JWT
APP_KEY=your-secret-key

# Services (CinetPay, SMS, etc.)
CINETPAY_API_KEY=your-key
CINETPAY_SITE_ID=your-site-id
# ... autres clés
```

### Railway (Production)
Configurez les mêmes variables via l'interface Railway.

---

## 📞 Contact & Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans la console Expo
2. Vérifiez les logs du backend
3. Testez avec `curl` ou Postman
4. Vérifiez la configuration réseau (firewall, WiFi)

Bonne chance ! 🚀

les caractere saisis dans le champ mot de passe sont invisible  sur l'apk  regle ca , je veux aussi que tu ajout le bouton pour toggle la mot de passe (eye et eye-slash), regarde aussi l'erreur lors de l'inscription ou la connexion . apres que tu ai tout arranger, build l'apk a nouveaux

