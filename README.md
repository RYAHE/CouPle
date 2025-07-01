# CouPle - Application de Couple Professionnelle

Une application React Native moderne et professionnelle conçue pour les couples, offrant une expérience complète de gestion de leur relation.

## 🚀 Fonctionnalités

### 📱 Page d'Accueil
- **Tableau de bord personnalisé** avec salutation
- **Actions rapides** pour accéder rapidement aux fonctionnalités principales
- **Activités récentes** pour suivre les dernières interactions
- **Statistiques du couple** (jours ensemble, événements, messages)

### 💬 Messagerie
- **Chat privé** entre les deux membres du couple
- **Statut de connexion** en temps réel
- **Indicateurs de lecture** des messages
- **Interface moderne** avec bulles de conversation
- **Support des emojis** et messages multimédias

### 📅 Calendrier Partagé
- **Vue mensuelle** interactive
- **Gestion des événements** avec catégories (rendez-vous, anniversaires, etc.)
- **Ajout d'événements** avec description et heure
- **Indicateurs visuels** pour les jours avec événements
- **Navigation entre les mois**

### ✅ Tâches Partagées
- **Liste de tâches** collaborative
- **Système de priorités** (haute, moyenne, basse)
- **Assignation des tâches** (moi, partenaire, nous deux)
- **Filtres** (toutes, en cours, terminées)
- **Statistiques** de progression

### 💝 Souvenirs
- **Galerie de photos** partagée
- **Notes et moments** importants
- **Système de tags** pour organiser les souvenirs
- **Filtres par type** (photos, notes, moments)
- **Interface de création** intuitive

### 👤 Profil & Paramètres
- **Informations du couple** (nom, date de début de relation)
- **Statistiques personnalisées**
- **Actions rapides** depuis le profil
- **Paramètres de confidentialité**
- **Gestion des notifications**
- **Mode sombre** (préparé pour l'implémentation)

## 🎨 Design

- **Interface moderne** avec design Material Design
- **Palette de couleurs** romantique et professionnelle
- **Animations fluides** et transitions
- **Responsive design** adapté à tous les écrans
- **Icônes cohérentes** avec Ionicons

## 🛠 Technologies Utilisées

- **React Native** avec Expo
- **TypeScript** pour la sécurité des types
- **React Navigation** pour la navigation
- **Expo Vector Icons** pour les icônes
- **StyleSheet** pour le styling

## 📦 Installation

1. **Cloner le projet**
   ```bash
   git clone [url-du-repo]
   cd CouPleApp
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer l'application**
   ```bash
   npx expo start
   ```

4. **Tester sur votre appareil**
   - Installez l'application Expo Go sur votre téléphone
   - Scannez le QR code affiché dans le terminal

## 📱 Compatibilité

- **iOS** : 12.0+
- **Android** : 8.0+
- **Expo SDK** : 49+

## 🔧 Configuration

### Variables d'environnement
Créez un fichier `.env` à la racine du projet :
```env
EXPO_PUBLIC_APP_NAME=CouPle
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### Personnalisation
- Modifiez les couleurs dans `App.tsx` et les écrans individuels
- Ajustez les textes et labels selon vos besoins
- Personnalisez les icônes avec d'autres sets d'icônes

## 🚀 Déploiement

### Build pour production
```bash
# Pour Android
npx expo build:android

# Pour iOS
npx expo build:ios
```

### Publication sur les stores
```bash
# Publier sur Expo
npx expo publish
```

## 📋 Fonctionnalités Futures

- [ ] **Synchronisation cloud** avec Firebase
- [ ] **Notifications push** pour les événements
- [ ] **Partage de localisation** en temps réel
- [ ] **Chat vocal et vidéo** intégré
- [ ] **Galerie photo** avec stockage cloud
- [ ] **Mode hors ligne** avec synchronisation
- [ ] **Thèmes personnalisables**
- [ ] **Widgets** pour l'écran d'accueil
- [ ] **Intégration calendrier** système
- [ ] **Backup automatique** des données

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Développeur

Développé avec ❤️ pour les couples du monde entier.

---

**CouPle** - Gardez votre amour organisé et connecté ! 💕 