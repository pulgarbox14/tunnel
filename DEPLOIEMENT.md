# Guide de déploiement — orientation.digitafrik.com

Mise en ligne du site sur un serveur VPS (Ubuntu/Debian) avec le
sous-domaine `orientation.digitafrik.com`.

## ⚡ Méthode rapide : une seule commande

Après avoir configuré le DNS (étape 1 ci-dessous), sur le serveur :

```bash
curl -fsSL https://raw.githubusercontent.com/pulgarbox14/tunnel/claude/tunnel-vente-instantane-etmg21/deploy.sh -o deploy.sh
sudo bash deploy.sh
```

Le script installe tout (Node, PM2, Nginx, HTTPS), demande tes identifiants
admin et tes clés à la première exécution, puis lance le site. Pour les
mises à jour suivantes : relancer `sudo bash deploy.sh`, c'est tout.

Les étapes ci-dessous détaillent la méthode manuelle équivalente.

## 1. DNS (chez le registrar de digitafrik.com)

Ajouter un enregistrement **A** :

| Type | Nom | Valeur |
|---|---|---|
| A | `orientation` | IP publique du serveur |

Attendre la propagation (souvent < 30 min). Vérifier :
`ping orientation.digitafrik.com`

## 2. Sur le serveur : Node.js + PM2

```bash
# Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm install -g pm2

# Récupérer le projet
cd /var/www
git clone https://github.com/pulgarbox14/tunnel orientation
cd orientation
npm install
```

## 3. Variables d'environnement

Créer `/var/www/orientation/.env.production` :

```env
APP_URL=https://orientation.digitafrik.com

# SÉCURITÉ — à personnaliser absolument (panel verrouillé sinon)
ADMIN_EMAIL=ton-email@digitafrik.com
ADMIN_PASSWORD=TON_MOT_DE_PASSE_ADMIN_FORT
AUTH_SECRET=une-longue-phrase-aleatoire-de-50-caracteres-minimum

# Paiements FeexPay
FEEXPAY_API_KEY=ta_cle_api
FEEXPAY_SHOP_ID=ton_shop_id

# Emails via la boîte Hostinger (aucune API nécessaire)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=orientation@digitafrik.com
SMTP_PASS=mot-de-passe-de-la-boîte
MAIL_FROM_NAME=Cap sur monAvenir
```

Astuce : générer un AUTH_SECRET fort → `openssl rand -hex 32`

## 4. Build et lancement avec PM2

```bash
cd /var/www/orientation
npm run build
pm2 start npm --name orientation -- start
pm2 save
pm2 startup   # suivre l'instruction affichée (démarrage auto au reboot)
```

Le site tourne alors sur `http://127.0.0.1:3000`.

## 5. Nginx (reverse proxy)

Créer `/etc/nginx/sites-available/orientation` :

```nginx
server {
    server_name orientation.digitafrik.com;

    # Upload des vidéos par morceaux de 4 Mo → marge confortable
    client_max_body_size 16m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Diffusion vidéo : pas de mise en tampon, délais larges
        proxy_buffering off;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/orientation /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 6. HTTPS (obligatoire — Let's Encrypt gratuit)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d orientation.digitafrik.com
```

Certbot configure le HTTPS et le renouvellement automatique.

## 7. Vérifications après mise en ligne

- [ ] `https://orientation.digitafrik.com` → page de vente OK
- [ ] `https://orientation.digitafrik.com/gestion-cap-x7k9` → panel admin
      (avec le NOUVEAU mot de passe)
- [ ] Uploader une vidéo test depuis le panel → lecture dans l'espace membre
- [ ] Commande test → code reçu par email (si Brevo configuré)
- [ ] Paiement test FeexPay en sandbox avant de passer en production

## 8. Mises à jour du site

```bash
cd /var/www/orientation
git pull
npm install
npm run build
pm2 restart orientation
```

## Sauvegardes (important !)

Toutes les données vivent dans le dossier `data/` :

```bash
# data/ : commandes, codes d'accès, stats, contenu admin, VIDÉOS, photos
tar -czf backup-$(date +%F).tar.gz data
```

Un cron quotidien vers un autre disque ou un stockage distant est recommandé.
