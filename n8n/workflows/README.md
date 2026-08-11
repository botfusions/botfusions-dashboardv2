# Botfusions Dashboard - N8N Report Generator Workflow

Bu N8N workflow'u Botfusions Dashboard için otomatik haftalık performans raporları oluşturur.

## 📋 Özellikler

- ✅ Haftalık otomatik rapor oluşturma (Her Pazartesi 09:00)
- ✅ Supabase'den metrics, competitors, keywords verilerini çekme
- ✅ Claude API ile kapsamlı performans analizi
- ✅ HTML/PDF formatında rapor oluşturma
- ✅ Email ile rapor gönderme
- ✅ Supabase reports tablosuna kaydetme
- ✅ Responsive HTML rapor tasarımı

## 🚀 Kurulum Talimatları

### 1. N8N'e Import
```bash
# N8N kurulumundan sonra
npx n8n import:workflow --input=/workspace/n8n/workflows/report_generator.json
```

Veya N8N UI üzerinden:
- N8N Dashboard'a git
- "Import from file" seçeneğini kullan
- `report_generator.json` dosyasını seç

### 2. Credential'ları Yapılandır

#### Supabase Credentials
1. N8N Dashboard → Settings → Credentials
2. "Supabase" credential'ı oluştur
3. Aşağıdaki bilgileri gir:
   ```
   URL: https://qlcbobvbircjhlglhfhr.supabase.co
       ANON_KEY: <supabase dashboard'dan alin>
   ```

#### Claude API Credentials
1. Anthropic Console'dan API key al: https://console.anthropic.com/
2. N8N'de "HTTP Header Auth" credential'ı oluştur
3. Aşağıdaki bilgileri gir:
   ```
   Name: x-api-key
   Value: YOUR_CLAUDE_API_KEY
   ```

#### SMTP Email Credentials
1. N8N'de "SMTP" credential'ı oluştur
2. Email provider ayarlarını gir:
   ```
   Host: your-smtp-server.com
   Port: 587
   Security: STARTTLS
   Username: your-email@botfusions.com
   Password: your-email-password
   ```

### 3. Workflow'u Aktifleştir
1. N8N Dashboard'da workflow'u bul
2. "Active" toggle'ını aç
3. Test etmek için "Execute Workflow" butonuna tıkla

## ⚙️ Yapılandırma

### Zamanlama Değiştirme
`Weekly Report Trigger` node'unda cron ifadesini değiştir:
- Günlük: `0 9 * * *`
- Aylık: `0 9 1 * *`
- Haftalık (mevcut): `0 9 * * 1`

### Email Alıcıları
Environment variable ekle:
```bash
export REPORT_RECIPIENTS="admin@botfusions.com,manager@botfusions.com"
```

### Database Tabloları
Workflow şu tabloları okur:
- `metrics` - Performans metrikleri
- `competitors` - Rakip analiz verileri  
- `keywords` - Anahtar kelime verileri

Rapor şu tabloya kaydedilir:
- `reports` - Generated reports

## 📊 Rapor İçeriği

Oluşturulan rapor şunları içerir:
- Haftalık performans özeti
- Toplanan metrics sayısı
- Rakip analizi sayısı
- Anahtar kelime performansı
- Claude API ile AI destekli analiz
- Öneriler ve aksiyonlar
- Professional HTML tasarım

## 🔧 Troubleshooting

### Credential Hataları
- Supabase connection timeout → Connection string'i kontrol et
- Claude API error → API key'in geçerli olduğunu doğrula
- Email error → SMTP settings'i kontrol et

### Veri Alım Hataları
- Empty metrics data → Database'de son 7 gün verisi var mı kontrol et
- Permission denied → RLS policies kontrol et
- Table not found → Tablo adlarını doğrula

### Workflow Çalışmıyor
- Active toggle açık mı kontrol et
- Cron trigger zamanını doğrula
- Error logs'u N8N'de kontrol et

## 📈 Gelişmiş Özellikler

### PDF Export
HTML raporu PDF'e dönüştürmek için:
1. `Generate HTML Report` node'undan sonra
2. HTML-to-PDF service ekleyebilirsin (örn: Puppeteer)

### Dashboard Integration
Supabase'den en son raporu çekmek için API endpoint ekleyebilirsin:

```sql
-- Son raporu getir
SELECT * FROM reports 
WHERE period = 'weekly' 
ORDER BY generated_at DESC 
LIMIT 1;
```

### Custom Metrics
Yeni metrics eklemek için:
1. `Get Metrics Data` node'unu kopyala
2. Yeni tablo adını gir
3. Ana workflow'a bağla

## 📞 Destek

Sorular için:
- N8N Documentation: https://docs.n8n.io/
- Supabase Docs: https://supabase.com/docs
- Claude API Docs: https://docs.anthropic.com/

## 🔄 Güncellemeler

v1.0.0 - İlk sürüm
- Temel rapor oluşturma
- Email gönderimi
- Database kaydı

---

Bu workflow Botfusions Dashboard ekibi tarafından geliştirilmiştir.