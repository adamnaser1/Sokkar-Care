# Documentation d'Architecture et Déploiement (Sokkar Care)

## Vue d'Ensemble Architecturale

Sokkar Care adopte une architecture moderne, modulaire et Serverless. Afin d’assurer une stabilité optimale et une charge de gestion de serveur minimale avec une utilisation à 100% de quotas gratuits, voici la recommandation architecturale retenue.

### 1. Frontend & Client-side Logic (Vercel)
Le cœur applicatif est construit sur du **React (Vite)** pur. L’authentification, la validation, le filtrage des tables, et le rendu UI sont délégués au Frontend.
- **Hébergement :** [Vercel](https://vercel.com/)
- **Avantages :** CDN Global, Zero-config pour React, HTTPS natif, et CI/CD gratuit depuis GitHub.
- **Paramétrage clé :** Le fichier `vercel.json` gère l'exclusion des APIs bloquées et dirige la sécurité des Headers.

### 2. Base de Données & Authentification (Supabase)
Toute la donnée (Profils, Mesures, Doses, Historique) est stockée sur un environnement PostgreSQL managé.
- **Service :** [Supabase](https://supabase.com/)
- **Avantages :** 
  - API REST/GraphQL instantanée via auto-génération depuis les modèles PostgreSQL.
  - Supabase Auth intégré pour les comptes, emails OTP et recovery, avec gestion du TTL JWT sécurisée.
  - Protection via **RLS (Row Level Security)**, évitant absolument une usurpation de données patients par une modification depuis le frontend.

### 3. Logique Serveur & Notifications Push (Edge Functions + Render)
Puisque le frontend n’est pas un backend actif h24, la problématique du Push Notification (Rappels de mesures sans ouverture de l’application) peut être résolue selon l’approche hybride suivante :

#### Option A (Approche Recommandée - Serverless natif)
**Supabase Edge Functions** (via Deno)
- Les Web Push peuvent être déclenchés par le backend Supabase suite à un trigger SQL ou via des appels Edge Functions (exemple : une Edge function `/send-push` déclenchée périodiquement).
- Configurer [PG Cron](https://supabase.com/docs/guides/database/extensions/pgcron) sur Supabase pour déclencher des envois synchrones si l'heure `measureTimes` stockée dans les profils utilisateur est arrivée.

#### Option B (Micro-Service Cron Express.js)
Déléguer un module `Node.js` séparé pour chronométrer les alertes.
- **Hébergement :** [Render.com](https://render.com) (Plan Web Service Gratuit)
- **Déploiement :** `render.yaml` pour l'IaC. Écrire un petit fichier `server.js` utilisant `node-cron` et `web-push`.
- **Inconvénient / Setup :** Le service s’endort après 15 min d’inactivité si aucun appel Web. Il faut créer une sonde HTTP (`/health`) et la ping depuis un service comme *cron-job.org* pour l'empêcher de dormir et s'assurer que les routines tombent à l'heure.

---

## Étapes de Mise en Production (Checklist Sécurité)

1. **Variables Frontend**
   Transférer les clés listées dans le `.env.example` vers l’interface Dashboard Vercel (Section "Environment Variables").

2. **Supabase RLS**
   Valider que les politiques RLS autorisent uniquement le patient via `auth.uid() === user_id` dans PostgreSQL afin que personne ne lise en vrac par l’API REST standard.
   ```sql
   CREATE POLICY "User can read own data" ON "measurements"
     FOR SELECT USING (auth.uid() = user_id);
   ```

3. **Certificats Web-Push (VAPID)**
   Le Service Worker (`sw.js`) est déployé côté public du frontend. Les clés VAPID (`VAPID_PUBLIC_KEY` et `VAPID_PRIVATE_KEY`) devront être générées via `npx web-push generate-vapid-keys` puis stockées en sécurité (le PUBLIC dans Vercel, le PRI dans l'Edge Function).

4. **Monitoring & Redirections**
   Tester le bouton "Déconnexion" en staging. Le cache Vercel doit obligatoirement honorer la redirection en `/login?loggedOut=true`. 

**Félicitations, votre environnement est prêt pour production !**
