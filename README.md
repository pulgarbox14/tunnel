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
- 🎬 **Vidéos** : vidéo de vente + les 21 capsules — colle un lien Vimeo OU le
  script `<iframe>` complet, conversion automatique
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
  (pas de téléchargement). Pour un blocage total du partage de liens vidéo :
  activer sur Vimeo « masquer sur Vimeo » + domaines autorisés.
- Le code maître (env `ACCESS_CODE`) ouvre l'espace membre sans limite —
  pour le formateur.

## Paiements — FeexPay

Flux Mobile Money « request to pay » : le client saisit son numéro, reçoit le
push USSD, confirme avec son PIN ; la page `/paiement/<ref>` suit le statut et
redirige vers `/merci` une fois payé. **Sans clé configurée, mode simulation**
(paiement accepté directement) pour tester le tunnel.

⚠️ Vérifier les chemins d'API dans `lib/feexpay.ts` avec la doc du compte
marchand FeexPay. Le paiement par carte reste à brancher (TODO dans
`app/api/checkout/route.ts`).

## Emails (code d'accès)

`lib/mailer.ts` supporte deux fournisseurs — définir UNE clé :
- `BREVO_API_KEY` (brevo.com — 300 emails/jour gratuits)
- `RESEND_API_KEY` (resend.com)

Vérifier l'adresse expéditrice chez le fournisseur pour une bonne
délivrabilité. Sans clé : le code reste affiché sur la page `/merci`.

## Variables d'environnement

| Variable | Rôle | Défaut (dev) |
|---|---|---|
| `ACCESS_CODE` | Code maître espace membre | `FORMATION2026` |
| `ADMIN_PASSWORD` | Mot de passe du panel admin | `capadmin2026` |
| `AUTH_SECRET` | Secret de signature des sessions | valeur de dev |
| `MAX_DEVICES` | Appareils autorisés par code | `2` |
| `FEEXPAY_API_KEY` | Clé API FeexPay | — (simulation) |
| `FEEXPAY_SHOP_ID` | Boutique FeexPay | — |
| `BREVO_API_KEY` / `RESEND_API_KEY` | Envoi des emails | — |
| `MAIL_FROM_EMAIL` / `MAIL_FROM_NAME` | Expéditeur des emails | valeurs de dev |
| `APP_URL` | URL publique du site | `http://localhost:3000` |

## Données

Stockage JSON sur disque dans `data/` (commandes, codes, stats, contenu admin)
et images uploadées dans `public/uploads/` — adaptés à un serveur Node (VPS,
`next start`). Sur un hébergeur serverless (Vercel), prévoir une base de
données à la place.

## Lancer le projet

```bash
npm install
npm run dev      # développement → http://localhost:3000
npm run build && npm run start
```
