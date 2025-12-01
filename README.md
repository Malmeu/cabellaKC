# Cabella KC - Plateforme E-commerce de Meubles

Une plateforme e-commerce moderne pour la vente de meubles, construite avec React, Tailwind CSS et Supabase.

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer la base de données Supabase

1. Allez sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Ouvrez votre projet
3. Allez dans **SQL Editor**
4. Copiez et exécutez le contenu du fichier `supabase_schema.sql`

### 3. Lancer l'application

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── Layout.jsx       # Layout principal avec navbar
│   ├── ProductCard.jsx  # Carte produit
│   └── Toast.jsx        # Notifications
├── context/
│   └── CartContext.jsx  # Gestion du panier
├── lib/
│   └── supabaseClient.js # Client Supabase
├── pages/
│   ├── HomePage.jsx     # Page d'accueil / Catalogue
│   ├── CartPage.jsx     # Panier et checkout
│   └── admin/
│       ├── AdminLayout.jsx     # Layout admin
│       ├── AdminDashboard.jsx  # Gestion des produits
│       └── AdminOrders.jsx     # Gestion des commandes
├── App.jsx              # Routes de l'application
├── main.jsx             # Point d'entrée
└── index.css            # Styles globaux
```

## ✨ Fonctionnalités

### Côté Client
- 🛍️ Catalogue de produits avec filtres par catégorie
- 🔍 Recherche de produits
- 🛒 Panier persistant (localStorage)
- 📝 Formulaire de commande simple

### Côté Admin
- 📦 Gestion des produits (CRUD)
- 📋 Vue Kanban des commandes
- 🔄 Workflow de statut des commandes
- 📧 Simulation d'envoi d'emails

## 🎨 Design System

- **Style** : Minimaliste "Apple-like"
- **Couleurs** :
  - Primary : `#FF78AC` (Rose pastel)
  - Secondary : `#A8D5E3` (Bleu pastel)
  - Cream : `#F2F0EA`
  - Background : `#F9FAFB`

## 🛠️ Technologies

- **React** (Vite)
- **Tailwind CSS**
- **Supabase** (Base de données & Auth)
- **React Router DOM**
- **Lucide React** (Icônes)

## 📝 Workflow des commandes

1. **En attente** → Client passe commande
2. **En préparation** → Admin traite la commande
3. **Prêt à retirer** → Email envoyé au client
4. **Terminée** → Client a récupéré sa commande

---

Fait avec ❤️ pour Cabella KC
