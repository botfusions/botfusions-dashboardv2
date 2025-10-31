# Botfusions Competitor Monitor N8N Workflow Kurulum Rehberi

## 📋 Genel Bakış

Bu workflow Botfusions Dashboard için rakip firmaların web sitelerini izleyerek günlük fiyat, stok ve kampanya bilgilerini toplar ve analiz eder.

## 🚀 Kurulum Adımları

### 1. Supabase Veritabanı Kurulumu

1. Supabase projenizde (https://qlcbobvbircjhlglhfhr.supabase.co) oturum açın
2. SQL Editor'da `supabase_schema.sql` dosyasını çalıştırarak tabloları oluşturun
3. `competitors` tablosuna rakiplerinizi ekleyin:
   ```sql
   INSERT INTO competitors (name, url, scraping_selectors) VALUES 
   ('Rakip Adı', 'https://rakip-site.com', 
    '{"price_selector": "price.*?([\\d.,]+)", "stock_selector": "stokta|available"}'::jsonb);
   ```

### 2. N8N Workflow İmportu

1. N8N instance'ınızda oturum açın
2. "Import from file" seçeneğini kullanın
3. `competitor_monitor.json` dosyasını seçin ve import edin

### 3. Credentials Yapılandırması

#### Supabase Credentials
1. Workflow'da "Botfusions Supabase" credential'ını düzenleyin:
   - **Host**: `qlcbobvbircjhlglhfhr.supabase.co`
   - **ANON Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsY2JvYnZiaXJjamhsZ2xoZmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MzM5NjgsImV4cCI6MjA3NzMwOTk2OH0.jXK8NBYMGgYgUFGCTAvpi5q-3SJ5UQLHhOerRXr3FzE`
   - **Service Role Key**: Supabase dashboard'tan alın (gerekirse)

#### SMTP Credentials
1. Email gönderimi için SMTP ayarları yapın:
   - **Host**: Gmail/Outlook SMTP host'unuz
   - **Port**: 587 (TLS) veya 465 (SSL)
   - **Username**: Email adresiniz
   - **Password**: App password'unuz

### 4. Workflow Aktivasyonu

1. Workflow'u aktive edin (Activate toggle)
2. Schedule Trigger her sabah 08:00'da çalışacak şekilde ayarlanmıştır
3. Test için manuel olarak çalıştırabilirsiniz

## ⚙️ Özellikler

### 🔄 Otomatik İzleme
- **Zamanlama**: Her sabah 08:00'da otomatik çalışır
- **Veri Toplama**: Web scraping ile rakip fiyat, stok ve kampanya bilgilerini toplar
- **Veri Depolama**: Supabase'de historical data saklanır

### 📊 Fiyat Analizi
- **Değişiklik Tespiti**: %5'ten fazla fiyat değişikliklerinde otomatik alert
- **Trend Analizi**: 7 günlük fiyat geçmişi karşılaştırması
- **Görsel Bildirimler**: Email ile anlık bildirimler

### 📈 Günlük Raporlar
- **HTML Raporları**: Görsel ve detaylı günlük raporlar
- **İstatistikler**: Toplam rakip, aktif rakip, stok durumu
- **Otomatik Gönderim**: Management ekibine email ile günlük rapor

### 🔧 Esnek Yapılandırma
- **CSS Selectors**: Her rakip için özel scraping kuralları
- **Custom Logic**: JavaScript kodları ile özelleştirilebilir
- **Esnek Zamanlama**: Cron expression ile özelleştirilebilir

## 📝 Kullanım

### Yeni Rakip Ekleme
```sql
INSERT INTO competitors (name, url, scraping_selectors) VALUES 
(
    'Yeni Rakip',
    'https://yeni-rakip.com',
    '{
        "price_selector": "\\$([\\d.,]+)", 
        "stock_selector": "in stock|out of stock",
        "campaign_selector": "sale|discount|promo"
    }'::jsonb
);
```

### Scraping Selectors Açıklaması
- **price_selector**: Fiyat bilgisini yakalayan regex pattern
- **stock_selector**: Stok durumu için regex pattern  
- **campaign_selector**: Kampanya bilgisi için regex pattern

### Raporları Görüntüleme
1. Supabase dashboard'ta `daily_reports` tablosunu kontrol edin
2. HTML içeriği browser'da açarak görsel rapor inceleyin
3. Email gelen kutunuzdan günlük raporları takip edin

## 🔧 Troubleshooting

### Yaygın Sorunlar

1. **Scraping Hatası**
   - Rakip sitenin robots.txt dosyasını kontrol edin
   - User-Agent header'ını güncelleyin
   - Rate limiting ekleyin

2. **Email Gönderim Sorunu**
   - SMTP ayarlarınızı kontrol edin
   - App password kullandığınızdan emin olun
   - Firewall ayarlarını kontrol edin

3. **Supabase Connection**
   - API key'lerin doğru olduğunu kontrol edin
   - Row Level Security policies'leri gözden geçirin

### Debug İpuçları
- Workflow execution logs'larını kontrol edin
- `raw_content` alanından scraping sonuçlarını inceleyin
- Console.log() ile JavaScript node'larında debug yapın

## 📞 Destek

Sorun yaşamanız durumunda:
1. N8N workflow logs'larını kontrol edin
2. Supabase logs'larını inceleyin
3. Network tab'ında HTTP request'leri kontrol edin

## 🔒 Güvenlik Notları

- ANON key'i production'da service role key ile değiştirin
- SMTP credentials'larını güvenli şekilde saklayın
- Web scraping yasalarını ve etik kuralları takip edin
- Rate limiting ekleyerek sunuculara aşırı yük bindirmeyin