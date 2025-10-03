# 🔍 Test de Connexion Frontend → Backend

## Problème: Network Error lors de l'inscription

### Cause
L'application mobile ne peut pas atteindre le backend à cause de l'URL `localhost`.

### Solution

#### 1️⃣ Pour Émulateur Android
- URL automatique: `http://10.0.2.2:3333` ✅
- Aucune configuration nécessaire
- Rechargez simplement l'app

#### 2️⃣ Pour Simulateur iOS
- URL automatique: `http://localhost:3333` ✅
- Aucune configuration nécessaire
- Rechargez simplement l'app

#### 3️⃣ Pour Appareil Physique
**Votre IP locale:** `192.168.0.59`

**Modifiez** `mykover/services/api.ts` ligne 9:
```typescript
const getBaseURL = () => {
  // DÉCOMMENTEZ CETTE LIGNE:
  return 'http://192.168.0.59:3333';
  
  // COMMENTEZ LE RESTE:
  // if (Platform.OS === 'android') {
  //   return 'http://10.0.2.2:3333';
  // } ...
};
```

### Test de Connexion

#### Depuis votre ordinateur (pour vérifier le backend):
```bash
curl http://localhost:3333/
# Devrait afficher: {"hello":"world"}
```

#### Depuis un autre terminal (pour vérifier l'accessibilité réseau):
```bash
curl http://192.168.0.59:3333/
# Devrait aussi afficher: {"hello":"world"}
```

### Firewall

Si vous utilisez un appareil physique et que ça ne marche toujours pas:

```bash
# Autorisez le port 3333 dans le firewall
sudo ufw allow 3333/tcp
# ou
sudo iptables -A INPUT -p tcp --dport 3333 -j ACCEPT
```

### Vérification dans l'app

Après avoir rechargé l'app, essayez de vous inscrire. 

**Si ça marche:**
✅ Vous verrez un message de succès

**Si ça échoue encore:**
❌ Vérifiez les logs dans le terminal Metro (Expo)
❌ Vérifiez que le backend tourne: `curl http://localhost:3333/`

### Astuce Rapide

**Pour voir quelle URL est utilisée**, ajoutez temporairement dans `api.ts`:
```typescript
const api = axios.create({
  baseURL: getBaseURL(),
  ...
});

console.log('🔗 Backend URL:', api.defaults.baseURL);
```

Regardez ensuite les logs dans Metro/Expo.

