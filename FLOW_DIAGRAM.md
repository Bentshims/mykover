# 🎯 Schéma du Flow Complet - Souscription Mykover

## 📱 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                        UTILISATEUR                               │
│                     (App Mobile Expo)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1. Choix du plan
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ÉCRAN PLANS (TabView)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ Basique  │  │  Libota  │  │ Libota+  │                      │
│  │   15$    │  │   30$    │  │   50$    │                      │
│  │ 1 membre │  │ 2-3 mbrs │  │ 2-5 mbrs │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
│         [Bouton Souscrire]                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 2. Clic Souscrire
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              DRAWER AJOUT MEMBRE (Modal Bas)                     │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  Membre 1                                      [X]  │        │
│  │  ┌──────────┐  ┌──────────┐                        │        │
│  │  │  Caméra  │  │ Galerie  │  ← Choix photo         │        │
│  │  └──────────┘  └──────────┘                        │        │
│  │  ┌──────────────────────────────────────┐          │        │
│  │  │ Prénom: ________________             │          │        │
│  │  │ Nom:    ________________             │          │        │
│  │  │ Date:   [Calendar Picker]            │          │        │
│  │  │ Malade: [Non] [Oui]                  │          │        │
│  │  └──────────────────────────────────────┘          │        │
│  │            [Bouton Valider]                         │        │
│  └─────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 3. Upload photo
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CLOUDINARY                                 │
│  • Upload unsigned (FormData)                                    │
│  • Retourne: secure_url + public_id                              │
│  • Folder: mykover/members                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 4. Validation membre
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  LOGIQUE AJOUT MEMBRES                           │
│  • Si plan Basique (max 1) → Soumission auto                    │
│  • Si Libota/+ et < max → Alert "Ajouter un autre ?"            │
│    - [Ajouter] → Rouvrir drawer                                 │
│    - [Terminer] → Soumission finale                             │
│  • Si max atteint → Soumission auto                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 5. Soumission finale
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (AdonisJS)                             │
│  POST /api/families                                              │
│  ┌───────────────────────────────────────────────────┐          │
│  │  1. Validation nombre membres vs plan             │          │
│  │  2. Génération code unique (LIB-2025-XXXXXX)      │          │
│  │  3. Transaction DB:                                │          │
│  │     - INSERT families (code, plan, status=pending)│          │
│  │     - INSERT family_members (x N)                 │          │
│  │  4. Return { familyId, code }                     │          │
│  └───────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 6. Initiation paiement
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (AdonisJS)                             │
│  POST /api/payments/initiate                                     │
│  ┌───────────────────────────────────────────────────┐          │
│  │  1. Calcul montant selon plan                     │          │
│  │  2. Génération transaction_id unique              │          │
│  │  3. INSERT payment (status=pending)               │          │
│  │  4. Appel API CinetPay:                           │          │
│  │     - site_id, api_key, amount, etc.              │          │
│  │  5. Return { paymentUrl, transactionId }          │          │
│  └───────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 7. Redirection paiement
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CINETPAY                                   │
│  • Page paiement Mobile Money / Carte                            │
│  • Utilisateur paie                                              │
│  • Callback webhook → Backend                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├─────────────────┐
                              │                 │
                  8a. Callback│     8b. Polling │
                              ▼                 ▼
┌──────────────────────────────────┐  ┌──────────────────────────┐
│   BACKEND - Webhook Callback     │  │  FRONTEND - Polling      │
│  POST /api/payments/callback     │  │  POST /api/payments/     │
│  ┌────────────────────────────┐  │  │       verify             │
│  │ 1. Vérif signature SHA256  │  │  │  ┌────────────────────┐  │
│  │ 2. UPDATE payment.status   │  │  │  │ Toutes les 5s      │  │
│  │ 3. UPDATE family.status    │  │  │  │ Max 60 fois (5min) │  │
│  └────────────────────────────┘  │  │  │ Return status      │  │
└──────────────────────────────────┘  │  └────────────────────┘  │
                                      └──────────────────────────┘
                              │
                              │ 9. Résultat paiement
                              ▼
        ┌─────────────────────┴─────────────────────┐
        │                                            │
   SUCCESS                                       FAILED
        │                                            │
        ▼                                            ▼
┌──────────────────────┐                  ┌──────────────────────┐
│   ÉCRAN SUCCÈS       │                  │   ÉCRAN ÉCHEC        │
│  ┌────────────────┐  │                  │  ┌────────────────┐  │
│  │ ✅ Icône verte │  │                  │  │ ❌ Icône rouge │  │
│  │ "Paiement OK!" │  │                  │  │ "Échec"        │  │
│  │                │  │                  │  │                │  │
│  │ Code famille:  │  │                  │  │ [Réessayer]    │  │
│  │ LIB-2025-12345 │  │                  │  │ [Annuler]      │  │
│  │                │  │                  │  └────────────────┘  │
│  │ [Retour home]  │  │                  └──────────────────────┘
│  └────────────────┘  │                           │
└──────────────────────┘                           │
                                          10. Retry → Retour étape 6
```

---

## 🔄 Flow Données

### **Création Famille**
```
Frontend                    Backend                     Database
   │                          │                            │
   │ POST /api/families       │                            │
   │─────────────────────────>│                            │
   │  {                       │                            │
   │    planType: "libota",   │ Validation                 │
   │    members: [...]        │    │                       │
   │  }                       │    ▼                       │
   │                          │ Generate code              │
   │                          │ LIB-2025-483920            │
   │                          │    │                       │
   │                          │    ▼                       │
   │                          │ BEGIN TRANSACTION          │
   │                          │────────────────────────────>│
   │                          │ INSERT families            │
   │                          │ INSERT family_members (x2) │
   │                          │ COMMIT                     │
   │                          │<────────────────────────────│
   │                          │    │                       │
   │<─────────────────────────│    ▼                       │
   │  {                       │ Return                     │
   │    familyId: "uuid",     │                            │
   │    code: "LIB-2025-..."  │                            │
   │  }                       │                            │
```

### **Initiation Paiement**
```
Frontend                Backend                CinetPay              Database
   │                      │                       │                     │
   │ POST /initiate       │                       │                     │
   │─────────────────────>│                       │                     │
   │  { familyId }        │ Calcul montant        │                     │
   │                      │ (30$ pour libota)     │                     │
   │                      │      │                │                     │
   │                      │      ▼                │                     │
   │                      │ INSERT payment        │                     │
   │                      │─────────────────────────────────────────────>│
   │                      │ (status: pending)     │                     │
   │                      │      │                │                     │
   │                      │      ▼                │                     │
   │                      │ POST /payment         │                     │
   │                      │──────────────────────>│                     │
   │                      │ { amount, site_id }   │                     │
   │                      │                       │ Création session    │
   │                      │                       │      │              │
   │                      │<──────────────────────│      ▼              │
   │                      │ { payment_url }       │ Return URL          │
   │<─────────────────────│                       │                     │
   │  { paymentUrl }      │                       │                     │
   │      │               │                       │                     │
   │      ▼               │                       │                     │
   │ Linking.openURL()    │                       │                     │
```

### **Vérification Polling**
```
Frontend                Backend                Database
   │                      │                       │
   │ Polling (5s)         │                       │
   │─────────────────────>│                       │
   │ POST /verify         │                       │
   │ { transaction_id }   │ SELECT payment        │
   │                      │ JOIN family           │
   │                      │──────────────────────>│
   │                      │<──────────────────────│
   │                      │ { status, code }      │
   │<─────────────────────│                       │
   │ { status: "success" }│                       │
   │      │               │                       │
   │      ▼               │                       │
   │ Stop polling         │                       │
   │ Show success screen  │                       │
```

---

## 🔐 Sécurité Callback

```
CinetPay                Backend
   │                      │
   │ POST /callback       │
   │─────────────────────>│
   │ {                    │
   │   cpm_trans_id,      │ 1. Validation signature
   │   cpm_amount,        │    │
   │   signature          │    ▼
   │ }                    │ SHA256(site_id + trans_id + amount + currency + secret)
   │                      │    │
   │                      │    ▼
   │                      │ Signature OK ?
   │                      │    │
   │                      │    ├─ OUI → Update DB
   │                      │    └─ NON → 400 Bad Request
   │<─────────────────────│
   │ 200 OK               │
```

---

## 🗑️ Suppression Automatique

```
Cron (tous les jours 00:00)
   │
   ▼
┌─────────────────────────────────────────┐
│  node ace cleanup:expired-families      │
│  ┌───────────────────────────────────┐  │
│  │ 1. SELECT families WHERE:         │  │
│  │    - payment_status = 'failed'    │  │
│  │    - created_at < 1 year ago      │  │
│  │                                   │  │
│  │ 2. DELETE families (CASCADE):     │  │
│  │    → family_members automatique   │  │
│  │    → payments automatique         │  │
│  │                                   │  │
│  │ 3. Log résultats                  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

**Schéma complet du flow de bout en bout !** 📊

