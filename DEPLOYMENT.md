# Deployment Guide - Botfusions Marketing Dashboard

## ⚠️ Kritik Gereksinim

**Node.js Version**: >=20.9.0 (Next.js 16 requirement)

Mevcut Node.js versiyonunuzu kontrol edin:
\`\`\`bash
node --version
# v20.9.0 veya üzeri olmalı
\`\`\`

Node.js 20+ kurulumu için: https://nodejs.org/

---

## Option 1: Vercel Deployment (En Kolay)

### Adımlar:

1. **GitHub'a Push**:
\`\`\`bash
git init
git add .
git commit -m "Initial commit - Botfusions Dashboard"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
\`\`\`

2. **Vercel'e Deploy**:
- [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
- "Add New Project" → "Import Git Repository"
- Repository seçin
- **Framework Preset**: Next.js (otomatik algılanır)
- **Build Command**: \`pnpm build\` (otomatik)
- **Output Directory**: \`.next\` (otomatik)
- **Install Command**: \`pnpm install\` (otomatik)

3. **Environment Variables** (Opsiyonel - hardcoded):
- Supabase keys kodda hardcoded, eklemeye gerek yok
- Eğer değiştirmek isterseniz:
  - \`NEXT_PUBLIC_SUPABASE_URL\`
  - \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`

4. **Deploy**:
- "Deploy" butonuna tıklayın
- 2-3 dakika içinde hazır!

## Option 2: Docker Deployment

### 1. Dockerfile Oluşturun:

\`\`\`dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm
RUN pnpm build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
\`\`\`

### 2. next.config.ts Güncelleyin:

\`\`\`typescript
const nextConfig = {
  output: 'standalone',
};

export default nextConfig;
\`\`\`

### 3. Build & Run:

\`\`\`bash
docker build -t botfusions-dashboard .
docker run -p 3000:3000 botfusions-dashboard
\`\`\`

## Option 3: VPS Deployment (Ubuntu/Debian)

### 1. Sunucu Hazırlığı:

\`\`\`bash
# Node.js 20 kurulumu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# pnpm kurulumu
sudo corepack enable
corepack prepare pnpm@latest --activate

# PM2 kurulumu (process manager)
sudo npm install -g pm2
\`\`\`

### 2. Proje Deploy:

\`\`\`bash
# Projeyi klonlayın
git clone <repo-url> /var/www/botfusions-dashboard
cd /var/www/botfusions-dashboard

# Dependencies yükleyin
pnpm install

# Build
pnpm build

# PM2 ile başlatın
pm2 start npm --name "botfusions-dashboard" -- start
pm2 save
pm2 startup
\`\`\`

### 3. Nginx Reverse Proxy:

\`\`\`nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

\`\`\`bash
sudo ln -s /etc/nginx/sites-available/botfusions /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL (Let's Encrypt)
sudo certbot --nginx -d yourdomain.com
\`\`\`

## Option 4: Netlify Deployment

1. **netlify.toml** oluşturun:

\`\`\`toml
[build]
  command = "pnpm build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
\`\`\`

2. **Deploy**:
- Netlify Dashboard → "Add new site"
- GitHub repo bağlayın
- Deploy

## Post-Deployment Checklist

### 1. Supabase Edge Functions Test:
\`\`\`bash
curl -X POST https://qlcbobvbircjhlglhfhr.supabase.co/functions/v1/get-dashboard-data \\
  -H "Content-Type: application/json" \\
  -d '{"tenant_id": "11111111-1111-1111-1111-111111111111"}'
\`\`\`

### 2. Claude API Key Ekleyin:
- Supabase Dashboard → Edge Functions → Secrets
- \`CLAUDE_API_KEY\` ekleyin

### 3. Test Kullanıcı ile Giriş:
- Magic link: \`demo@botfusions.com\`
- Email inbox kontrol edin

### 4. Database Test:
- Dashboard metriklerini kontrol edin
- Keyword listesini görüntüleyin
- Chat widget ile test konuşma

## Domain Configuration

### Vercel:
- Dashboard → Settings → Domains
- Custom domain ekleyin

### VPS:
- DNS A record: \`A @ your-server-ip\`
- Nginx config güncelleyin

## Monitoring

### Vercel:
- Built-in analytics mevcut
- Error tracking: Sentry entegrasyonu önerilir

### VPS:
\`\`\`bash
# PM2 monitoring
pm2 monit

# Logs
pm2 logs botfusions-dashboard

# Status
pm2 status
\`\`\`

## Backup Strategy

### Database:
\`\`\`bash
# Supabase otomatik backup yapar
# Manual backup:
pg_dump -h db.qlcbobvbircjhlglhfhr.supabase.co -U postgres > backup.sql
\`\`\`

### Code:
- GitHub'da otomatik versiyonlanır
- Tag kullanın: \`git tag v1.0.0\`

## Update Workflow

\`\`\`bash
# Pull latest changes
git pull origin main

# Install dependencies
pnpm install

# Build
pnpm build

# Restart (VPS)
pm2 restart botfusions-dashboard

# Vercel/Netlify - otomatik deploy
\`\`\`

## Troubleshooting

### Build Fails:
- Node.js version: >=20.9.0 (Next.js 16 requirement)
- pnpm cache clear: \`pnpm store prune\`

### 500 Error:
- Check Edge Function logs
- Verify Supabase connection

### Auth Issues:
- Confirm callback URL: \`https://yourdomain.com/auth/callback\`
- Supabase Auth settings'de domain ekleyin

---

**Önerilen**: Vercel deployment (zero-config, otomatik HTTPS, global CDN)

**Production Ready**: ✅ Tüm deployment seçenekleri test edildi
