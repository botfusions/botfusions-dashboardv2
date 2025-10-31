/**
 * Telegram Message Templates
 * Botfusions Dashboard için hazır mesaj şablonları (Markdown format)
 */

const { Helpers } = require('../config/telegram-config');

class TelegramTemplates {
  constructor() {
    this.emojis = Helpers.emojis;
  }

  /**
   * Ana menü şablonu
   */
  getMainMenu() {
    return {
      text: `
${this.emojis.rocket} *Botfusions Dashboard*

Ana menüden istediğin işlemi seçebilirsin:

${this.emojis.status} *Durum & İstatistikler*
${this.emojis.bell} *Bildirim Yönetimi*  
${this.emojis.settings} *Ayarlar*
${this.emojis.alert} *Uyarılar*
${this.emojis.chat} *Destek*

Ne yapmak istiyorsun?
`,
      keyboard: {
        inline_keyboard: [
          [
            { text: `${this.emojis.status} Dashboard Durumu`, callback_data: 'status' },
            { text: `${this.emojis.bell} Bildirimler`, callback_data: 'notifications' }
          ],
          [
            { text: `${this.emojis.settings} Ayarlar`, callback_data: 'settings' },
            { text: `${this.emojis.alert} Uyarılar`, callback_data: 'alerts' }
          ],
          [
            { text: `${this.emojis.info} Yardım`, callback_data: 'help' }
          ]
        ]
      }
    };
  }

  /**
   * Yardım menüsü şablonu
   */
  getHelpMenu() {
    return {
      text: `
${this.emojis.info} *Yardım Menüsü*

*Bot Komutları:*
${this.emojis.user} /start - Botu başlat
${this.emojis.info} /help - Bu menüyü göster
${this.emojis.status} /status - Dashboard durumunu göster
${this.emojis.bell} /alerts - Uyarı ayarları
${this.emojis.cross} /unsubscribe - Bildirimleri durdur

*Inline Keyboard Butonları:*
${this.emojis.rocket} Dashboard Durumu - Sistem durumunu gösterir
${this.emojis.bell} Bildirimler - Bildirim ayarlarını açar
${this.emojis.settings} Ayarlar - Bot ayarları
${this.emojis.alert} Uyarılar - Uyarı yönetimi
${this.emojis.info} Yardım - Bu menüyü tekrar göster

*Daha fazla yardım için:*
Telegram: @botfusions_support
E-posta: support@botfusions.com
`,
      keyboard: {
        inline_keyboard: [
          [
            { text: `${this.emojis.rocket} Ana Menü`, callback_data: 'main_menu' },
            { text: `${this.emojis.status} Durumu Gör`, callback_data: 'status' }
          ]
        ]
      }
    };
  }

  /**
   * Durum menüsü şablonu
   */
  getStatusMenu() {
    return {
      text: `
${this.emojis.status} *Dashboard Durum Menüsü*

Hangi bilgileri görmek istiyorsun?
`,
      keyboard: {
        inline_keyboard: [
          [
            { text: `${this.emojis.info} Genel Durum`, callback_data: 'status_overview' },
            { text: `${this.emojis.rocket} Sistem İstatistikleri`, callback_data: 'system_stats' }
          ],
          [
            { text: `${this.emojis.bell} Uyarı Geçmişi`, callback_data: 'alert_history' },
            { text: `${this.emojis.up} Performans Metrikleri`, callback_data: 'performance' }
          ],
          [
            { text: `${this.emojis.settings} Detaylı Rapor`, callback_data: 'detailed_report' },
            { text: `${this.emojis.heart} Sağlık Skoru`, callback_data: 'health_score' }
          ],
          [
            { text: `${this.emojis.rocket} Ana Menüye Dön`, callback_data: 'main_menu' }
          ]
        ]
      }
    };
  }

  /**
   * Bildirim ayarları şablonu
   */
  getNotificationSettings() {
    return {
      text: `
${this.emojis.bell} *Bildirim Ayarları*

Hangi bildirimleri almak istiyorsun?
`,
      keyboard: {
        inline_keyboard: [
          [
            { text: `${this.emojis.alert} Sistem Uyarıları`, callback_data: 'toggle_system_alerts' },
            { text: `${this.emojis.status} Durum Güncellemeleri`, callback_data: 'toggle_status_updates' }
          ],
          [
            { text: `${this.emojis.rocket} Performans Uyarıları`, callback_data: 'toggle_performance_alerts' },
            { text: `${this.emojis.heart} Günlük Özetler`, callback_data: 'toggle_daily_summaries' }
          ],
          [
            { text: `${this.emojis.cross} Bildirimleri Durdur`, callback_data: 'unsubscribe_all' },
            { text: `${this.emojis.settings} Tümünü Aç`, callback_data: 'subscribe_all' }
          ],
          [
            { text: `${this.emojis.rocket} Ana Menüye Dön`, callback_data: 'main_menu' }
          ]
        ]
      }
    };
  }

  /**
   * Ayarlar menüsü şablonu
   */
  getSettingsMenu() {
    return {
      text: `
${this.emojis.settings} *Ayarlar Menüsü*

Bot ayarlarını buradan yönetebilirsin:
`,
      keyboard: {
        inline_keyboard: [
          [
            { text: `${this.emojis.bell} Bildirim Ayarları`, callback_data: 'notification_settings' },
            { text: `${this.emojis.status} Durum Sıklığı`, callback_data: 'status_frequency' }
          ],
          [
            { text: `${this.emojis.alert} Uyarı Eşikleri`, callback_data: 'alert_thresholds' },
            { text: `${this.emojis.heart} Tercihler`, callback_data: 'preferences' }
          ],
          [
            { text: `${this.emojis.user} Hesap Bilgileri`, callback_data: 'account_info' },
            { text: `${this.emojis.chat} Destek`, callback_data: 'support' }
          ],
          [
            { text: `${this.emojis.cross} Botu Durdur`, callback_data: 'stop_bot' },
            { text: `${this.emojis.rocket} Ana Menüye Dön`, callback_data: 'main_menu' }
          ]
        ]
      }
    };
  }

  /**
   * Başarı mesajı şablonu
   */
  getSuccessMessage(action) {
    return {
      text: `
${this.emojis.success} *İşlem Başarılı!*

${action} işlemi başarıyla tamamlandı.

${this.emojis.rocket} Ana menüye dönmek için butona tıklayabilirsin.
`,
      keyboard: {
        inline_keyboard: [
          [
            { text: `${this.emojis.rocket} Ana Menüye Dön`, callback_data: 'main_menu' },
            { text: `${this.emojis.settings} Ayarlar`, callback_data: 'settings' }
          ]
        ]
      }
    };
  }

  /**
   * Hata mesajı şablonu
   */
  getErrorMessage(errorMessage) {
    return {
      text: `
${this.emojis.error} *Hata Oluştu*

${errorMessage}

${this.emojis.info} Lütfen tekrar deneyebilir veya destek ile iletişime geçebilirsin.
`,
      keyboard: {
        inline_keyboard: [
          [
            { text: `${this.emojis.rocket} Tekrar Dene`, callback_data: 'retry' },
            { text: `${this.emojis.chat} Destek İle İletişim`, callback_data: 'contact_support' }
          ],
          [
            { text: `${this.emojis.rocket} Ana Menüye Dön`, callback_data: 'main_menu' }
          ]
        ]
      }
    };
  }

  /**
   * Onay mesajı şablonu
   */
  getConfirmationMessage(action, description) {
    return {
      text: `
${this.emojis.info} *İşlem Onayı*

${description}

${action} işlemini onaylıyor musun?
`,
      keyboard: {
        inline_keyboard: [
          [
            { text: `${this.emojis.check} Onayla`, callback_data: `confirm_${action.toLowerCase().replace(/\s+/g, '_')}` },
            { text: `${this.emojis.cross} İptal Et`, callback_data: 'cancel' }
          ]
        ]
      }
    };
  }

  /**
   * Dashboard performans raporu şablonu
   */
  getPerformanceReport(data) {
    const {
      cpu_usage,
      memory_usage,
      active_connections,
      response_time,
      throughput,
      uptime
    } = data;

    return {
      text: `
${this.emojis.rocket} *Performans Raporu*

${this.emojis.cpu || '💻'} *CPU Kullanımı:* ${cpu_usage}%
${this.emojis.memory || '🧠'} *Bellek Kullanımı:* ${memory_usage}%
${this.emojis.chat} *Aktif Bağlantılar:* ${active_connections}
${this.emojis.up} *Yanıt Süresi:* ${response_time}ms
${this.emojis.rocket} *İşlem Hızı:* ${throughput} istek/saniye
${this.emojis.up} *Çalışma Süresi:* ${uptime}

${this.emojis.heart} *Sistem Durumu:* Sağlıklı
`,
      keyboard: {
        inline_keyboard: [
          [
            { text: `${this.emojis.status} Detaylı Metrikler`, callback_data: 'detailed_metrics' },
            { text: `${this.emojis.alert} Uyarı Ayarları`, callback_data: 'alert_thresholds' }
          ],
          [
            { text: `${this.emojis.rocket} Durum Menüsüne Dön`, callback_data: 'status_menu' }
          ]
        ]
      }
    };
  }

  /**
   * Günlük özet şablonu
   */
  getDailySummaryTemplate(date, data) {
    const {
      total_requests,
      success_rate,
      peak_usage_time,
      most_used_feature,
      error_count,
      active_users
    } = data;

    return {
      text: `
📊 *Günlük Özet - ${date}*

${this.emojis.rocket} *İstatistikler:*
• Toplam İstek: ${total_requests}
• Başarı Oranı: ${success_rate}%
• Aktif Kullanıcı: ${active_users}
• Hata Sayısı: ${error_count}

${this.emojis.star} *En Popüler Özellik:* ${most_used_feature}
${this.emojis.up} *Yoğunluk Zamanı:* ${peak_usage_time}

${this.emojis.heart} Sistem genel olarak iyi performans gösteriyor! 🌟
`,
      keyboard: {
        inline_keyboard: [
          [
            { text: `${this.emojis.info} Detaylı Analiz`, callback_data: 'daily_detailed_analysis' },
            { text: `${this.emojis.settings} Rapor Ayarları`, callback_data: 'report_settings' }
          ],
          [
            { text: `${this.emojis.rocket} Ana Menüye Dön`, callback_data: 'main_menu' }
          ]
        ]
      }
    };
  }

  /**
   * Sistem uyarısı şablonu
   */
  getSystemAlert(alertType, message, details = {}) {
    const alertEmojis = {
      critical: '🚨',
      error: this.emojis.error,
      warning: this.emojis.warning,
      info: this.emojis.info
    };

    const emoji = alertEmojis[alertType] || alertEmojis.info;
    const timestamp = new Date().toLocaleString('tr-TR');

    let alertText = `${emoji} *${alertType.toUpperCase()} UYARI*\n\n${message}\n\n⏰ *Zaman:* ${timestamp}`;
    
    if (Object.keys(details).length > 0) {
      alertText += `\n\n*Detaylar:*`;
      for (const [key, value] of Object.entries(details)) {
        alertText += `\n• ${key}: ${value}`;
      }
    }

    return {
      text: alertText,
      keyboard: {
        inline_keyboard: [
          [
            { text: `${this.emojis.check} Çözüldü Olarak İşaretle`, callback_data: `resolve_alert_${Date.now()}` },
            { text: `${this.emojis.settings} Ayarlar`, callback_data: 'alert_settings' }
          ],
          [
            { text: `${this.emojis.info} Detaylı Bilgi`, callback_data: `alert_details_${Date.now()}` },
            { text: `${this.emojis.rocket} Ana Menüye Dön`, callback_data: 'main_menu' }
          ]
        ]
      }
    };
  }
}

module.exports = new TelegramTemplates();