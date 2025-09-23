# MyKover - Application Mobile

Application mobile React Native développée avec Expo, NativeWind et TypeScript pour l'authentification utilisateur.

## 🚀 Technologies Utilisées

- **React Native** (dernière version)
- **Expo** (dernière version)
- **NativeWind** (dernière version) - Tailwind CSS pour React Native
- **TypeScript** - Typage statique
- **React Navigation** - Navigation entre écrans
- **React Native Reanimated** - Animations fluides
- **React Native Safe Area Context** - Gestion des zones sécurisées

## 📱 Fonctionnalités

### Écrans d'Authentification
- **Connexion** : Numéro de téléphone + mot de passe
- **Inscription Étape 1** : Nom complet + numéro de téléphone
- **Inscription Étape 2** : Email + date de naissance

### Validation et Sécurité
- Validation complète des formulaires avec messages d'erreur
- Sanitisation des entrées utilisateur
- Désactivation de l'autofill pour les mots de passe
- Prévention du copier/coller dans les champs sensibles
- Masquage des mots de passe (secureTextEntry)

### Design et UX
- Design purple moderne avec formes arrondies
- Header courbe selon les spécifications
- Zones tactiles minimales 44x44 dp
- Gestion du clavier et des zones sécurisées
- États de chargement sur les boutons
- Navigation fluide entre les étapes

## 🛠️ Installation et Configuration

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn
- Expo CLI
- Expo Go (application mobile)

### Installation
```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

### Commandes Disponibles
```bash
# Démarrer en mode développement
npm start

# Démarrer avec Expo Go
npm run android  # Pour Android
npm run ios      # Pour iOS
npm run web      # Pour le web

# Construire l'application
npm run build
```

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── Input.tsx        # Champ de saisie avec validation
│   └── PrimaryButton.tsx # Bouton principal avec état de chargement
├── screens/             # Écrans de l'application
│   ├── LoginScreen.tsx  # Écran de connexion
│   ├── SignupStep1Screen.tsx # Inscription étape 1
│   └── SignupStep2Screen.tsx # Inscription étape 2
├── navigation/          # Configuration de la navigation
│   └── AppNavigator.tsx # Navigateur principal
├── utils/              # Utilitaires
│   ├── validation.ts   # Logique de validation
│   └── sanitizer.ts   # Sanitisation des données
└── types/              # Types TypeScript
    └── index.ts        # Définitions de types
```

## 🔧 Configuration

### Tailwind CSS (NativeWind)
Le fichier `tailwind.config.js` est configuré avec :
- Couleurs purple personnalisées selon le design
- Rayons de bordure pour les formes arrondies
- Espacement pour les zones tactiles minimales

### Navigation
- Navigation en pile avec React Navigation
- Transitions fluides entre écrans
- Préservation des données entre les étapes

## 🧪 Validation et Tests

### Règles de Validation
- **Nom complet** : Au moins 2 mots, pas de chiffres ni caractères spéciaux
- **Téléphone** : Commence par +243, 9-12 chiffres au total
- **Email** : Format email standard
- **Date de naissance** : Format DD/MM/YYYY, date valide

### Sécurité
- Sanitisation de toutes les entrées utilisateur
- Suppression des caractères dangereux
- Prévention des injections XSS
- Désactivation de l'autofill sur les champs sensibles

## 📝 Commentaires du Code

Tous les fichiers source incluent des commentaires en français expliquant :
- Le but de chaque composant/fichier
- Les décisions d'implémentation (performance, sécurité)
- Les règles de validation non évidentes
- Les optimisations de performance

## 🎨 Design

L'application suit exactement le design fourni avec :
- Couleur purple principale (#7c3aed)
- Header avec courbe distinctive
- Formes arrondies (border-radius élevé)
- Espacement généreux et cohérent
- Typographie moderne et lisible

## 🚀 Déploiement

Cette application est prête pour :
- Test avec Expo Go
- Build pour les stores (avec configuration Expo)
- Déploiement sur les plateformes mobiles

## 📱 Test

1. Scanner le QR code avec Expo Go
2. Tester la navigation entre les écrans
3. Vérifier la validation des formulaires
4. Tester les états de chargement
5. Vérifier la préservation des données entre les étapes

---

**Note** : Cette application est frontend-only. Les appels API sont simulés pour démonstration des flux d'interface utilisateur.
