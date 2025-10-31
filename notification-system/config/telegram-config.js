/**
 * Telegram Bot Configuration
 * Botfusions Dashboard için Telegram Bot API ayarları ve helper fonksiyonları
 */

// Environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'your-bot-token-here';
const WEBHOOK_URL = process.env.TELEGRAM_WEBHOOK_URL || 'https://your-domain.com/api/telegram/webhook';
const ADMIN_USER_IDS = process.env.ADMIN_USER_IDS ? process.env.ADMIN_USER_IDS.split(',') : [];

// API endpoints
const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';
const TELEGRAM_FILE_BASE = 'https://api.telegram.org/file/bot';

class TelegramConfig {
  constructor() {
    this.botToken = TELEGRAM_BOT_TOKEN;
    this.baseURL = `${TELEGRAM_API_BASE}${this.botToken}`;
    this.fileURL = `${TELEGRAM_FILE_BASE}${this.botToken}`;
    this.webhookURL = WEBHOOK_URL;
    this.adminUserIds = ADMIN_USER_IDS.map(id => parseInt(id.trim())).filter(id => !isNaN(id));
  }

  /**
   * Bot token kontrolü
   */
  isValid() {
    return this.botToken && this.botToken !== 'your-bot-token-here' && this.botToken.length > 10;
  }

  /**
   * Admin kullanıcı kontrolü
   */
  isAdmin(userId) {
    return this.adminUserIds.includes(parseInt(userId));
  }

  /**
   * API endpoint oluştur
   */
  getEndpoint(method) {
    return `${this.baseURL}/${method}`;
  }

  /**
   * File download URL oluştur
   */
  getFileUrl(filePath) {
    return `${this.fileURL}/${filePath}`;
  }

  /**
   * Webhook URL oluştur
   */
  setWebhook() {
    return {
      url: this.webhookURL,
      allowed_updates: ['message', 'callback_query', 'edited_message']
    };
  }

  /**
   * Bot info al
   */
  async getBotInfo() {
    try {
      const response = await fetch(this.getEndpoint('getMe'));
      const data = await response.json();
      
      if (data.ok) {
        return {
          id: data.result.id,
          first_name: data.result.first_name,
          username: data.result.username,
          can_join_groups: data.result.can_join_groups,
          can_read_all_group_messages: data.result.can_read_all_group_messages,
          supports_inline_queries: data.result.supports_inline_queries
        };
      }
      
      throw new Error(data.description || 'Bot bilgileri alınamadı');
    } catch (error) {
      console.error('Bot bilgileri alınırken hata:', error);
      throw error;
    }
  }

  /**
   * Webhook durumunu kontrol et
   */
  async getWebhookInfo() {
    try {
      const response = await fetch(this.getEndpoint('getWebhookInfo'));
      const data = await response.json();
      return data.ok ? data.result : null;
    } catch (error) {
      console.error('Webhook bilgileri alınırken hata:', error);
      return null;
    }
  }

  /**
   * Webhook sil
   */
  async deleteWebhook() {
    try {
      const response = await fetch(this.getEndpoint('deleteWebhook'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drop_pending_updates: true })
      });
      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Webhook silinirken hata:', error);
      return false;
    }
  }

  /**
   * Webhook ayarla
   */
  async setWebhookConfig() {
    try {
      const response = await fetch(this.getEndpoint('setWebhook'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.setWebhook())
      });
      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Webhook ayarlanırken hata:', error);
      return false;
    }
  }
}

// Helper fonksiyonlar
const Helpers = {
  /**
   * Chat ID kontrolü
   */
  isValidChatId(chatId) {
    return typeof chatId === 'number' && chatId > 0;
  },

  /**
   * Mesaj format kontrolü
   */
  isValidMessage(text) {
    return typeof text === 'string' && text.length > 0 && text.length <= 4096;
  },

  /**
   * User ID kontrolü
   */
  isValidUserId(userId) {
    return typeof userId === 'number' && userId > 0;
  },

  /**
   * Keyboard button oluştur
   */
  createButton(text, callback_data, type = 'callback_data') {
    return {
      text,
      [type]: callback_data
    };
  },

  /**
   * Inline keyboard oluştur
   */
  createInlineKeyboard(buttons, columns = 1) {
    const rows = [];
    for (let i = 0; i < buttons.length; i += columns) {
      rows.push(buttons.slice(i, i + columns));
    }
    return {
      inline_keyboard: rows
    };
  },

  /**
   * Reply keyboard oluştur
   */
  createReplyKeyboard(buttons, resize_keyboard = true, one_time_keyboard = false) {
    return {
      keyboard: buttons,
      resize_keyboard,
      one_time_keyboard
    };
  },

  /**
   * Remove keyboard oluştur
   */
  removeKeyboard() {
    return {
      remove_keyboard: true
    };
  },

  /**
   * Parse mode ayarla
   */
  getParseMode() {
    return 'Markdown';
  },

  /**
   * Emoji helper
   */
  emojis: {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    rocket: '🚀',
    bell: '🔔',
    bellOff: '🔕',
    settings: '⚙️',
    status: '📊',
    user: '👤',
    chat: '💬',
    alert: '🚨',
    check: '✔️',
    cross: '✖️',
    up: '⬆️',
    down: '⬇️',
    star: '⭐',
    heart: '❤️'
  }
};

// Export
module.exports = {
  TelegramConfig,
  Helpers,
  config: new TelegramConfig()
};