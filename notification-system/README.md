# Botfusions Dashboard Email Notification System

Botfusions Dashboard için Gmail SMTP tabanlı kapsamlı email notification sistemi. Real-time bildirimler, günlük/haftalık özetler ve otomatik raporlama özellikleri içerir.

## 📁 Dosya Yapısı

```
notification-system/
├── config/
│   ├── email-config.js           # SMTP ayarları ve email helper functions
│   ├── notification-rules.js     # Email gönderim kuralları ve zamanlama
│   └── n8n-config.js            # N8N SMTP node konfigürasyonu
├── templates/
│   └── email-templates.html      # Responsive HTML email templates
├── utils/
│   └── email-sender.js          # Email gönderim fonksiyonları
└── README.md                    # Bu dosya
```

## 🌟 Özellikler

- 📧 Gmail SMTP Entegrasyonu - Güvenli email gönderimi
- 📱 Responsive HTML Templates - Tüm cihazlarda uyumlu email tasarımı
- ⚡ Real-time Bildirimler - Anlık alert sistemi
- 🕐 Zamanlanmış Gönderimler - Günlük/haftalık/aylık özetler
- 📊 Email Tracking - Gönderim takibi ve istatistikler
- 🗄️ Supabase Entegrasyonu - Kullanıcı verileri ve tracking
- 🔄 N8N Workflow Desteği - No-code automation entegrasyonu
- 🇹🇷 Türkçe Interface - Tamamen Türkçe email içerikleri

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install nodemailer @sendgrid/mail @supabase/supabase-js
```

### 2. Gmail App Password Kurulumu

1. Google hesabınızda 2FA'yı etkinleştirin
2. [App Passwords](https://myaccount.google.com/apppasswords) sayfasına gidin
3. "Mail" ve "Other" seçeneklerini seçin
4. "Botfusions Dashboard" adında bir password oluşturun
5. Bu password'u `GMAIL_APP_PASSWORD` olarak kullanın

### 3. Environment Variables

`.env` dosyasına aşağıdaki değişkenleri ekleyin:

```bash
# Gmail SMTP Ayarları
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Email Ayarları
FROM_EMAIL=noreply@botfusions.com
REPLY_TO_EMAIL=support@botfusions.com

# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Dashboard URL'leri
DASHBOARD_URL=https://dashboard.botfusions.com
COMPANY_URL=https://botfusions.com
COMPANY_LOGO_URL=https://botfusions.com/logo.png

# SendGrid (Opsiyonel)
SENDGRID_API_KEY=your-sendgrid-api-key
```

### 4. Node.js Projesinde Kullanım

```javascript
const { sendWelcomeEmail, sendAlertEmail } = require('./notification-system/utils/email-sender');

// Hoş geldin emaili
await sendWelcomeEmail({
  id: 'user123',
  email: 'user@example.com',
  full_name: 'Ahmet Yılmaz'
}, {
  dashboard_url: 'https://dashboard.botfusions.com',
  support_url: 'https://dashboard.botfusions.com/support'
});

// Alert email
await sendAlertEmail({
  email: 'user@example.com',
  full_name: 'Ahmet Yılmaz'
}, {
  type: 'warning',
  title: 'Sistem Bakımı',
  message: 'Yarın gece 02:00-04:00 arası sistem bakımı yapılacaktır.',
  priority: 'normal',
  action_url: 'https://dashboard.botfusions.com/maintenance'
});
```

## 📧 Email Template'leri

### Mevcut Templates

1. **Welcome Email** (`welcome`)
   - Yeni kullanıcı kaydı sonrası hoş geldin mesajı
   - Dashboard özelliklerinin tanıtımı
   - Hızlı başlangıç linkleri

2. **Alert Email** (`alert`)
   - Sistem uyarıları ve hata bildirimleri
   - Öncelik seviyeli bildirimler
   - Acil durum bildirimleri

3. **Report Email** (`report`)
   - Performans raporları
   - Veri analizi özetleri
   - İstatistiksel içerikler

4. **Digest Email** (`digest`)
   - Günlük/haftalık aktivite özetleri
   - Son değişiklikler ve güncellemeler
   - Performans sıralamaları

5. **Settings Email** (`settings`)
   - Bildirim ayarları yönetimi
   - Kullanıcı tercihleri güncellemeleri

## 📅 Notification Kuralları

### Real-time Rules
- Kullanıcı kaydı bildirimi
- Sistem hata uyarıları
- Veri eşiği aşımı
- Planlı sistem bakımı

### Zamanlanmış Rules
- Günlük aktivite özeti (09:00)
- Haftalık performans raporu (Pazartesi 09:00)
- Aylık analiz raporu (Ayın 1'i)
- Sistem bakım bildirimleri (24 saat önceden)

## 🔄 N8N Integration

### Workflow Import

1. N8N'e giriş yapın
2. "Import from JSON" seçeneğini kullanın
3. `config/n8n-config.js` dosyasındaki workflow JSON'unu yapıştırın
4. Credential'ları yapılandırın

### Webhook Endpoints

```javascript
// Welcome Email Webhook
POST /webhook/welcome-email
{
  "email": "user@example.com",
  "name": "Ahmet Yılmaz",
  "id": "user123"
}

// Alert Email Webhook  
POST /webhook/alert-email
{
  "user_email": "user@example.com",
  "user_name": "Ahmet Yılmaz",
  "alert_type": "warning",
  "title": "Sistem Bakımı",
  "message": "Yarın gece bakım var",
  "action_url": "https://dashboard.botfusions.com/maintenance"
}
```

### N8N Credential Setup

```javascript
// Gmail SMTP Credential
{
  "name": "Gmail SMTP",
  "type": "smtp",
  "data": {
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false,
    "username": "{{$env.GMAIL_USER}}",
    "password": "{{$env.GMAIL_APP_PASSWORD}}"
  }
}
```

## 🔐 Güvenlik

- **App Password**: Gmail hesabı için app password kullanın
- **Environment Variables**: Hassas bilgileri environment'da saklayın
- **Rate Limiting**: Email gönderimlerinde rate limiting uygulayın
- **Input Validation**: Email adreslerini doğrulayın
- **SSL/TLS**: SMTP bağlantılarında SSL/TLS kullanın

## 📱 Responsive Tasarım

Email template'leri tüm cihazlarda uyumlu olacak şekilde tasarlanmıştır:

- **Desktop**: 600px maksimum genişlik
- **Tablet**: Adaptive grid layout
- **Mobile**: Tek sütunlu düzen
- **Print**: Print-friendly styles

## 🌍 Türkçe Localizasyon

- Tüm email içerikleri Türkçe
- Tarih ve saat formatları Türkiye saati
- Türkçe karakter desteği (UTF-8)
- Kültürel adaptasyonlar

## 📊 Email Tracking

### Tracking Tablosu

Supabase'de `email_tracking` tablosunu oluşturun:

```sql
CREATE TABLE email_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  email_type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  message_id TEXT,
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### İstatistikler

```javascript
const { getEmailStats } = require('./utils/email-sender');

// Genel istatistikler
const stats = await getEmailStats();

// Kullanıcıya özel istatistikler
const userStats = await getEmailStats('user123');

// Tarih aralığına göre
const dateRangeStats = await getEmailStats(null, {
  start: '2025-01-01T00:00:00Z',
  end: '2025-01-31T23:59:59Z'
});

console.log('Email İstatistikleri:', stats);
// {
//   total: 150,
//   sent: 145,
//   failed: 5,
//   opened: 89,
//   clicked: 34,
//   openRate: "59.33",
//   clickRate: "22.67"
// }
```

## 🐛 Troubleshooting

### Yaygın Sorunlar

1. **SMTP Authentication Error**
   ```bash
   # Gmail App Password kontrol edin
   # 2FA'nın etkin olduğundan emin olun
   ```

2. **Email Gönderilmiyor**
   ```bash
   # Email servis sağlığını kontrol edin
   const health = await checkEmailHealth();
   ```

3. **Template Render Hatası**
   ```javascript
   // Template data'sını kontrol edin
   const validation = validateEmailData('welcome', userData);
   if (!validation.valid) {
     console.error('Eksik alanlar:', validation.missing);
   }
   ```

### Debug Modu

```bash
NODE_ENV=development npm start
```

## 🛠️ Geliştirme

### Custom Template Ekleme

```javascript
// 1. HTML template'ini templates/email-templates.html'e ekleyin
// 2. email-sender.js'e yeni fonksiyon ekleyin
async function sendCustomEmail(userData, customData) {
  return await sendEmail({
    to: userData.email,
    templateName: 'custom',
    data: { user: userData, ...customData },
    subject: 'Custom Bildirim'
  });
}

// 3. notification-rules.js'e rule ekleyin
const CUSTOM_RULES = {
  customNotification: {
    name: 'Custom Bildirim',
    template: 'custom',
    enabled: true,
    trigger: 'custom_event'
  }
};
```

### Test Fonksiyonları

```javascript
const { sendTestEmail, checkEmailHealth } = require('./config/email-config');

// Email servis sağlığı kontrolü
const health = await checkEmailHealth();
console.log('Email Servis Durumu:', health);

// Test email gönderimi
const testResult = await sendTestEmail(
  'test@example.com',
  'Dashboard Test Email'
);
console.log('Test Sonucu:', testResult);
```

## 📚 API Referansı

### sendWelcomeEmail(userData, options)
Yeni kullanıcı hoş geldin emaili gönderir.

**Parametreler:**
- `userData`: { id, email, full_name }
- `options`: Dashboard URL'leri

### sendAlertEmail(userData, alertData)
Alert/bildirim emaili gönderir.

**Parametreler:**
- `userData`: { email, full_name }
- `alertData`: { type, title, message, priority, action_url }

### sendDigestEmail(userData, digestData)
Özet email gönderir.

**Parametreler:**
- `userData`: { email, full_name }
- `digestData`: { summary, activities, performers, events }

### getEmailStats(userId, dateRange)
Email istatistikleri getirir.

**Parametreler:**
- `userId`: UUID (opsiyonel)
- `dateRange`: { start, end } (opsiyonel)

## 📞 Destek

- **Email**: support@botfusions.com
- **Dashboard**: https://dashboard.botfusions.com/support
- **Dokümantasyon**: https://docs.botfusions.com

## 📄 Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.

---

## 🔄 Güncellemeler

### v1.0.0 (2025-11-01)
- ✅ Gmail SMTP entegrasyonu
- ✅ Responsive HTML email templates
- ✅ Real-time notification sistemi
- ✅ Zamanlanmış email gönderimi
- ✅ N8N workflow desteği
- ✅ Email tracking ve istatistikler
- ✅ Supabase entegrasyonu
- ✅ Türkçe localizasyon