# Mon Blog – Frontend

Ce dossier contient le frontend de l’application de blog, développé avec **Next.js 14** (React, TypeScript, Tailwind CSS).

## 🚀 Fonctionnalités principales
- Interface moderne, responsive et accessible
- Authentification (NextAuth.js)
- Gestion des articles, commentaires, réactions, thèmes, utilisateurs (admin)
- Modals RGPD, mentions légales, contact
- Menu burger mobile, avatar connecté, notifications toast
- Appels API vers le backend Spring Boot
- Design personnalisable avec Tailwind CSS

## 🗂️ Structure du projet

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Layout global (Navbar, Footer, Providers)
│   │   ├── page.tsx           # Page d’accueil
│   │   ├── globals.css        # Styles globaux (Tailwind)
│   │   ├── admin/             # Pages d’administration
│   │   ├── posts/             # Pages articles (liste, détail, création, édition)
│   │   ├── auth/              # Pages login/register
│   │   └── api/               # Routes API (auth, ...)
│   ├── components/            # Composants réutilisables (Navbar, Footer, Modals...)
│   ├── lib/                   # Fonctions utilitaires et appels API
│   ├── types/                 # Types TypeScript partagés
├── public/                    # (optionnel) Images statiques
├── package.json               # Dépendances et scripts
├── tailwind.config.js         # Config Tailwind CSS
├── Dockerfile                 # Image Docker du frontend
└── ...
```

## ⚙️ Démarrage rapide

### Prérequis
- Node.js 18+
- npm 9+
- (Optionnel) Docker

### Lancer en local
```bash
cd frontend
npm install
npm run dev
```

### Avec Docker
```bash
docker build -t blog-frontend .
docker run -p 3000:3000 blog-frontend
```

## 🔑 Configuration
- Les appels API sont configurés pour pointer vers le backend (voir `src/lib/api.ts`)
- Variables d’environnement à placer dans `.env.local` si besoin (ex : NEXTAUTH_URL, etc.)

## 🧩 Principaux dossiers
- **app/** : pages, layout, routes API Next.js
- **components/** : Navbar, Footer, Modals, formulaires, etc.
- **lib/** : utilitaires, appels API
- **types/** : définitions TypeScript

## 🎨 Design
- **Tailwind CSS** pour un design moderne et personnalisable
- Plugins : `@tailwindcss/forms`, `@tailwindcss/typography`
- Styles globaux dans `src/app/globals.css`

## 📝 Auteur & Licence
- Frontend réalisé avec Next.js, React, Tailwind et beaucoup de passion !
- Licence : MIT (à adapter selon votre besoin) 