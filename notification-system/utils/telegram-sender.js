/**
 * Telegram Message Sender
 * Botfusions Dashboard için Telegram mesaj gönderim fonksiyonları
 */

const { config, Helpers } = require('../config/telegram-config');

class TelegramSender {
  constructor() {
    this.botToken = config.botToken;
    this.baseURL = config.baseURL;
  }

  /**
   * Genel API request metodu
   */
  async request(method, data = {}) {
    try {
      const response = await fetch(`${this.baseURL}/${method}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!result.ok) {
        throw new Error(`Telegram API Error: ${result.error_code} - ${result.description}`);
      }
      
      return result.result;
    } catch (error) {
      console.error(`Telegram API Request Error (${method}):`, error);
      throw error;
    }
  }

  /**
   * Basit mesaj gönder
   */
  async sendMessage(chatId, text, options = {}) {
    if (!Helpers.isValidChatId(chatId)) {
      throw new Error('Geçersiz Chat ID');
    }

    if (!Helpers.isValidMessage(text)) {
      throw new Error('Geçersiz mesaj içeriği');
    }

    const messageData = {
      chat_id: chatId,
      text: text,
      parse_mode: Helpers.getParseMode(),
      ...options
    };

    return await this.request('sendMessage', messageData);
  }

  /**
   * Inline keyboard ile mesaj gönder
   */
  async sendMessageWithKeyboard(chatId, text, inlineKeyboard, options = {}) {
    const keyboard = {
      reply_markup: {
        inline_keyboard: inlineKeyboard
      }
    };

    return await this.sendMessage(chatId, text, { ...options, ...keyboard });
  }

  /**
   * Admin bildirim mesajı gönder
   */
  async sendAdminNotification(title, message, priority = 'info') {
    const emojis = {
      info: Helpers.emojis.info,
      warning: Helpers.emojis.warning,
      error: Helpers.emojis.error,
      success: Helpers.emojis.success
    };

    const emoji = emojis[priority] || emojis.info;
    const text = `${emoji} *${title}*\n\n${message}`;

    // Tüm admin kullanıcılara gönder
    const promises = config.adminUserIds.map(adminId => 
      this.sendMessage(adminId, text)
    );

    try {
      const results = await Promise.allSettled(promises);
      return {
        sent: results.filter(r => r.status === 'fulfilled').length,
        failed: results.filter(r => r.status === 'rejected').length,
        errors: results.filter(r => r.status === 'rejected').map(r => r.reason.message)
      };
    } catch (error) {
      console.error('Admin bildirim gönderilirken hata:', error);
      throw error;
    }
  }

  /**
   * Kullanıcıya hoş geldin mesajı gönder
   */
  async sendWelcomeMessage(chatId, userFirstName) {
    const welcomeText = `
${Helpers.emojis.rocket} *Hoş Geldin, ${userFirstName}!*

Botfusions Dashboard bildirim sistemine hoş geldin! 🎉

Aşağıdaki özelliklerden yararlanabilirsin:
• Gerçek zamanlı bildirimler
• Dashboard durum güncellemeleri  
• Sistem uyarıları ve alarmlar
• İstatistik raporları

${Helpers.emojis.settings} *Komutlar:*
• /help - Yardım menüsü
• /status - Dashboard durumu
• /alerts - Uyarı ayarları
• /unsubscribe - Bildirimleri durdur

Başlamak için /help komutunu kullanabilirsin.
`;

    return await this.sendMessage(chatId, welcomeText, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: `${Helpers.emojis.status} Dashboard Durumu`, callback_data: 'status' },
            { text: `${Helpers.emojis.settings} Ayarlar`, callback_data: 'settings' }
          ],
          [
            { text: `${Helpers.emojis.bell} Bildirimleri Yönet`, callback_data: 'manage_alerts' }
          ]
        ]
      }
    });
  }

  /**
   * Dashboard durum raporu gönder
   */
  async sendStatusReport(chatId, statusData) {
    const {
      overall_status,
      uptime,
      active_connections,
      total_requests,
      error_rate,
      last_update
    } = statusData;

    const statusEmoji = overall_status === 'healthy' ? Helpers.emojis.success : 
                       overall_status === 'warning' ? Helpers.emojis.warning : 
                       Helpers.emojis.error;

    const statusText = `
${Helpers.emojis.status} *Dashboard Durum Raporu*

${statusEmoji} *Genel Durum:* ${overall_status.toUpperCase()}
${Helpers.emojis.up} *Çalışma Süresi:* ${uptime}
${Helpers.emojis.chat} *Aktif Bağlantılar:* ${active_connections}
${Helpers.emojis.rocket} *Toplam İstekler:* ${total_requests}
${Helpers.emojis.warning} *Hata Oranı:* ${error_rate}%
${Helpers.emojis.info} *Son Güncelleme:* ${last_update}
`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: `${Helpers.emojis.bell} Uyarıları Aç`, callback_data: 'alerts_on' },
          { text: `${Helpers.emojis.bellOff} Uyarıları Kapat`, callback_data: 'alerts_off' }
        ],
        [
          { text: `${Helpers.emojis.settings} Detaylı Rapor`, callback_data: 'detailed_report' }
        ]
      ]
    };

    return await this.sendMessage(chatId, statusText, { reply_markup: keyboard });
  }

  /**
   * Uyarı mesajı gönder
   */
  async sendAlert(chatId, alertType, message, data = {}) {
    const alertEmojis = {
      error: Helpers.emojis.error,
      warning: Helpers.emojis.warning,
      critical: '🚨',
      info: Helpers.emojis.info
    };

    const emoji = alertEmojis[alertType] || alertEmojis.info;
    const timestamp = new Date().toLocaleString('tr-TR');

    let alertText = `${emoji} *${alertType.toUpperCase()} UYARI*\n\n${message}`;
    
    if (Object.keys(data).length > 0) {
      alertText += `\n\n*Detaylar:*\n`;
      for (const [key, value] of Object.entries(data)) {
        alertText += `• ${key}: ${value}\n`;
      }
    }
    
    alertText += `\n⏰ *Zaman:* ${timestamp}`;

    return await this.sendMessage(chatId, alertText, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: `${Helpers.emojis.check} Çözüldü`, callback_data: `resolve_${data.alert_id || 'unknown'}` },
            { text: `${Helpers.emojis.settings} Ayarlar`, callback_data: 'alert_settings' }
          ]
        ]
      }
    });
  }

  /**
   * Günlük özet raporu gönder
   */
  async sendDailySummary(chatId, summaryData) {
    const {
      date,
      total_requests,
      successful_requests,
      failed_requests,
      average_response_time,
      top_features,
      system_health_score
    } = summaryData;

    const summaryText = `
📊 *Günlük Özet Raporu - ${date}*

${Helpers.emojis.rocket} *İstatistikler:*
• Toplam İstek: ${total_requests}
• Başarılı: ${successful_requests} (${Math.round((successful_requests/total_requests)*100)}%)
• Başarısız: ${failed_requests}
• Ortalama Yanıt Süresi: ${average_response_time}ms

${Helpers.emojis.star} *En Popüler Özellikler:*
${top_features.map(feature => `• ${feature.name} (${feature.count} kullanım)`).join('\n')}

${Helpers.emojis.heart} *Sistem Sağlık Skoru:* ${system_health_score}/100

Yarın görüşmek üzere! 🌟
`;

    return await this.sendMessage(chatId, summaryText, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: `${Helpers.emojis.info} Detaylı Rapor`, callback_data: 'detailed_daily_report' },
            { text: `${Helpers.emojis.settings} Ayarlar`, callback_data: 'settings' }
          ]
        ]
      }
    });
  }

  /**
   * Mesajı düzenle
   */
  async editMessage(messageId, chatId, text, options = {}) {
    const messageData = {
      message_id: messageId,
      chat_id: chatId,
      text: text,
      parse_mode: Helpers.getParseMode(),
      ...options
    };

    return await this.request('editMessageText', messageData);
  }

  /**
   * Mesaj yanıtını sil
   */
  async deleteMessage(chatId, messageId) {
    return await this.request('deleteMessage', {
      chat_id: chatId,
      message_id: messageId
    });
  }

  /**
   * Chat action gönder (typing, upload_photo, vs.)
   */
  async sendChatAction(chatId, action = 'typing') {
    return await this.request('sendChatAction', {
      chat_id: chatId,
      action: action
    });
  }
}

module.exports = TelegramSender;