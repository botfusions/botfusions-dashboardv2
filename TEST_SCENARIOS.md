# Test Senaryoları - Botfusions Marketing Dashboard

Bu dokuman, platformun tüm özelliklerinin manuel test edilmesi için adım adım talimatlar içerir.

## Test Ortamı Hazırlığı

### Gereksinimler
- Node.js 20.9.0 veya üzeri
- pnpm package manager
- Modern tarayıcı (Chrome, Firefox, Safari)

### Kurulum
\`\`\`bash
cd /workspace/botfusions-dashboard
pnpm install
pnpm dev
\`\`\`

Platform: http://localhost:3000

---

## Test Senaryoları

### 1. Authentication Flow ✅

#### 1.1 Magic Link Login
**Adımlar:**
1. http://localhost:3000 → Otomatik /login'e yönlenir
2. Email input'a test email gir: `test@example.com`
3. "Magic Link Gönder" butonuna tıkla
4. Yeşil success mesajı görülmeli: "Giriş bağlantısı email adresinize gönderildi"
5. Email inbox kontrol et (Supabase Auth email)
6. Magic link'e tıkla
7. /auth/callback → /dashboard'a yönlenir

**Beklenen Sonuç:**
- ✅ Email gönderimi başarılı
- ✅ Magic link callback çalışıyor
- ✅ Dashboard'a yönlendirme yapılıyor
- ✅ Sidebar'da user email görünüyor

**Test Veritabanı:**
- Supabase Auth → Users tablosunda yeni kullanıcı oluşturulmalı

---

### 2. Dashboard Sayfası ✅

#### 2.1 Metrik Kartları
**URL:** http://localhost:3000/dashboard

**Test Edilecekler:**
1. **4 Metrik Kartı Görünürlük:**
   - Gelir (125,000 TRY)
   - Müşteriler (450)
   - SKU (1,250)
   - Kar Marjı (28.5%)

2. **Delta Göstergeleri:**
   - Her kartta +/- yüzde değişimi görünmeli
   - Yeşil (↑) veya kırmızı (↓) ok ikonları
   - "önceki döneme göre" etiketi

3. **Sparkline Charts:**
   - Her kartta mini bar chart animasyonu
   - Hover efekti (scale animation)

**Beklenen Sonuç:**
- ✅ Tüm metrikler doğru görünüyor
- ✅ Delta hesaplamaları doğru
- ✅ Animasyonlar smooth çalışıyor

**Veritabanı Kontrolü:**
\`\`\`sql
SELECT * FROM metrics WHERE tenant_id = '11111111-1111-1111-1111-111111111111';
\`\`\`

---

#### 2.2 Chart Grafikleri
**Test Edilecekler:**
1. **Haftalık Gelir Trendi (Area Chart):**
   - Son 7 günlük veri görünmeli
   - Purple gradient fill
   - Hover tooltip çalışmalı
   - Export button görünür

2. **Keyword Performansı (Bar Chart):**
   - 6 aylık veri
   - Purple bar color
   - Y-axis değerleri okunabilir

**Beklenen Sonuç:**
- ✅ Charts render oluyor
- ✅ Tooltip'ler çalışıyor
- ✅ Responsive (mobile'da tek sütun)

**Backend Veri Kontrolü:**
\`\`\`bash
# Edge Function test
curl -X POST https://qlcbobvbircjhlglhfhr.supabase.co/functions/v1/get-dashboard-data \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ANON_KEY" \\
  -d '{"tenant_id": "11111111-1111-1111-1111-111111111111"}'
\`\`\`

---

#### 2.3 Top Keywords Widget
**Test Edilecekler:**
1. En az 3 keyword görünmeli
2. Position change (+/-) doğru hesaplanmış
3. URL truncate çalışıyor
4. Color coding: yeşil (↑), kırmızı (↓), gri (→)

**Beklenen Sonuç:**
- ✅ Keywords listeleniyor
- ✅ Position change computed column çalışıyor
- ✅ Hover effects aktif

---

### 3. AI Chatbot ✅

#### 3.1 Floating Chat Button
**URL:** http://localhost:3000/dashboard (herhangi bir sayfa)

**Test Edilecekler:**
1. Sağ alt köşede floating button görünür
2. Pulse animation aktif
3. Badge (unread count) görünür
4. Hover → scale animation

**Beklenen Sonuç:**
- ✅ Button her sayfada görünür
- ✅ Animasyonlar smooth
- ✅ Click → Chat modal açılıyor

---

#### 3.2 Chat Modal
**Adımlar:**
1. Floating button'a tıkla
2. Chat modal sağdan slide-in animasyonu
3. Quick actions görünür (4 adet):
   - Haftalık Rapor
   - SEO Kontrolü
   - Rakip Analizi
   - (varsa diğerleri)

4. Quick action'a tıkla → Otomatik mesaj gönderilir
5. Loading indicator (3 dot bounce)
6. AI yanıtı gelir

**Beklenen Sonuç:**
- ✅ Modal animasyonu smooth
- ✅ Quick actions çalışıyor
- ✅ Mesaj gönderimi başarılı
- ✅ Claude API yanıtı geliyor (veya fallback message)

**Backend Test:**
\`\`\`bash
curl -X POST https://qlcbobvbircjhlglhfhr.supabase.co/functions/v1/chat-handler \\
  -H "Content-Type: application/json" \\
  -d '{
    "tenant_id": "11111111-1111-1111-1111-111111111111",
    "question": "Test sorusu"
  }'
\`\`\`

**Veritabanı Kontrolü:**
\`\`\`sql
SELECT * FROM chat_history ORDER BY created_at DESC LIMIT 5;
\`\`\`

---

#### 3.3 Full-Page Chat Interface
**URL:** http://localhost:3000/chat

**Test Edilecekler:**
1. Chat container full-height
2. Header (AI Asistan logo + title)
3. Quick actions bar
4. Message area scrollable
5. Input box + send button
6. Enter key → mesaj gönder

**Beklenen Sonuç:**
- ✅ Layout responsive
- ✅ Keyboard shortcuts çalışıyor
- ✅ Auto-scroll to bottom
- ✅ Message timestamps

---

### 4. Keywords Sayfası ✅

**URL:** http://localhost:3000/keywords

**Test Edilecekler:**
1. **Table Headers:**
   - Anahtar Kelime
   - Mevcut Sıra
   - Değişim
   - Gösterim
   - Tıklama
   - CTR

2. **Data Rows:**
   - En az 3 keyword
   - Position badges (#1, #2, vb.)
   - Change indicators (↑↓)
   - Number formatting (TR locale)

3. **Hover Effects:**
   - Row hover → bg color change
   - Smooth transitions

**Beklenen Sonuç:**
- ✅ Table render oluyor
- ✅ Sortable (position asc by default)
- ✅ CTR percentage formatı doğru

**Veritabanı:**
\`\`\`sql
SELECT * FROM keywords WHERE tenant_id = '11111111-1111-1111-1111-111111111111';
\`\`\`

---

### 5. Competitors Sayfası ✅

**URL:** http://localhost:3000/competitors

**Test Edilecekler:**
1. 2 competitor card görünür
2. Status badge (Aktif)
3. Mock metrics (Domain Score, SEO, Traffic)
4. Hover animation (card-hover class)

**Beklenen Sonuç:**
- ✅ Cards responsive (2 columns → 1 on mobile)
- ✅ Icons görünür
- ✅ Metrics formatted

---

### 6. Alerts Sayfası ✅

**URL:** http://localhost:3000/alerts

**Test Edilecekler:**
1. Alert cards renk kodlaması:
   - High → Red border
   - Medium → Yellow border
   - Low → Blue border
2. Icon matching severity
3. "İşaretle" button çalışıyor

**Beklenen Sonuç:**
- ✅ Severity colors doğru
- ✅ Timestamp formatting
- ✅ Animation on load (slide-in)

---

### 7. Reports Sayfası ✅

**URL:** http://localhost:3000/reports

**Test Edilecekler:**
1. "Yeni Rapor Oluştur" button görünür
2. 2 report card
3. Download icon button
4. Report type badge

**Beklenen Sonuç:**
- ✅ Cards clickable
- ✅ Hover effects
- ✅ Date formatting (TR)

---

### 8. Settings Sayfası ✅

**URL:** http://localhost:3000/settings

**Test Edilecekler:**
1. 3 notification toggle switch:
   - Email Bildirimleri (ON by default)
   - Telegram Bildirimleri (OFF)
   - Anlık Uyarılar (ON)

2. Toggle animation smooth
3. Icons görünür (Mail, MessageSquare, Bell)

**Beklenen Sonuç:**
- ✅ Toggles functional
- ✅ State değişiyor
- ✅ Colors: gray (off) → purple (on)

---

### 9. Navigation & Layout ✅

#### 9.1 Sidebar
**Test Edilecekler:**
1. Logo + brand name
2. 7 nav item:
   - Dashboard
   - Sohbet
   - Raporlar
   - Rakipler
   - Anahtar Kelimeler
   - Uyarılar
   - Ayarlar

3. Active state (purple bg)
4. User profile section (bottom)
5. "Çıkış Yap" button

**Beklenen Sonuç:**
- ✅ Navigation çalışıyor
- ✅ Active state doğru
- ✅ Logout → /login'e yönlendiriyor

---

#### 9.2 Topbar
**Test Edilecekler:**
1. Search input (left)
2. Notification bell (badge ile)
3. User avatar (right)

**Beklenen Sonuç:**
- ✅ Fixed position
- ✅ Responsive
- ✅ Icons görünür

---

### 10. Responsive Design ✅

**Test Cihazları:**
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

**Test Edilecekler:**
1. Sidebar → Mobile'da hidden (hamburger menu yok, bu bir bilinen limitasyon)
2. Charts → Mobile'da full width
3. Metric cards → Mobile'da tek sütun
4. Table → Horizontal scroll

**Beklenen Sonuç:**
- ✅ Layout responsive
- ✅ Text readable
- ⚠️ Mobile sidebar implementation eksik (MVP dışı)

---

### 11. Performance ✅

**Metrics:**
- First Load: < 3 seconds
- Dashboard data fetch: < 1 second
- Chat response: 3-15 seconds
- Page transitions: smooth

**Tools:**
- Chrome DevTools → Network tab
- Lighthouse score

**Beklenen Sonuç:**
- ✅ No JavaScript errors
- ✅ No 404s
- ✅ API calls successful

---

### 12. Security ✅

**Test Edilecekler:**
1. **Unauthenticated Access:**
   - http://localhost:3000/dashboard → /login'e yönlenir
   - Tüm protected routes require auth

2. **RLS Policies:**
   - Kullanıcı sadece kendi tenant'ının verilerini görür
   - Cross-tenant data leak yok

3. **SQL Injection:**
   - Input validation (Next.js + Supabase default)

**Test:**
\`\`\`bash
# Logout state'de dashboard erişim dene
# Browser: Clear cookies + localStorage
# http://localhost:3000/dashboard → /login redirect olmalı
\`\`\`

**Beklenen Sonuç:**
- ✅ Auth guard çalışıyor
- ✅ RLS policies enforce ediliyor
- ✅ XSS protection (React default)

---

## Edge Function Test

### Chat Handler
\`\`\`bash
curl -X POST https://qlcbobvbircjhlglhfhr.supabase.co/functions/v1/chat-handler \\
  -H "Content-Type: application/json" \\
  -H "apikey: SUPABASE_ANON_KEY" \\
  -d '{
    "tenant_id": "11111111-1111-1111-1111-111111111111",
    "question": "Bu haftanın performansı nasıl?"
  }'
\`\`\`

**Beklenti:** 200 OK, fallback message veya Claude response

---

### Dashboard Data
\`\`\`bash
curl -X POST https://qlcbobvbircjhlglhfhr.supabase.co/functions/v1/get-dashboard-data \\
  -H "Content-Type: application/json" \\
  -H "apikey: SUPABASE_ANON_KEY" \\
  -d '{"tenant_id": "11111111-1111-1111-1111-111111111111"}'
\`\`\`

**Beklenti:** Metrics, keywords, alerts data

---

### Notification Sender
\`\`\`bash
curl -X POST https://qlcbobvbircjhlglhfhr.supabase.co/functions/v1/send-notification \\
  -H "Content-Type: application/json" \\
  -H "apikey: SUPABASE_ANON_KEY" \\
  -d '{
    "tenant_id": "11111111-1111-1111-1111-111111111111",
    "notification_type": "email",
    "recipient": "test@example.com",
    "message": "Test notification"
  }'
\`\`\`

**Beklenti:** 200 OK, notification logged to database

---

## Database Integrity Test

\`\`\`sql
-- Check table counts
SELECT 
  'tenants' as table_name, COUNT(*) as count FROM tenants
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'metrics', COUNT(*) FROM metrics
UNION ALL
SELECT 'keywords', COUNT(*) FROM keywords
UNION ALL
SELECT 'chat_history', COUNT(*) FROM chat_history;

-- Check RLS policies
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public';
\`\`\`

---

## Test Checklist Summary

### Critical (Must Pass)
- [ ] Login flow çalışıyor
- [ ] Dashboard metrics render oluyor
- [ ] Charts backend'den veri çekiyor
- [ ] Chat mesaj gönderimi çalışıyor
- [ ] Edge functions respond ediyor
- [ ] RLS policies çalışıyor

### Important
- [ ] Keywords table sortable
- [ ] Navigation sidebar çalışıyor
- [ ] Logout redirects to login
- [ ] Auth guard protects routes
- [ ] Responsive layout

### Nice to Have
- [ ] Animations smooth
- [ ] Hover effects çalışıyor
- [ ] Performance metrics acceptable
- [ ] No console errors

---

## Bug Reporting Template

\`\`\`
**Bug Title:** Kısa açıklama

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:** Ne olması gerekiyordu

**Actual Result:** Ne oldu

**Screenshots:** (varsa)

**Environment:**
- Browser: Chrome 120
- OS: macOS 14
- Node.js: 20.9.0
\`\`\`

---

**Test Completion:** Tüm kritik testler pass olmalı  
**Documentation:** README.md ve DEPLOYMENT.md güncel  
**Deployment Ready:** ✅ Vercel/Docker/VPS'e deploy edilebilir

**Son Güncelleme:** 1 Kasım 2025
