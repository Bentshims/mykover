# ✅ Checklist de test - Souscription + Paiement

## 🎯 Prérequis
- [ ] Backend lancé : `cd backend && npm run dev`
- [ ] Frontend lancé : `cd mykover && npx expo start`
- [ ] Base de données connectée
- [ ] Cloudinary configuré (cloud_name + preset)
- [ ] Variables CinetPay dans `.env`

---

## 🧪 Tests Backend

### 1. Tester la création d'une famille
**Requête :** `POST http://localhost:3333/api/families`

**Headers :**
```
Authorization: Bearer <votre_token_jwt>
Content-Type: application/json
```

**Body :**
```json
{
  "planType": "libota",
  "members": [
    {
      "firstName": "Jean",
      "lastName": "Dupont",
      "birthDate": "1990-05-15",
      "isSick": false,
      "photoUrl": "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    },
    {
      "firstName": "Marie",
      "lastName": "Dupont",
      "birthDate": "1992-08-20",
      "isSick": false,
      "photoUrl": "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    }
  ]
}
```

**Résultat attendu :**
```json
{
  "success": true,
  "message": "Famille créée avec succès",
  "data": {
    "family": {
      "id": "uuid",
      "code": "LIB-2025-123456",
      "planType": "libota",
      "paymentStatus": "pending"
    },
    "members": [...]
  }
}
```

- [ ] ✅ Code famille généré (format `LIB-YYYY-XXXXXX`)
- [ ] ✅ Statut paiement = `pending`
- [ ] ✅ Membres créés avec photos

---

### 2. Tester l'initiation de paiement
**Requête :** `POST http://localhost:3333/api/payments/initiate`

**Headers :**
```
Authorization: Bearer <votre_token_jwt>
Content-Type: application/json
```

**Body :**
```json
{
  "familyId": "uuid-de-la-famille-créée"
}
```

**Résultat attendu :**
```json
{
  "success": true,
  "message": "Paiement initié avec succès",
  "data": {
    "transactionId": "MYK-1234567890-abcd1234",
    "paymentUrl": "https://secure.cinetpay.com/...",
    "amount": 30,
    "currency": "USD"
  }
}
```

- [ ] ✅ URL de paiement CinetPay retournée
- [ ] ✅ Transaction créée en base (status `pending`)
- [ ] ✅ Montant correct selon le plan

---

### 3. Tester la vérification de paiement (polling)
**Requête :** `POST http://localhost:3333/api/payments/verify`

**Headers :**
```
Authorization: Bearer <votre_token_jwt>
Content-Type: application/json
```

**Body :**
```json
{
  "transaction_id": "MYK-1234567890-abcd1234"
}
```

**Résultat attendu (avant paiement) :**
```json
{
  "success": true,
  "data": {
    "status": "pending",
    "transactionId": "MYK-1234567890-abcd1234",
    "familyCode": "LIB-2025-123456"
  }
}
```

- [ ] ✅ Statut correct retourné
- [ ] ✅ Code famille inclus

---

### 4. Tester le callback webhook (simulé)
**Requête :** `POST http://localhost:3333/api/payments/callback`

**Headers :**
```
Content-Type: application/json
```

**Body (simulation CinetPay) :**
```json
{
  "cpm_site_id": "105904757",
  "cpm_trans_id": "MYK-1234567890-abcd1234",
  "cpm_amount": "30",
  "cpm_currency": "USD",
  "cpm_result": "00",
  "signature": "calculer-selon-doc-cinetpay"
}
```

**Résultat attendu :**
```json
{
  "message": "Callback traité"
}
```

- [ ] ✅ Paiement mis à jour (`status` = `success`)
- [ ] ✅ Famille mise à jour (`paymentStatus` = `paid`)

---

### 5. Tester la récupération d'une famille par code
**Requête :** `GET http://localhost:3333/api/families/LIB-2025-123456`

**Headers :**
```
Authorization: Bearer <votre_token_jwt>
```

**Résultat attendu :**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "code": "LIB-2025-123456",
    "planType": "libota",
    "paymentStatus": "paid",
    "members": [
      {
        "firstName": "Jean",
        "lastName": "Dupont",
        "birthDate": "1990-05-15",
        "isSick": false,
        "photoUrl": "https://..."
      }
    ]
  }
}
```

- [ ] ✅ Famille + membres retournés
- [ ] ✅ Photos incluses

---

### 6. Tester le cron de nettoyage
**Commande :**
```bash
cd backend
node ace cleanup:expired-families
```

**Résultat attendu :**
```
🧹 Démarrage du nettoyage des familles expirées...
✅ X famille(s) supprimée(s)
```

- [ ] ✅ Familles avec `paymentStatus=failed` supprimées
- [ ] ✅ Familles créées il y a >1 an supprimées

---

## 📱 Tests Frontend

### 1. Choix du plan
- [ ] ✅ 3 onglets visibles (Basique, Libota, Libota+)
- [ ] ✅ Prix corrects affichés (15$, 30$, 50$)
- [ ] ✅ Bouton "Souscrire" cliquable

---

### 2. Ajout de membre
- [ ] ✅ Drawer s'ouvre au clic sur "Souscrire"
- [ ] ✅ Titre affiche "Membre 1", "Membre 2", etc.
- [ ] ✅ Bouton "Caméra" ouvre la caméra
- [ ] ✅ Bouton "Galerie" ouvre la galerie
- [ ] ✅ Photo affichée après sélection
- [ ] ✅ Upload Cloudinary fonctionne (loader + message succès)
- [ ] ✅ Champs prénom, nom, date de naissance remplis
- [ ] ✅ Toggle "Problème de santé" fonctionne
- [ ] ✅ Bouton "Valider" ajoute le membre

---

### 3. Validation multiple membres
**Pour plan Libota (2-3 membres) :**
- [ ] ✅ Après 1er membre : Alert "Ajouter un autre membre ?"
- [ ] ✅ Si "Ajouter" : drawer se rouvre pour membre 2
- [ ] ✅ Si "Terminer" : soumission famille

**Pour plan Libota+ (2-5 membres) :**
- [ ] ✅ Idem, jusqu'à 5 membres max
- [ ] ✅ Soumission automatique si max atteint

**Pour plan Basique (1 membre) :**
- [ ] ✅ Soumission automatique après 1 membre

---

### 4. Souscription et paiement
- [ ] ✅ Loader pendant création famille
- [ ] ✅ Loader pendant initiation paiement
- [ ] ✅ Redirection vers CinetPay (browser externe)
- [ ] ✅ Navigation vers écran "Vérification paiement"

---

### 5. Écran de vérification (polling)
- [ ] ✅ Loader affiché
- [ ] ✅ Texte "Vérification du paiement..."
- [ ] ✅ Plan et montant affichés
- [ ] ✅ Polling toutes les 5s (vérifier console logs)
- [ ] ✅ Bouton "Revenir plus tard" fonctionne

---

### 6. Écran de succès
**Après paiement réussi :**
- [ ] ✅ Icône verte + "Paiement réussi !"
- [ ] ✅ Code famille affiché (ex: `LIB-2025-123456`)
- [ ] ✅ Bouton "Retour à l'accueil" redirige vers home

---

### 7. Écran d'échec
**Après paiement échoué :**
- [ ] ✅ Icône rouge + "Paiement échoué"
- [ ] ✅ Bouton "Réessayer" fonctionne
- [ ] ✅ Nouveau paiement initié
- [ ] ✅ Bouton "Annuler" redirige vers home

---

## 🔍 Tests d'erreur

### Backend
- [ ] Créer famille sans token → `401 Unauthorized`
- [ ] Créer famille avec 0 membre → `400 Bad Request`
- [ ] Plan Basique avec 2 membres → `400 Bad Request` (max 1)
- [ ] Plan Libota avec 1 membre → `400 Bad Request` (min 2)
- [ ] Initier paiement pour famille déjà payée → `400 Bad Request`

### Frontend
- [ ] Valider membre sans photo → Alert "Veuillez ajouter une photo"
- [ ] Valider membre sans prénom/nom → Alert "Veuillez remplir tous les champs"
- [ ] Upload Cloudinary échoué → Alert "Échec upload"

---

## 📊 Résumé

**Backend :**
- [ ] Migrations OK
- [ ] Modèles OK
- [ ] Service CinetPay OK
- [ ] Controllers OK
- [ ] Routes OK
- [ ] Cron OK

**Frontend :**
- [ ] Service Cloudinary OK
- [ ] Service Family OK
- [ ] Drawer membre OK
- [ ] Écran plans OK
- [ ] Écran vérification OK
- [ ] Écrans succès/échec OK

---

**✅ Si tous les tests passent → Implémentation validée !** 🎉

