# Tunnel de Vente en un Instant

Page d'accueil d'un tunnel de vente : capture d'email, présentation de l'offre, témoignages, FAQ et appel à l'action.

## Structure

- `index.html` — Page d'accueil / page de vente (thème sombre, accents rouges, grille en perspective)
- `espace-membre.html` — Espace membre sécurisé : portail avec code d'accès + bibliothèque de vidéos
- `styles.css` — Feuille de style partagée (thème noir/rouge)

## Espace membre

Le code d'accès de démonstration est défini dans `espace-membre.html` (constante `ACCESS_CODE`, valeur actuelle : `FORMATION2026`). C'est une protection côté navigateur pour la maquette — pour une vraie sécurité en production, prévoir un backend avec comptes utilisateurs ou un hébergeur vidéo à accès restreint (Vimeo + domaines autorisés, plateforme de formation, etc.).

## Utilisation

Ouvrez simplement `index.html` dans un navigateur, ou servez le dossier :

```bash
python3 -m http.server 8000
```

Puis visitez http://localhost:8000
