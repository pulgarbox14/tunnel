# Tunnel de Vente — Formation Vidéo

Tunnel de vente complet construit avec **Next.js 16 + TypeScript** (App Router).
Design sombre : fond noir, grille rouge en perspective, accents rouges.

## Parcours du tunnel

1. `/` — Page de vente (hero vidéo, bénéfices, erreurs, promesse, modules, offre)
2. `/checkout` — Page de commande (nom, email, téléphone, moyen de paiement FCFA)
3. `/merci` — Confirmation de commande
4. `/connexion` — Connexion à l'espace membre (code d'accès reçu après achat)
5. `/espace-membre` — Bibliothèque de vidéos **protégée côté serveur**

## Architecture

```
content/site.ts        ← TOUT le contenu du site (sujet, textes, modules, prix)
lib/auth.ts            ← Sessions signées HMAC (cookie httpOnly)
app/
  page.tsx             ← Landing
  checkout/            ← Commande
  merci/               ← Confirmation
  connexion/           ← Login membre
  espace-membre/       ← Vidéos (accès protégé serveur)
  api/auth/login       ← Vérifie le code, pose le cookie de session
  api/auth/logout      ← Déconnexion
  api/checkout         ← Création de commande (point d'intégration paiement)
components/            ← Cta, CheckoutForm, LoginForm, LogoutButton
```

**Pour changer le sujet de la formation : modifier uniquement `content/site.ts`.**

## Lancer le projet

```bash
npm install
npm run dev      # développement → http://localhost:3000
npm run build    # production
npm run start
```

## Variables d'environnement (production)

| Variable | Rôle | Défaut (dev) |
|---|---|---|
| `ACCESS_CODE` | Code d'accès envoyé aux acheteurs | `FORMATION2026` |
| `AUTH_SECRET` | Secret de signature des sessions | valeur de dev |

## Sécurité de l'espace membre

- Le code d'accès est vérifié **côté serveur** (comparaison à temps constant).
- La session est un cookie **httpOnly signé HMAC-SHA256** : impossible à forger.
- La page `/espace-membre` est rendue côté serveur et redirige sans session valide.

## Prochaines étapes

- [ ] Brancher un agrégateur de paiement FCFA (CinetPay, FedaPay, PayDunya, Paystack) dans `app/api/checkout/route.ts`
- [ ] Envoi automatique du code d'accès par email après paiement (webhook)
- [ ] Ajouter les vraies vidéos dans `content/site.ts` (mp4, Vimeo ou YouTube embed)
