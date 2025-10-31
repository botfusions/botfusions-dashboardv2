/**
 * Botfusions Dashboard Email Configuration
 * Gmail SMTP ayarları ve email helper functions
 */

const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

// Gmail SMTP Configuration
const SMTP_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER || process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
};

// SendGrid Configuration (alternatif)
const SENDGRID_CONFIG = {
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.FROM_EMAIL || 'noreply@botfusions.com',
  fromName: 'Botfusions Dashboard'
};

// Email Template Configuration
const EMAIL_CONFIG = {
  from: {
    email: process.env.FROM_EMAIL || 'noreply@botfusions.com',
    name: 'Botfusions Dashboard'
  },
  replyTo: {
    email: process.env.REPLY_TO_EMAIL || 'support@botfusions.com',
    name: 'Botfusions Support'
  },
  logo: {
    url: process.env.COMPANY_LOGO_URL || 'https://botfusions.com/logo.png',
    alt: 'Botfusions Logo'
  },
  company: {
    name: 'Botfusions',
    url: 'https://botfusions.com',
    address: 'İstanbul, Türkiye'
  }
};

// Nodemailer Transporter
let transporter = null;

/**
 * Email transporter'ı başlat
 */
function initializeTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransporter(SMTP_CONFIG);
    console.log('📧 Email transporter initialized');
  }
  return transporter;
}

/**
 * SendGrid'i başlat
 */
function initializeSendGrid() {
  if (SENDGRID_CONFIG.apiKey && !sgMail.getApiKey()) {
    sgMail.setApiKey(SENDGRID_CONFIG.apiKey);
    console.log('📧 SendGrid initialized');
  }
  return sgMail;
}

/**
 * Email adresi doğrula
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Email template data'sını hazırla
 */
function prepareTemplateData(userData, customData = {}) {
  return {
    user: {
      name: userData?.full_name || userData?.name || 'Kullanıcı',
      email: userData?.email,
      id: userData?.id
    },
    company: EMAIL_CONFIG.company,
    logo: EMAIL_CONFIG.logo,
    currentYear: new Date().getFullYear(),
    currentDate: new Date().toLocaleDateString('tr-TR'),
    currentTime: new Date().toLocaleTimeString('tr-TR'),
    ...customData
  };
}

/**
 * Email template render et
 */
function renderTemplate(template, data) {
  let rendered = template;
  
  // Basit template replacement
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (typeof value === 'object') {
      Object.keys(value).forEach(subKey => {
        const placeholder = `{{${key}.${subKey}}}`;
        const replacement = value[subKey];
        rendered = rendered.replace(new RegExp(placeholder, 'g'), replacement);
      });
    } else {
      const placeholder = `{{${key}}}`;
      const replacement = value;
      rendered = rendered.replace(new RegExp(placeholder, 'g'), replacement);
    }
  });
  
  return rendered;
}

/**
 * Email priority belirle
 */
function getEmailPriority(type) {
  const priorities = {
    'welcome': 'normal',
    'alert': 'high',
    'report': 'normal',
    'digest': 'low',
    'notification': 'normal',
    'error': 'high',
    'warning': 'normal'
  };
  
  return priorities[type] || 'normal';
}

/**
 * Email tracking data hazırla
 */
function prepareTrackingData(userId, emailType, metadata = {}) {
  return {
    userId,
    emailType,
    sentAt: new Date().toISOString(),
    metadata,
    sessionId: metadata.sessionId || null,
    userAgent: metadata.userAgent || null,
    ipAddress: metadata.ipAddress || null
  };
}

/**
 * Test email gönder
 */
async function sendTestEmail(to, subject = 'Test Email') {
  try {
    const transporter = initializeTransporter();
    
    const info = await transporter.sendMail({
      from: `"${EMAIL_CONFIG.from.name}" <${EMAIL_CONFIG.from.email}>`,
      to,
      subject: `🔧 Test: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Test Email</h2>
          <p>Bu bir test emailidir.</p>
          <p><strong>Gönderim zamanı:</strong> ${new Date().toLocaleString('tr-TR')}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Bu email Botfusions Dashboard sisteminden gönderilmiştir.
          </p>
        </div>
      `
    });
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Test email gönderim hatası:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Email health check
 */
async function checkEmailHealth() {
  try {
    const transporter = initializeTransporter();
    await transporter.verify();
    return { status: 'healthy', message: 'Email servisi aktif' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

module.exports = {
  SMTP_CONFIG,
  SENDGRID_CONFIG,
  EMAIL_CONFIG,
  initializeTransporter,
  initializeSendGrid,
  isValidEmail,
  prepareTemplateData,
  renderTemplate,
  getEmailPriority,
  prepareTrackingData,
  sendTestEmail,
  checkEmailHealth,
  transporter: () => transporter,
  sgMail: () => sgMail
};