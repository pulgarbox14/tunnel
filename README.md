# Cap sur monAvenir — Réussir Son Post-BAC

Tunnel de vente complet construit avec **Next.js 16 + TypeScript** (App Router).
Thème : orientation des nouveaux bacheliers au Bénin (universités, bourses,
plateforme apresmonbac.bj, débouchés et IA). Design noir / jaune / rouge
(couleurs du Bénin), police Poppins, icônes SVG.

## Parcours du tunnel

1. `/` — Page de vente (vidéo, méthode, modules, formateur, avis en carrousel, offre)
2. `/checkout` — Commande (MTN MoMo, Moov Money, Celtiis Cash, carte — via FeexPay)
3. `/paiement/<ref>` — Suivi du push USSD Mobile Money en temps réel
4. `/merci` — Confirmation + **code d'accès personnel** (aussi envoyé par email)
5. `/connexion` — Connexion espace membre
6. `/espace-membre` — Les 21 capsules vidéo (protégé serveur)

## Panel admin (URL secrète)

**`/gestion-cap-x7k9`** — aucun lien depuis le site. Pour changer l'URL,
renommer le dossier `app/gestion-cap-x7k9`.

- 📊 **Statistiques** : visites (total + 14 jours), commandes, paiements, revenu,
  codes d'accès émis (avec bouton « libérer les appareils »)
- 🎬 **Vidéos** : vidéo de vente + les 4 modules + le bonus — **upload direct
  du fichier mp4 sur le serveur** (par morceaux de 4 Mo, avec progression) ou
  lien externe (Vimeo, mp4). Liste des vidéos hébergées avec taille,
  indicateur « utilisée sur le site » et bouton de suppression
- ⭐ **Avis clients** : carrousel de la page d'accueil — captures WhatsApp
  (upload direct) ou vidéos témoignages Vimeo, ajout/suppression
- 📷 **Photos** : nom + photos du formateur, galerie communauté

## Sécurité des accès

- **Un code personnel par acheteur** (`CAP-XXXX-XXXX`), généré au paiement
  confirmé et envoyé par email.
- **Verrouillage d'appareil** : le code se lie aux 2 premiers appareils
  utilisés (`MAX_DEVICES`) — un 3ᵉ téléphone est refusé. L'admin peut libérer
  les appareils d'un client depuis le panel.
- Sessions signées HMAC en cookies httpOnly ; vidéos en lecture seule
  (pas de téléchargement).
- **Vidéos auto-hébergées protégées** : stockées dans `data/videos/` (hors
  de `public/`), diffusées uniquement via `/api/video/<id>` qui exige une
  session membre valide (support des requêtes Range pour la lecture
  progressive). Seules la vidéo de vente et les vidéos d'avis de la page
  d'accueil sont publiques.
- 💡 Conseil serveur : encoder les vidéos en **720p H.264 ~1-1,5 Mbit/s**
  (`ffmpeg -i in.mp4 -vf scale=-2:720 -c:v libx264 -b:v 1200k -c:a aac out.mp4`)
  pour une lecture fluide sur les connexions mobiles béninoises.
- **Pas de code maître** : le formateur accède à l'espace membre via sa
  session admin (bouton « Voir l'espace membre » dans le panel).

## Paiements — API FeexPay

Intégration **API** (`https://api-v2.feexpay.me`) : le paiement se déroule
entièrement sur le site, sans redirection.

1. Le client saisit nom, email, **numéro WhatsApp** (contact), son réseau
   Mobile Money et le **numéro à débiter**.
2. `POST /api/transactions/public/requesttopay/{mtn|moov|celtiis_bj}` avec
   l'en-tête `Authorization: Bearer <clé>` → le client reçoit le push USSD
   et confirme avec son code PIN.
3. La page `/paiement/<ref>` interroge le statut jusqu'à `SUCCESSFUL`, puis
   redirige vers `/merci` avec le code d'accès.

Détails d'implémentation (`lib/feexpay.ts`) :

- **Numéro** au format exigé : indicatif `229` + numéro local à 10 chiffres
  commençant par `01` (`+229 01 97 91 77 59` → `2290197917759`). Les anciens
  numéros à 8 chiffres sont préfixés automatiquement.
- **Montant** borné par FeexPay : 100 à 2 000 000 XOF (vérifié côté serveur).
- **`description`** nettoyée de tout caractère spécial (exigence FeexPay).
- **Moov** peut renvoyer le statut final dès la première réponse (par
  exemple `FAILED` / « Balance is insufficient ») : le message de
  l'opérateur est alors affiché tel quel au client.
- Toute erreur est enregistrée sur la commande et **visible dans le panel
  admin**, sans avoir à ouvrir le serveur en SSH.

**Sans clé configurée, mode simulation** (commande validée directement) pour
tester le tunnel de bout en bout.

⚠️ Le paiement par **carte bancaire** n'est pas branché : la doc de
l'endpoint correspondant est nécessaire.

## Emails (code d'accès)

Envoi via **SMTP Hostinger** — aucune API nécessaire : créer une boîte
email dans Hostinger (Emails → digitafrik.com → Créer un compte email,
ex : `orientation@digitafrik.com`), puis renseigner
`SMTP_HOST=smtp.hostinger.com`, `SMTP_PORT=465`, `SMTP_USER` et
`SMTP_PASS` (les identifiants de la boîte). SPF/DKIM sont gérés
automatiquement par Hostinger sur le domaine.

Vérifier l'adresse expéditrice chez le fournisseur pour une bonne
délivrabilité. Sans clé : le code reste affiché sur la page `/merci`.

## Variables d'environnement

Voir `.env.example`. Aucun identifiant n'est codé en dur : en production,
sans `ADMIN_EMAIL` / `ADMIN_PASSWORD`, le panel admin est verrouillé.

| Variable | Rôle | Défaut (dev) |
|---|---|---|
| `ADMIN_EMAIL` | Email de connexion admin | `admin@test.local` (dev uniquement) |
| `ADMIN_PASSWORD` | Mot de passe admin | `capadmin2026` (dev uniquement) |
| `AUTH_SECRET` | Secret de signature des sessions | valeur de dev |
| `MAX_DEVICES` | Appareils autorisés par code | `2` |
| `MAX_VIDEO_MB` | Taille max d'une vidéo uploadée (0 = illimité) | `0` (illimité) |
| `FEEXPAY_API_KEY` | Clé API FeexPay | — (simulation) |
| `FEEXPAY_SHOP_ID` | Boutique FeexPay | — |
| `FEEXPAY_BASE_URL` | Base de l'API FeexPay | `https://api-v2.feexpay.me` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Boîte Hostinger pour l'envoi des emails | — |
| `MAIL_FROM_NAME` | Nom d'expéditeur affiché | `Cap sur monAvenir` |
| `APP_URL` | URL publique du site | `http://localhost:3000` |

## Données

Stockage JSON sur disque dans `data/` (commandes, codes, stats, contenu
admin), vidéos dans `data/videos/` et images uploadées dans `data/uploads/`
(servies via la route `/uploads/<nom>`) — adaptés à un serveur Node (VPS,
`next start`). Sur un hébergeur serverless (Vercel), prévoir une base de
données à la place.

## Lancer le projet

```bash
npm install
npm run dev      # développement → http://localhost:3000
npm run build && npm run start
```
