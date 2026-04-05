# Sokkar Care

Sokkar Care est une application web PWA complète conçue pour l'accompagnement des patients atteints de diabète. Elle offre un suivi glycémique précis, un simulateur de dose d'insuline, un catalogue de recettes diététiques, ainsi que des conseils et astuces éducatifs dans une interface bilingue (Français/Arabe).

## Prérequis

- Node.js (v18+)
- npm ou yarn
- Projet Supabase configuré (pour la BDD et l'authentification)

## Installation Locale

1. **Cloner le repository**
   ```bash
   git clone <votre-url-git>
   cd Sokkar-Care/Frontend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Variables d'Environnement**
   Créez un fichier `.env.local` à la racine (dossier Frontend), et ajoutez les variables en suivant `.env.example` :
   ```env
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON_KEY=votre_anon_key_supabase
   ```

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:8080`.

## Déploiement Production (Vercel)

L'application est configurée pour un déploiement fluide sur Vercel :

1. Connectez votre dépôt GitHub à Vercel.
2. Vercel détectera la configuration Vite.
3. Ajoutez vos variables d'environnement (`VITE_SUPABASE_URL`, etc.).
4. Déployez. Les règles de routing côté client sont gérées automatiquement grâce au fichier `vercel.json`.

## Technologies

- **Frontend** : React 18, Vite, TypeScript
- **State Management** : Zustand
- **UI & Animations** : TailwindCSS, Framer Motion, Shadcn UI
- **Backend / Auth** : Supabase
- **PWA** : Service Worker natif (`sw.js`) pour les notifications.
