#!/usr/bin/env bash
# ============================================================
# Déploiement en une commande — orientation.digitafrik.com
#
#   Première installation OU mise à jour :
#     sudo bash deploy.sh
#
# Le script détecte tout seul ce qui est déjà installé :
# - 1re fois : installe Node 22, PM2, Nginx, Certbot, clone le
#   projet, crée .env.production, build, lance, configure HTTPS
# - ensuite : git pull + build + redémarrage (mise à jour)
# ============================================================
set -euo pipefail

# ----------- Configuration (modifiable) -----------
DOMAIN="orientation.digitafrik.com"
APP_DIR="/var/www/orientation"
REPO_URL="https://github.com/pulgarbox14/tunnel"
BRANCH="claude/tunnel-vente-instantane-etmg21"
APP_NAME="orientation"
PORT="3017"
# ---------------------------------------------------

say()  { echo -e "\n\033[1;33m▶ $*\033[0m"; }
ok()   { echo -e "\033[1;32m✔ $*\033[0m"; }

[ "$(id -u)" -eq 0 ] || { echo "Lance avec sudo : sudo bash deploy.sh"; exit 1; }

# 1. Dépendances système
if ! command -v node >/dev/null 2>&1; then
  say "Installation de Node.js 22…"
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
command -v nginx >/dev/null 2>&1 || { say "Installation de Nginx…"; apt-get install -y nginx; }
command -v pm2   >/dev/null 2>&1 || { say "Installation de PM2…";   npm install -g pm2; }
ok "Node $(node -v) · Nginx · PM2 prêts"

# 2. Code source
if [ ! -d "$APP_DIR/.git" ]; then
  say "Clonage du projet…"
  mkdir -p "$(dirname "$APP_DIR")"
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
else
  say "Mise à jour du code…"
  git -C "$APP_DIR" fetch origin "$BRANCH"
  git -C "$APP_DIR" reset --hard "origin/$BRANCH"
fi
cd "$APP_DIR"

# 3. Variables d'environnement
# Un .env incomplet (cree lors d'un lancement sans terminal) est recree
if [ -f .env.production ] && ! grep -q '^ADMIN_EMAIL=..*' .env.production; then
  say ".env.production incomplet detecte - on le recree..."
  rm -f .env.production
fi
if [ ! -f .env.production ]; then
  say "Création de .env.production (PREMIÈRE INSTALLATION)…"
  read -rp "  Email admin            : " ADMIN_EMAIL < /dev/tty
  read -rsp "  Mot de passe admin     : " ADMIN_PASSWORD < /dev/tty; echo
  read -rp "  Clé API FeexPay (vide = simulation) : " FEEXPAY_API_KEY < /dev/tty
  read -rp "  Shop ID FeexPay        : " FEEXPAY_SHOP_ID < /dev/tty
  read -rp "  Email Hostinger d'envoi (ex orientation@digitafrik.com, vide = pas d'email) : " SMTP_USER < /dev/tty
  SMTP_PASS=""
  if [ -n "$SMTP_USER" ]; then
    read -rsp "  Mot de passe de cette boîte email : " SMTP_PASS < /dev/tty; echo
  fi
  AUTH_SECRET="$(openssl rand -hex 32)"
  cat > .env.production <<ENV
APP_URL=https://$DOMAIN
ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_PASSWORD=$ADMIN_PASSWORD
AUTH_SECRET=$AUTH_SECRET
FEEXPAY_API_KEY=$FEEXPAY_API_KEY
FEEXPAY_SHOP_ID=$FEEXPAY_SHOP_ID
FEEXPAY_MODE=LIVE
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=$SMTP_USER
SMTP_PASS=$SMTP_PASS
MAIL_FROM_EMAIL=${SMTP_USER:-no-reply@digitafrik.com}
MAIL_FROM_NAME=Cap sur monAvenir
MAX_DEVICES=2
MAX_VIDEO_MB=0
ENV
  chmod 600 .env.production
  ok ".env.production créé (AUTH_SECRET généré automatiquement)"
else
  ok ".env.production déjà en place (inchangé)"
fi

# 4. Build
say "Installation des dépendances et build…"
npm install --no-fund --no-audit
npm run build

# 5. Lancement PM2 (delete + start : applique toujours le bon port)
say "Lancement de l'application sur le port $PORT…"
pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
pm2 start npm --name "$APP_NAME" -- start -- -p "$PORT"
pm2 save
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true
ok "Application en ligne sur le port $PORT"

# 6. Nginx
NGINX_CONF="/etc/nginx/sites-available/$APP_NAME"
NGINX_CHANGED=""
if [ -f "$NGINX_CONF" ] && ! grep -q "127.0.0.1:$PORT" "$NGINX_CONF"; then
  say "Mise à jour du port dans Nginx…"
  sed -i "s|proxy_pass http://127.0.0.1:[0-9]*;|proxy_pass http://127.0.0.1:$PORT;|" "$NGINX_CONF"
  NGINX_CHANGED="port $PORT"
fi
# Upload vidéo : transmettre les morceaux sans les mettre en tampon
if [ -f "$NGINX_CONF" ] && ! grep -q "proxy_request_buffering" "$NGINX_CONF"; then
  say "Optimisation de l'upload dans Nginx…"
  sed -i "s|proxy_buffering off;|proxy_buffering off;\n        proxy_request_buffering off;|" "$NGINX_CONF"
  NGINX_CHANGED="${NGINX_CHANGED:+$NGINX_CHANGED, }upload accéléré"
fi
if [ -n "$NGINX_CHANGED" ]; then
  nginx -t && systemctl reload nginx
  ok "Nginx mis à jour ($NGINX_CHANGED)"
fi
if [ ! -f "$NGINX_CONF" ]; then
  say "Configuration Nginx…"
  cat > "$NGINX_CONF" <<NGINX
server {
    server_name $DOMAIN;
    client_max_body_size 16m;

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_buffering off;
        proxy_request_buffering off;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}
NGINX
  ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
  nginx -t && systemctl reload nginx
  ok "Nginx configuré pour $DOMAIN"
fi

# 7. HTTPS (Let's Encrypt)
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  say "Activation du HTTPS (Let's Encrypt)…"
  command -v certbot >/dev/null 2>&1 || apt-get install -y certbot python3-certbot-nginx
  certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email \
    || echo "⚠ Certbot a échoué — vérifie que le DNS de $DOMAIN pointe bien vers ce serveur, puis relance : certbot --nginx -d $DOMAIN"
fi

echo
ok "DÉPLOIEMENT TERMINÉ"
echo "   Site        : https://$DOMAIN"
echo "   Panel admin : https://$DOMAIN/gestion-cap-x7k9"
echo "   Mise à jour : sudo bash deploy.sh (à relancer quand tu veux)"
echo "   Logs        : pm2 logs $APP_NAME"
