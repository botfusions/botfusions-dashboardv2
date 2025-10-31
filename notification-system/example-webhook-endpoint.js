/**
 * Örnek Webhook Endpoint
 * Express.js ile Telegram webhook endpoint'i
 * 
 * Kullanım:
 * 1. Bu dosyayı Express projenize entegre edin
 * 2. Environment variables'ları ayarlayın
 * 3. Webhook URL'sini Telegram'a kaydedin
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Notification system dosyalarını import et
const TelegramWebhookHandler = require('./utils/webhook-handler');
const TelegramSender = require('./utils/telegram-sender');
const { config } = require('./config/telegram-config');

// Express app oluştur
const app = express();
const PORT = process.env.PORT || 3000;

// Güvenlik middleware'leri
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // 15 dakikada maksimum 100 istek
  message: {
    error: 'Too many requests, please try again later.'
  }
});

app.use('/api/telegram', limiter);

// JSON parser
app.use(express.json({
  limit: '1mb'
}));

// Telegram webhook handler
const webhookHandler = new TelegramWebhookHandler();
const sender = new TelegramSender();

// Ana webhook endpoint
app.post('/api/telegram/webhook', async (req, res) => {
  try {
    console.log(`Webhook received from Telegram`);
    
    // Update'i işle
    await webhookHandler.handleWebhook(req.body);
    
    // Başarı yanıtı
    res.status(200).json({
      status: 'success',
      message: 'Update processed successfully'
    });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Hata yanıtı
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Bot bilgisi endpoint'i
app.get('/api/telegram/bot-info', async (req, res) => {
  try {
    const botInfo = await config.getBotInfo();
    res.json({
      status: 'success',
      data: botInfo
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Webhook durumu endpoint'i
app.get('/api/telegram/webhook-info', async (req, res) => {
  try {
    const webhookInfo = await config.getWebhookInfo();
    res.json({
      status: 'success',
      data: webhookInfo
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Manuel mesaj gönderme endpoint'i
app.post('/api/telegram/send-message', async (req, res) => {
  try {
    const { chat_id, text, options } = req.body;
    
    if (!chat_id || !text) {
      return res.status(400).json({
        status: 'error',
        message: 'chat_id and text are required'
      });
    }
    
    const result = await sender.sendMessage(chat_id, text, options);
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Admin bildirimi endpoint'i
app.post('/api/telegram/admin-notification', async (req, res) => {
  try {
    const { title, message, priority = 'info' } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'title and message are required'
      });
    }
    
    // Admin yetkisi kontrolü
    const userId = req.headers['x-admin-id'];
    if (!userId || !config.isAdmin(parseInt(userId))) {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }
    
    const result = await sender.sendAdminNotification(title, message, priority);
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Dashboard durum endpoint'i
app.post('/api/telegram/status-report', async (req, res) => {
  try {
    const { chat_id, status_data } = req.body;
    
    if (!chat_id || !status_data) {
      return res.status(400).json({
        status: 'error',
        message: 'chat_id and status_data are required'
      });
    }
    
    const result = await sender.sendStatusReport(chat_id, status_data);
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Sağlık kontrolü endpoint'i
app.get('/api/telegram/health', async (req, res) => {
  try {
    const healthStatus = await webhookHandler.healthCheck();
    
    res.json({
      status: healthStatus.status === 'healthy' ? 'success' : 'error',
      data: healthStatus
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Test endpoint'i
app.get('/api/telegram/test', async (req, res) => {
  try {
    // Bot yapılandırmasını kontrol et
    if (!config.isValid()) {
      return res.status(400).json({
        status: 'error',
        message: 'Bot token is not configured properly'
      });
    }
    
    // Test mesajı gönder (opsiyonel)
    const testChatId = req.query.chat_id;
    let testResult = null;
    
    if (testChatId) {
      testResult = await sender.sendMessage(
        testChatId,
        '🧪 *Test Mesajı*\\n\\nTelegram bot sistemi çalışıyor! ✅',
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '📊 Test Başarılı', callback_data: 'test_success' }
              ]
            ]
          }
        }
      );
    }
    
    res.json({
      status: 'success',
      message: 'Telegram bot system is working',
      config_valid: config.isValid(),
      webhook_set: !!(await config.getWebhookInfo()),
      test_result: testResult
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Server başlat
app.listen(PORT, () => {
  console.log(`🚀 Telegram Bot Webhook Server çalışıyor!`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🔗 Webhook URL: ${process.env.WEBHOOK_URL || 'http://localhost:' + PORT + '/api/telegram/webhook'}`);
  console.log(`🤖 Bot Token: ${config.isValid() ? '✅ Yapılandırıldı' : '❌ Eksik'}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`\\n📝 Test endpoint: http://localhost:${PORT}/api/telegram/test`);
    console.log(`🔧 Sağlık kontrolü: http://localhost:${PORT}/api/telegram/health`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;