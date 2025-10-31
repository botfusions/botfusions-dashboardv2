/**
 * Telegram Webhook Handler
 * Botfusions Dashboard için Telegram webhook handler
 */

const BotCommands = require('../config/bot-commands');
const { config } = require('../config/telegram-config');

class TelegramWebhookHandler {
  constructor() {
    this.commands = new BotCommands();
    this.allowedUsers = new Set(); // İzin verilen kullanıcı ID'leri
    this.blockedUsers = new Set(); // Engellenen kullanıcı ID'leri
  }

  /**
   * Ana webhook handler
   */
  async handleWebhook(update) {
    try {
      console.log('Webhook update received:', update.update_id);

      // Update tipine göre yönlendirme
      if (update.message) {
        await this.handleMessage(update.message);
      } else if (update.callback_query) {
        await this.handleCallbackQuery(update.callback_query);
      } else if (update.edited_message) {
        await this.handleEditedMessage(update.edited_message);
      } else {
        console.log('Unhandled update type:', update);
      }

    } catch (error) {
      console.error('Webhook handler error:', error);
      
      // Hata durumunda admin'e bildir
      if (config.adminUserIds.length > 0) {
        const adminId = config.adminUserIds[0];
        await this.sendErrorNotification(adminId, error, update);
      }
    }
  }

  /**
   * Mesaj işleme
   */
  async handleMessage(message) {
    const chatId = message.chat.id;
    const userId = message.from.id;
    const firstName = message.from.first_name || 'Kullanıcı';
    const lastName = message.from.last_name || '';
    const username = message.from.username || '';

    // Kullanıcı kontrolü
    if (this.isBlocked(userId)) {
      console.log(`Blocked user ${userId} tried to access bot`);
      return;
    }

    if (!this.isAllowed(userId) && !config.isAdmin(userId)) {
      console.log(`User ${userId} is not allowed to access bot`);
      await this.sendAccessDeniedMessage(chatId, firstName);
      return;
    }

    // Komut kontrolü
    if (message.text && message.text.startsWith('/')) {
      const [command, ...args] = message.text.split(' ');
      await this.commands.handleCommand(message, command.toLowerCase(), args);
      return;
    }

    // Normal mesaj işleme
    await this.handleNormalMessage(message);
  }

  /**
   * Callback query işleme
   */
  async handleCallbackQuery(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const userId = callbackQuery.from.id;
    const messageId = callbackQuery.message.message_id;

    // Callback query'ye hemen yanıt ver
    await this.answerCallbackQuery(callbackQuery.id);

    // Callback query işleme
    await this.commands.handleCallbackQuery(callbackQuery);
  }

  /**
   * Düzenlenmiş mesaj işleme
   */
  async handleEditedMessage(editedMessage) {
    // Düzenlenmiş mesajlar için özel işlem
    console.log('Edited message received:', editedMessage.message_id);
    
    // Bu kısım özel işlevsellik gerektirdiğinde kullanılabilir
  }

  /**
   * Normal mesaj işleme
   */
  async handleNormalMessage(message) {
    const chatId = message.chat.id;
    const userId = message.from.id;
    const firstName = message.from.first_name || 'Kullanıcı';
    const text = message.text || '';

    // Basit metin yanıtları
    const responses = {
      'merhaba': 'Merhaba! Botfusions Dashboard botuna hoş geldin! 👋',
      'teşekkürler': 'Rica ederim! Herhangi bir yardıma ihtiyacın olursa /help komutunu kullanabilirsin. 🤝',
      'yardım': 'Yardım için /help komutunu kullanabilirsin! 📚',
      'durum': 'Durum bilgisi için /status komutunu kullanabilirsin! 📊',
      'ayarlar': 'Ayarlar için /alerts komutunu kullanabilirsin! ⚙️'
    };

    const normalizedText = text.toLowerCase().trim();
    
    if (responses[normalizedText]) {
      const responseText = responses[normalizedText];
      
      // Keyboard ile yanıt gönder
      const sender = require('../utils/telegram-sender');
      const telegramSender = new sender();
      
      await telegramSender.sendMessageWithKeyboard(
        chatId,
        responseText,
        [
          [
            { text: '📚 Yardım', callback_data: 'help' },
            { text: '📊 Durum', callback_data: 'status' }
          ],
          [
            { text: '⚙️ Ayarlar', callback_data: 'settings' },
            { text: '🚀 Ana Menü', callback_data: 'main_menu' }
          ]
        ]
      );
      return;
    }

    // Eğer tanımlı yanıt yoksa genel yanıt gönder
    const sender = require('../utils/telegram-sender');
    const telegramSender = new sender();
    
    await telegramSender.sendMessageWithKeyboard(
      chatId,
      `
🤔 *Anlamadım...*

Bunu anlayamadım ama yardım edebilirim!

💡 *Kullanabileceğin komutlar:*
• /help - Yardım menüsü
• /status - Dashboard durumu  
• /alerts - Ayarlar
• durum, yardım, teşekkürler gibi basit mesajlar

${Helpers ? Helpers.emojis.rocket : '🚀'} Ana menüye gitmek için butona tıklayabilirsin.
`,
      [
        [
          { text: '📚 Yardım', callback_data: 'help' },
          { text: '🚀 Ana Menü', callback_data: 'main_menu' }
        ]
      ]
    );
  }

  /**
   * Callback query'ye yanıt ver
   */
  async answerCallbackQuery(callbackQueryId, text = '', showAlert = false) {
    try {
      const response = await fetch(`${config.baseURL}/answerCallbackQuery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callback_query_id: callbackQueryId,
          text: text,
          show_alert: showAlert
        })
      });

      const result = await response.json();
      if (!result.ok) {
        console.error('Answer callback query failed:', result.description);
      }
    } catch (error) {
      console.error('Error answering callback query:', error);
    }
  }

  /**
   * Erişim reddedildi mesajı gönder
   */
  async sendAccessDeniedMessage(chatId, firstName) {
    const sender = require('../utils/telegram-sender');
    const telegramSender = new sender();
    
    await telegramSender.sendMessage(
      chatId,
      `
${Helpers ? Helpers.emojis.cross : '❌'} *Erişim Reddedildi*

${firstName}, bu botu kullanma iznin bulunmuyor.

${Helpers ? Helpers.emojis.info : 'ℹ️'} *İzin almak için:*
• Sistem yöneticisine başvurun
• Admin ile iletişime geçin
• Doğru hesabı kullandığınızdan emin olun
`
    );
  }

  /**
   * Hata bildirimi gönder
   */
  async sendErrorNotification(adminId, error, update) {
    const sender = require('../utils/telegram-sender');
    const telegramSender = new sender();
    
    const errorText = `
🚨 *Bot Hatası*

*Zaman:* ${new Date().toLocaleString('tr-TR')}
*Hata:* ${error.message}
*Update ID:* ${update.update_id || 'Bilinmiyor'}
*Update Tipi:* ${Object.keys(update).join(', ')}

Lütfen logları kontrol edin.
`;

    await telegramSender.sendMessage(adminId, errorText, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔍 Detayları Gör', callback_data: `error_details_${Date.now()}` }
          ]
        ]
      }
    });
  }

  /**
   * Kullanıcı izni kontrolü
   */
  isAllowed(userId) {
    if (this.allowedUsers.size === 0) return true; // Boş liste = herkese açık
    
    return this.allowedUsers.has(userId.toString()) || 
           this.allowedUsers.has(parseInt(userId));
  }

  /**
   * Kullanıcı engelleme kontrolü
   */
  isBlocked(userId) {
    return this.blockedUsers.has(userId.toString()) || 
           this.blockedUsers.has(parseInt(userId));
  }

  /**
   * Kullanıcıyı izin verilenler listesine ekle
   */
  allowUser(userId) {
    this.allowedUsers.add(userId.toString());
    this.allowedUsers.add(parseInt(userId));
  }

  /**
   * Kullanıcıyı engellenenler listesine ekle
   */
  blockUser(userId) {
    this.blockedUsers.add(userId.toString());
    this.blockedUsers.add(parseInt(userId));
    this.allowedUsers.delete(userId.toString());
    this.allowedUsers.delete(parseInt(userId));
  }

  /**
   * Kullanıcıyı her iki listeden de çıkar
   */
  unblockUser(userId) {
    this.blockedUsers.delete(userId.toString());
    this.blockedUsers.delete(parseInt(userId));
  }

  /**
   * Tüm izin verilen kullanıcıları al
   */
  getAllowedUsers() {
    return Array.from(this.allowedUsers).map(id => parseInt(id));
  }

  /**
   * Tüm engellenen kullanıcıları al
   */
  getBlockedUsers() {
    return Array.from(this.blockedUsers).map(id => parseInt(id));
  }

  /**
   * İzin listelerini temizle
   */
  clearUserLists() {
    this.allowedUsers.clear();
    this.blockedUsers.clear();
  }

  /**
   * Webhook health check
   */
  async healthCheck() {
    try {
      const botInfo = await config.getBotInfo();
      return {
        status: 'healthy',
        bot: botInfo,
        timestamp: new Date().toISOString(),
        allowedUsers: this.getAllowedUsers(),
        blockedUsers: this.getBlockedUsers()
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = TelegramWebhookHandler;