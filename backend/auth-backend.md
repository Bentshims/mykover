# Système d'Authentification AdonisJS

Backend d'authentification complet avec JWT, Google OAuth2, et gestion OTP par email/SMS pour la République Démocratique du Congo.

## Fonctionnalités

- ✅ Inscription avec validation téléphone RDC (`+243[89]XXXXXXXX`)
- ✅ Connexion par email ou téléphone
- ✅ Authentification Google OAuth2
- ✅ Mot de passe oublié avec OTP par email et SMS
- ✅ Réinitialisation de mot de passe
- ✅ JWT sécurisé avec middleware
- ✅ Tests unitaires et d'intégration

## Stack Technique

- **Framework**: AdonisJS v6+
- **Base de données**: PostgreSQL
- **Authentification**: JWT + Google OAuth2
- **Validation**: VineJS
- **Tests**: Japa
- **TypeScript**: Strict mode

## Installation

1. **Cloner et installer**:
```bash
cd backend
npm install
```

2. **Configuration environnement**:
```bash
cp .env.example .env
# Modifier .env avec vos vraies valeurs
```

3. **Base de données**:
```bash
# Créer la base de données PostgreSQL
createdb mykover_auth

# Lancer les migrations
node ace migration:run
```

4. **Générer clé d'application**:
```bash
node ace generate:key
```

## Configuration

### Variables d'environnement requises

```env
# Application
NODE_ENV=development
PORT=3333
HOST=localhost
APP_KEY=your-32-character-app-key

# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_DATABASE=mykover_auth

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1h

# Google OAuth2
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3333/api/auth/google/callback

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# SMS Provider
SMS_PROVIDER_API_KEY=your-sms-api-key
SMS_PROVIDER_API_SECRET=your-sms-api-secret

# OTP
OTP_EXPIRES_MINUTES=10
```

## API Endpoints

### Authentification

| Méthode | Endpoint | Description | Authentifié |
|---------|----------|-------------|-------------|
| POST | `/api/auth/register` | Inscription utilisateur | Non |
| POST | `/api/auth/login` | Connexion | Non |
| GET | `/api/auth/google` | Redirection Google OAuth | Non |
| GET | `/api/auth/google/callback` | Callback Google | Non |
| POST | `/api/auth/forgot` | Demande reset mot de passe | Non |
| POST | `/api/auth/reset` | Reset mot de passe avec OTP | Non |
| POST | `/api/auth/logout` | Déconnexion | Oui |
| GET | `/api/auth/me` | Profil utilisateur | Oui |

### Exemples de requêtes

#### Inscription
```bash
curl -X POST http://localhost:3333/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "prenom": "Jean",
    "nom": "Dupont", 
    "telephone": "+2438123456789",
    "email": "jean@example.com",
    "date_naissance": "1990-01-15",
    "mot_de_passe": "motdepasse123"
  }'
```

#### Connexion
```bash
curl -X POST http://localhost:3333/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "identifiant": "jean@example.com",
    "mot_de_passe": "motdepasse123"
  }'
```

#### Accès route protégée
```bash
curl -X GET http://localhost:3333/api/auth/me \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Modèle de données

### Utilisateur
```typescript
{
  id: string (UUID)
  prenom: string
  nom: string  
  telephone: string (unique, format +243[89]XXXXXXXX)
  email: string (unique)
  date_naissance: Date
  mot_de_passe: string (haché)
  google_id?: string
  email_verifie: boolean
  created_at: DateTime
  updated_at: DateTime
}
```

### OTP
```typescript
{
  id: string (UUID)
  user_id: string
  otp_hash: string (code haché)
  canal: 'email' | 'sms'
  utilise: boolean
  expire_le: DateTime
  created_at: DateTime
}
```

## Validation téléphone RDC

Le système valide les numéros de téléphone au format RDC:
- **Regex**: `^\\+243[89][0-9]{8}$`
- **Format**: `+243` suivi de `8` ou `9`, puis 8 chiffres
- **Exemples valides**: 
  - `+2438123456789`
  - `+2439987654321`

## Sécurité

- Mots de passe hachés avec Scrypt
- JWT signés avec secret sécurisé
- OTP hachés en base de données
- Expiration OTP configurable (défaut: 10 min)
- Validation stricte des entrées
- Middleware d'authentification

## Développement

### Lancer le serveur
```bash
npm run dev
```

### Lancer les tests
```bash
npm test
```

### Linter et formatting
```bash
npm run lint
npm run format
```

### Migrations
```bash
# Créer migration
node ace make:migration nom_migration

# Lancer migrations
node ace migration:run

# Rollback
node ace migration:rollback
```

## Tests

Le projet inclut des tests complets:

- **Tests unitaires**: Services, validation, JWT
- **Tests d'intégration**: API endpoints
- **Mocks**: Providers email, SMS, Google

```bash
# Tous les tests
npm test

# Tests spécifiques
npm test -- --filter="Auth"
```

## Structure du projet

```
backend/
├── app/
│   ├── controllers/
│   │   └── auth_controller.ts
│   ├── middleware/
│   │   └── jwt_auth_middleware.ts
│   ├── models/
│   │   ├── user.ts
│   │   └── otp.ts
│   ├── services/
│   │   ├── auth_service.ts
│   │   ├── otp_service.ts
│   │   ├── mail_service.ts
│   │   ├── sms_service.ts
│   │   └── google_service.ts
│   └── validators/
│       ├── register_validator.ts
│       ├── login_validator.ts
│       └── reset_validator.ts
├── database/
│   └── migrations/
├── tests/
│   ├── functional/
│   └── unit/
├── start/
│   ├── routes.ts
│   └── env.ts
└── config/
```

## Déploiement

1. **Variables d'environnement production**:
   - Utiliser de vraies clés API (Google, SMS)
   - JWT_SECRET sécurisé (32+ caractères)
   - SMTP configuré
   - Base de données production

2. **Build et démarrage**:
```bash
npm run build
npm start
```

## Support

- AdonisJS v6+ documentation
- PostgreSQL 12+
- Node.js 18+

---

*Développé avec AdonisJS et TypeScript pour une authentification sécurisée.*

<!-- 
Ce que tu dois faire dans GitHub
Va dans ton dépôt GitHub → Settings → Secrets and variables → Actions → New repository secret.
Crée ces secrets avec les valeurs de ta base Supabase:
SUPABASE_DB_HOST: https://fptezogebviejlcbilkm.supabase.co
SUPABASE_DB_PORT: 5432
SUPABASE_DB_USER: postgres
SUPABASE_DB_PASSWORD: *T-dev-senior*
SUPABASE_DB_DATABASE: Mykover-app
APP_KEY: 0ph96qNbAagKeXXNg9TRIy__st83zfXW
JWT_SECRET: P2iIverXQ+q6YOV0BTrhg7nINnlZuOj1bKD73YCBurH8AAQhUFGOQUqgqUx7lc1WK28cWVmiAzY+Zy3PtKAZHA== -->