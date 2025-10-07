# Corrections - Communication Frontend/Backend

## Problème identifié

Le frontend n'arrivait pas à communiquer avec le backend lors de l'inscription des utilisateurs.

## Causes principales

### 1. Blocage des connexions HTTP par Android
**Erreur**: `[AxiosError: Network Error]`

Depuis Android 9, les connexions HTTP (non sécurisées) sont bloquées par défaut. Seules les connexions HTTPS sont autorisées, sauf configuration explicite.

### 2. Incohérence du format de date
Le backend attendait le format `DD-MM-YYYY` (exemple: `15-08-1990`) mais le frontend envoyait le format `YYYY-MM-DD` (exemple: `1990-08-15`).

## Corrections appliquées

### 1. Autorisation du trafic HTTP sur Android/iOS - `mykover/app.json`

**Android - Ajout de `usesCleartextTraffic`:**
```json
"android": {
  ...
  "usesCleartextTraffic": true
}
```

**iOS - Configuration NSAppTransportSecurity:**
```json
"ios": {
  ...
  "infoPlist": {
    "NSAppTransportSecurity": {
      "NSAllowsArbitraryLoads": true,
      "NSExceptionDomains": {
        "localhost": {
          "NSExceptionAllowsInsecureHTTPLoads": true
        },
        "192.168.1.189": {
          "NSExceptionAllowsInsecureHTTPLoads": true
        }
      }
    }
  }
}
```

⚠️ **IMPORTANT**: Ces paramètres ne doivent être utilisés qu'en développement. En production, utilisez HTTPS !

### 2. Format de date dans `mykover/app/signup.tsx`

**Avant :**
```typescript
const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
return { isValid: true, isoDate };
```

**Après :**
```typescript
const backendDate = `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
return { isValid: true, backendDate };
```

### 2. Amélioration des logs dans `AuthContext.tsx`

Ajout de logs détaillés pour faciliter le débogage :
- Logs des données envoyées
- Logs de la réponse reçue
- Logs détaillés des erreurs (message, statut, données de réponse)

### 3. Amélioration des messages d'erreur

Messages d'erreur plus précis pour l'utilisateur :
- Indication claire en cas de numéro/email déjà utilisé
- Message explicite en cas d'erreur de connexion
- Affichage du message d'erreur du serveur quand disponible

## Vérifications effectuées

✅ Backend accessible sur `http://192.168.1.189:3333` (testé avec curl)  
✅ Configuration CORS correcte (`origin: true`)  
✅ Routes API correctement configurées (`/api/auth/signup`)  
✅ Format de date maintenant cohérent entre frontend et backend  
✅ Pas d'erreurs de linting

## Configuration réseau

- **Backend** : Écoute sur `0.0.0.0:3333` (accessible depuis le réseau local)
- **Frontend** : Se connecte à `http://192.168.1.189:3333`
- **IP de la machine** : `192.168.1.189` ✅

## Format attendu par le backend

```typescript
{
  fullname: string;     // Au moins 3 caractères
  phone: string;        // Format: +243[89]XXXXXXXX (10 chiffres après +243)
  email: string;        // Email valide et unique
  birth_date: string;   // Format: DD-MM-YYYY (ex: 15-08-1990)
  password: string;     // Au moins 6 caractères
}
```

## ⚠️ REDÉMARRAGE OBLIGATOIRE

Les modifications dans `app.json` nécessitent un **REDÉMARRAGE COMPLET** de l'application Expo :

### Sur le terminal Metro (frontend):
```bash
# Appuyez sur 'r' pour recharger OU
# Ctrl+C pour arrêter, puis npm start pour redémarrer
```

### Sur votre appareil Android/iOS:
1. Fermez complètement l'application Expo Go
2. Relancez l'application Expo Go
3. Scannez à nouveau le QR code

## Test recommandé

Pour tester l'inscription :
1. Assurez-vous que le backend est démarré (`npm run dev` dans `/backend`)
2. **REDÉMARREZ** le frontend (voir ci-dessus)
3. Remplissez le formulaire d'inscription avec :
   - Nom complet : au moins 2 mots (ex: "Jean Baptiste")
   - Téléphone : +243 suivi de 8 ou 9, puis 8 chiffres (ex: +243812345678)
   - Email : email valide (ex: test@example.com)
   - Date de naissance : format JJ/MM/AAAA (ex: 15/08/1990)
   - Mot de passe : au moins 6 caractères

## Prochaines étapes

Si le problème persiste :
1. Vérifier les logs dans le terminal du backend
2. Vérifier les logs dans le terminal du frontend (Metro bundler)
3. Vérifier que la base de données PostgreSQL est démarrée
4. Vérifier que les migrations ont été exécutées

