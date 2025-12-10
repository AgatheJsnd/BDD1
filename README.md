# Bureau Virtuel - Interface Immersive

Une interface React immersive qui simule un bureau d'ordinateur avec des icônes interactives et des pièces de puzzle décoratives.

## 🚀 Technologies Utilisées

- **React 18** - Framework JavaScript avec Hooks
- **Tailwind CSS** - Framework CSS utilitaire
- **Lucide React** - Bibliothèque d'icônes modernes
- **Vite** - Build tool ultra-rapide

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Builder pour la production
npm run build
```

## ✨ Fonctionnalités

### 1. Fond d'écran immersif
- Image de fond haute qualité depuis Unsplash
- Overlay sombre pour améliorer la lisibilité
- Responsive et adaptatif

### 2. Icônes de bureau
- 4 icônes alignées verticalement : Mes Documents, Sécurité, Profil, Notes
- Effets de survol interactifs
- Utilisation de Lucide React pour des icônes de qualité

### 3. Pièces de puzzle
- 3 pièces SVG avec formes réalistes
- Couleurs distinctes (bleu, rouge, vert)
- Rotations aléatoires pour un effet naturel
- Ombres portées pour l'effet 3D

### 4. Barre des tâches
- Affichage de l'heure et de la date en temps réel
- Effet glassmorphism avec backdrop-blur

## 🎨 Personnalisation

### Changer le fond d'écran

Dans `src/App.jsx`, modifiez l'URL de l'image :

```javascript
backgroundImage: 'url(VOTRE_URL_ICI)',
```

### Ajouter/Modifier des icônes

Dans `src/App.jsx`, modifiez le tableau `desktopIcons` :

```javascript
const desktopIcons = [
  { Icon: VotreIcone, label: 'Votre Label' },
  // ...
];
```

### Repositionner les pièces de puzzle

Modifiez le tableau `puzzlePieces` avec les nouvelles positions :

```javascript
{ 
  color: 'text-purple-500', 
  position: { top: '30%', left: '50%' },
  rotation: 45
}
```

## 📁 Structure du Projet

```
BDD1/
├── src/
│   ├── components/
│   │   ├── DesktopIcon.jsx    # Composant icône réutilisable
│   │   └── PuzzlePiece.jsx    # Composant pièce de puzzle SVG
│   ├── App.jsx                # Composant principal
│   ├── main.jsx               # Point d'entrée React
│   └── index.css              # Styles Tailwind
├── index.html                 # Template HTML
├── package.json               # Dépendances
├── tailwind.config.js         # Configuration Tailwind
├── vite.config.js             # Configuration Vite
└── README.md                  # Documentation
```

## 🎯 Prochaines Améliorations Possibles

- [ ] Drag & drop des icônes
- [ ] Double-clic pour ouvrir des fenêtres
- [ ] Menu contextuel (clic droit)
- [ ] Fenêtres redimensionnables
- [ ] Mode sombre/clair
- [ ] Personnalisation du thème

## 📝 Licence

Ce projet est libre d'utilisation pour vos projets personnels et commerciaux.

