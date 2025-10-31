/**
 * Bot Command Handlers
 * Botfusions Dashboard Telegram Bot command handlers (/start, /help, /status, /alerts)
 */

const TelegramSender = require('../utils/telegram-sender');
const templates = require('../templates/telegram-templates');
const { config, Helpers } = require('./telegram-config');

class BotCommands {
  constructor() {
    this.sender = new TelegramSender();
    this.subscriptions = new Map(); // userId -> subscription settings
  }

  /**
   * Command handler
   */
  async handleCommand(msg, command, args = []) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const firstName = msg.from.first_name || 'Kullanıcı';

    console.log(`Command received: ${command} from user ${userId}`);

    try {
      switch (command) {
        case '/start':
          return await this.handleStart(chatId, firstName);
        
        case '/help':
          return await this.handleHelp(chatId);
        
        case '/status':
          return await this.handleStatus(chatId);
        
        case '/alerts':
          return await this.handleAlerts(chatId);
        
        case '/unsubscribe':
          return await this.handleUnsubscribe(chatId);
        
        default:
          return await this.handleUnknown(chatId, command);
      }
    } catch (error) {
      console.error(`Error handling command ${command}:`, error);
      await this.sender.sendMessage(chatId, 
        `${Helpers.emojis.error} Komut işlenirken bir hata oluştu. Lütfen tekrar deneyin.`
      );
    }
  }

  /**
   * /start command handler
   */
  async handleStart(chatId, firstName) {
    // Kullanıcıyı kaydet
    await this.saveUser(chatId, firstName);
    
    // Hoş geldin mesajı gönder
    await this.sender.sendWelcomeMessage(chatId, firstName);
    
    // Admin bilgilendirme
    if (config.isAdmin(chatId)) {
      await this.sender.sendAdminNotification(
        'Yeni Kullanıcı',
        `${firstName} botu kullanmaya başladı.`,
        'info'
      );
    }
  }

  /**
   * /help command handler
   */
  async handleHelp(chatId) {
    const helpTemplate = templates.getHelpMenu();
    
    await this.sender.sendMessageWithKeyboard(
      chatId,
      helpTemplate.text,
      helpTemplate.keyboard.inline_keyboard
    );
  }

  /**
   * /status command handler
   */
  async handleStatus(chatId) {
    // Typing action göster
    await this.sender.sendChatAction(chatId, 'typing');

    try {
      // Dashboard durumunu al (mock data - gerçek API'den alınabilir)
      const statusData = await this.getDashboardStatus();
      
      await this.sender.sendStatusReport(chatId, statusData);
    } catch (error) {
      console.error('Status bilgisi alınırken hata:', error);
      await this.sender.sendMessage(chatId, 
        `${Helpers.emojis.error} Durum bilgisi alınırken hata oluştu.`
      );
    }
  }

  /**
   * /alerts command handler
   */
  async handleAlerts(chatId) {
    const userId = chatId;
    const subscription = this.subscriptions.get(userId) || this.getDefaultSubscription();

    const statusText = `
${Helpers.emojis.bell} *Bildirim Ayarların*

Mevcut durumun:
${subscription.system_alerts ? Helpers.emojis.check : Helpers.emojis.cross} Sistem Uyarıları
${subscription.status_updates ? Helpers.emojis.check : Helpers.emojis.cross} Durum Güncellemeleri  
${subscription.performance_alerts ? Helpers.emojis.check : Helpers.emojis.cross} Performans Uyarıları
${subscription.daily_summaries ? Helpers.emojis.check : Helpers.emojis.cross} Günlük Özetler
`;

    await this.sender.sendMessageWithKeyboard(
      chatId,
      statusText,
      [
        [
          { text: `${Helpers.emojis.alert} Sistem Uyarıları`, callback_data: 'toggle_system_alerts' }
        ],
        [
          { text: `${Helpers.emojis.status} Durum Güncellemeleri`, callback_data: 'toggle_status_updates' }
        ],
        [
          { text: `${Helpers.emojis.cross} Tümünü Kapat`, callback_data: 'unsubscribe_all' },
          { text: `${Helpers.emojis.settings} Tümünü Aç`, callback_data: 'subscribe_all' }
        ],
        [
          { text: `${Helpers.emojis.rocket} Ana Menüye Dön`, callback_data: 'main_menu' }
        ]
      ]
    );
  }

  /**
   * /unsubscribe command handler
   */
  async handleUnsubscribe(chatId) {
    const userId = chatId;
    
    // Mevcut aboneliği kapat
    this.subscriptions.set(userId, {
      system_alerts: false,
      status_updates: false,
      performance_alerts: false,
      daily_summaries: false,
      updated_at: new Date().toISOString()
    });

    await this.sender.sendMessageWithKeyboard(
      chatId,
      `
${Helpers.emojis.bellOff} *Bildirimler Kapatıldı*

Tüm bildirimler başarıyla durduruldu. 🎉

Yeniden abone olmak için:
• /alerts komutunu kullan
• Dashboard'tan ayarları değiştir

Tekrar görüşmek üzere! 👋
`,
      [
        [
          { text: `${Helpers.emojis.bell} Yeniden Abone Ol`, callback_data: 'subscribe_all' },
          { text: `${Helpers.emojis.rocket} Ana Menüye Dön`, callback_data: 'main_menu' }
        ]
      ]
    );

    // Admin bilgilendirme
    if (config.isAdmin(userId)) {
      await this.sender.sendAdminNotification(
        'Abonelik İptal Edildi',
        'Bir kullanıcı tüm bildirimleri durdurdu.',
        'info'
      );
    }
  }

  /**
   * Unknown command handler
   */
  async handleUnknown(chatId, command) {
    const errorMessage = `
${Helpers.emojis.error} *Bilinmeyen Komut*

"${command}" komutunu tanıyamadım.

${Helpers.emojis.info} Mevcut komutlar:
• /start - Botu başlat
• /help - Yardım menüsü  
• /status - Dashboard durumu
• /alerts - Uyarı ayarları
• /unsubscribe - Bildirimleri durdur

${Helpers.emojis.rocket} Yardım için /help komutunu kullanabilirsin.
`;

    await this.sender.sendMessageWithKeyboard(
      chatId,
      errorMessage,
      [
        [
          { text: `${Helpers.emojis.info} Yardım Menüsü`, callback_data: 'help' },
          { text: `${Helpers.emojis.rocket} Ana Menüye Dön`, callback_data: 'main_menu' }
        ]
      ]
    );
  }

  /**
   * Callback query handler
   */
  async handleCallbackQuery(query) {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const userId = query.from.id;
    const data = query.data;

    console.log(`Callback query: ${data} from user ${userId}`);

    try {
      // Ana menü işlemleri
      if (data === 'main_menu') {
        const menuTemplate = templates.getMainMenu();
        await this.sender.editMessage(
          messageId, 
          chatId, 
          menuTemplate.text,
          { reply_markup: { inline_keyboard: menuTemplate.keyboard.inline_keyboard } }
        );
        return;
      }

      // Yardım işlemleri
      if (data === 'help') {
        const helpTemplate = templates.getHelpMenu();
        await this.sender.editMessage(
          messageId,
          chatId,
          helpTemplate.text,
          { reply_markup: { inline_keyboard: helpTemplate.keyboard.inline_keyboard } }
        );
        return;
      }

      // Durum işlemleri
      if (data === 'status') {
        await this.handleStatus(chatId);
        await this.sender.editMessage(
          messageId,
          chatId,
          `${Helpers.emojis.status} Dashboard durum bilgisi gönderiliyor...`,
          { reply_markup: { inline_keyboard: [] } }
        );
        return;
      }

      // Bildirim ayarları
      if (data.startsWith('toggle_')) {
        await this.handleToggleSubscription(userId, data.replace('toggle_', ''));
        return await this.handleAlerts(chatId);
      }

      // Abonelik işlemleri
      if (data === 'subscribe_all') {
        await this.handleSubscribeAll(userId);
        return await this.handleAlerts(chatId);
      }

      if (data === 'unsubscribe_all') {
        await this.handleUnsubscribeAll(userId);
        return await this.handleAlerts(chatId);
      }

      // Diğer işlemler
      await this.sender.editMessage(
        messageId,
        chatId,
        `${Helpers.emojis.info} Bu özellik yakında eklenecek: ${data}`,
        { reply_markup: { inline_keyboard: [[{ text: 'Ana Menüye Dön', callback_data: 'main_menu' }]] } }
      );

    } catch (error) {
      console.error('Callback query error:', error);
    }
  }

  /**
   * Subscription toggle işlemi
   */
  async handleToggleSubscription(userId, subscriptionType) {
    const current = this.subscriptions.get(userId) || this.getDefaultSubscription();
    
    current[subscriptionType] = !current[subscriptionType];
    current.updated_at = new Date().toISOString();
    
    this.subscriptions.set(userId, current);
    
    console.log(`User ${userId} ${subscriptionType} ${current[subscriptionType] ? 'activated' : 'deactivated'}`);
  }

  /**
   * Tüm aboneliği aç
   */
  async handleSubscribeAll(userId) {
    this.subscriptions.set(userId, {
      ...this.getDefaultSubscription(),
      updated_at: new Date().toISOString()
    });

    console.log(`User ${userId} subscribed to all notifications`);
  }

  /**
   * Tüm aboneliği kapat
   */
  async handleUnsubscribeAll(userId) {
    this.subscriptions.set(userId, {
      system_alerts: false,
      status_updates: false,
      performance_alerts: false,
      daily_summaries: false,
      updated_at: new Date().toISOString()
    });

    console.log(`User ${userId} unsubscribed from all notifications`);
  }

  /**
   * Kullanıcı kaydet
   */
  async saveUser(chatId, firstName) {
    // Bu fonksiyonu veritabanı ile entegre edebilirsin
    console.log(`Saving user: ${chatId} - ${firstName}`);
  }

  /**
   * Varsayılan abonelik ayarları
   */
  getDefaultSubscription() {
    return {
      system_alerts: true,
      status_updates: false,
      performance_alerts: true,
      daily_summaries: true
    };
  }

  /**
   * Dashboard durum bilgisi al (Mock)
   */
  async getDashboardStatus() {
    // Bu fonksiyonu gerçek dashboard API'si ile entegre et
    return {
      overall_status: 'healthy',
      uptime: '7 gün 14 saat',
      active_connections: 142,
      total_requests: 15847,
      error_rate: 0.8,
      last_update: new Date().toLocaleString('tr-TR')
    };
  }

  /**
   * Kullanıcının abonelik durumunu kontrol et
   */
  getUserSubscription(userId) {
    return this.subscriptions.get(userId) || this.getDefaultSubscription();
  }

  /**
   * Bildirim gönderilecek kullanıcıları al
   */
  getSubscribedUsers(subscriptionType) {
    const subscribed = [];
    
    for (const [userId, settings] of this.subscriptions.entries()) {
      if (settings[subscriptionType]) {
        subscribed.push(userId);
      }
    }
    
    return subscribed;
  }
}

module.exports = BotCommands;