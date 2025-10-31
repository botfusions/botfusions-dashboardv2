/**
 * Botfusions Dashboard Email Sender
 * Email gönderim fonksiyonları ve helper methods
 */

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const {
  EMAIL_CONFIG,
  initializeTransporter,
  initializeSendGrid,
  prepareTemplateData,
  renderTemplate,
  getEmailPriority,
  prepareTrackingData
} = require('../config/email-config');

// Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

/**
 * HTML template'ini dosyadan oku
 */
async function loadTemplate(templateName) {
  try {
    const templatePath = path.join(__dirname, '../templates/email-templates.html');
    const templateFile = await fs.readFile(templatePath, 'utf8');
    
    // Extract specific template from HTML file
    const templateMatch = templateFile.match(
      new RegExp(`<!-- ${templateName} Email Template -->[\\s\\S]*?(?=<!-- |$)`, 'i')
    );
    
    if (!templateMatch) {
      throw new Error(`Template "${templateName}" bulunamadı`);
    }
    
    return templateMatch[0];
  } catch (error) {
    console.error(`Template yükleme hatası (${templateName}):`, error);
    throw error;
  }
}

/**
 * Generic email gönderme fonksiyonu
 */
async function sendEmail({
  to,
  templateName,
  data = {},
  subject = null,
  priority = 'normal',
  tracking = true
}) {
  try {
    // Validate email address
    if (!to || typeof to !== 'string') {
      throw new Error('Geçerli bir email adresi gerekli');
    }

    // Load and render template
    const template = await loadTemplate(templateName);
    const templateData = prepareTemplateData(data.user, data);
    const htmlContent = renderTemplate(template, templateData);
    
    // Generate subject if not provided
    const emailSubject = subject || generateSubject(templateName, templateData);
    
    // Initialize email service
    let transporter = initializeTransporter();
    let sgMail = initializeSendGrid();
    
    // Prepare email options
    const mailOptions = {
      from: `"${EMAIL_CONFIG.from.name}" <${EMAIL_CONFIG.from.email}>`,
      to: data.user?.email || to,
      subject: emailSubject,
      html: htmlContent,
      priority: getEmailPriority(priority)
    };
    
    // Add reply-to if configured
    if (EMAIL_CONFIG.replyTo) {
      mailOptions.replyTo = `"${EMAIL_CONFIG.replyTo.name}" <${EMAIL_CONFIG.replyTo.email}>`;
    }
    
    // Send email via SMTP
    let emailResult;
    if (transporter) {
      emailResult = await transporter.sendMail(mailOptions);
      console.log(`Email gönderildi (SMTP): ${emailResult.messageId}`);
    } else if (sgMail.getApiKey()) {
      // Alternative SendGrid sending
      const msg = {
        to: mailOptions.to,
        from: {
          email: EMAIL_CONFIG.from.email,
          name: EMAIL_CONFIG.from.name
        },
        subject: mailOptions.subject,
        html: htmlContent,
        mailSettings: {
          sandboxMode: { enable: process.env.NODE_ENV === 'development' }
        }
      };
      
      emailResult = await sgMail.send(msg);
      console.log(`Email gönderildi (SendGrid): ${emailResult[0]?.headers?.['x-message-id']}`);
    } else {
      throw new Error('Email servisi yapılandırılmamış');
    }
    
    // Track email if enabled
    if (tracking && supabase) {
      await trackEmail({
        userId: data.user?.id,
        emailType: templateName,
        recipient: mailOptions.to,
        subject: emailSubject,
        messageId: emailResult.messageId || emailResult[0]?.headers?.['x-message-id'],
        metadata: data
      });
    }
    
    return {
      success: true,
      messageId: emailResult.messageId || emailResult[0]?.headers?.['x-message-id'],
      recipient: mailOptions.to,
      template: templateName
    };
    
  } catch (error) {
    console.error('Email gönderim hatası:', error);
    
    // Track failed email if enabled
    if (tracking && supabase) {
      await trackEmail({
        userId: data.user?.id,
        emailType: templateName,
        recipient: to,
        subject: subject || 'Unknown',
        status: 'failed',
        error: error.message,
        metadata: data
      });
    }
    
    return {
      success: false,
      error: error.message,
      template: templateName,
      recipient: to
    };
  }
}

/**
 * Welcome email gönder
 */
async function sendWelcomeEmail(userData, additionalData = {}) {
  const templateData = {
    user: userData,
    dashboard_url: additionalData.dashboard_url || `${process.env.DASHBOARD_URL}/welcome`,
    support_url: additionalData.support_url || `${process.env.DASHBOARD_URL}/support`,
    privacy_url: additionalData.privacy_url || `${process.env.COMPANY_URL}/privacy`,
    terms_url: additionalData.terms_url || `${process.env.COMPANY_URL}/terms`
  };
  
  return await sendEmail({
    to: userData.email,
    templateName: 'welcome',
    data: templateData,
    subject: '🎉 Botfusions Dashboard\'a Hoş Geldiniz!',
    priority: 'normal'
  });
}

/**
 * Alert email gönder
 */
async function sendAlertEmail(userData, alertData) {
  const templateData = {
    user: userData,
    alert_type: alertData.type || 'info',
    alert_title: alertData.title,
    alert_message: alertData.message,
    alert_priority: alertData.priority || 'Orta',
    alert_action_required: alertData.action_required,
    alert_data: alertData.data,
    action_url: alertData.action_url,
    dashboard_url: alertData.dashboard_url || `${process.env.DASHBOARD_URL}`,
    support_url: alertData.support_url || `${process.env.DASHBOARD_URL}/support`,
    unsubscribe_url: `${process.env.DASHBOARD_URL}/settings/notifications`
  };
  
  const priority = alertData.priority === 'Yüksek' ? 'high' : 
                   alertData.priority === 'Düşük' ? 'low' : 'normal';
  
  return await sendEmail({
    to: userData.email,
    templateName: 'alert',
    data: templateData,
    subject: `⚠️ ${alertData.title}`,
    priority: priority
  });
}

/**
 * Report email gönder
 */
async function sendReportEmail(userData, reportData) {
  const templateData = {
    user: userData,
    report_title: reportData.title,
    report_description: reportData.description,
    report_stats: reportData.stats || [],
    report_chart: reportData.chart,
    report_table: reportData.table,
    report_insights: reportData.insights,
    report_url: reportData.url || `${process.env.DASHBOARD_URL}/reports`,
    report_period: reportData.period || 'son dönem',
    dashboard_url: `${process.env.DASHBOARD_URL}`,
    settings_url: `${process.env.DASHBOARD_URL}/settings`
  };
  
  return await sendEmail({
    to: userData.email,
    templateName: 'report',
    data: templateData,
    subject: `📊 ${reportData.title}`,
    priority: 'normal'
  });
}

/**
 * Digest email gönder
 */
async function sendDigestEmail(userData, digestData) {
  const templateData = {
    user: userData,
    digest_summary: digestData.summary || [],
    recent_activities: digestData.activities || [],
    top_performers: digestData.performers || [],
    upcoming_events: digestData.events || [],
    dashboard_url: `${process.env.DASHBOARD_URL}`,
    reports_url: `${process.env.DASHBOARD_URL}/reports`,
    settings_url: `${process.env.DASHBOARD_URL}/settings`,
    unsubscribe_url: `${process.env.DASHBOARD_URL}/settings/notifications`
  };
  
  return await sendEmail({
    to: userData.email,
    templateName: 'digest',
    data: templateData,
    subject: '📬 Haftalık Dashboard Özeti',
    priority: 'low'
  });
}

/**
 * Notification settings email gönder
 */
async function sendSettingsEmail(userData, preferences) {
  const templateData = {
    user: userData,
    preferences: {
      realtime_enabled: preferences?.realtime_notifications ?? true,
      daily_digest_enabled: preferences?.daily_digest ?? true,
      weekly_report_enabled: preferences?.weekly_reports ?? true,
      alerts_enabled: preferences?.alerts ?? true
    },
    settings_url: `${process.env.DASHBOARD_URL}/settings/notifications`,
    dashboard_url: `${process.env.DASHBOARD_URL}`,
    support_url: `${process.env.DASHBOARD_URL}/support`,
    profile_url: `${process.env.DASHBOARD_URL}/profile`
  };
  
  return await sendEmail({
    to: userData.email,
    templateName: 'settings',
    data: templateData,
    subject: '⚙️ Bildirim Ayarlarınız',
    priority: 'normal'
  });
}

/**
 * Bulk email gönderimi
 */
async function sendBulkEmails(emailRequests, options = {}) {
  const results = [];
  const batchSize = options.batchSize || 10;
  const delay = options.delay || 1000; // 1 second delay between batches
  
  for (let i = 0; i < emailRequests.length; i += batchSize) {
    const batch = emailRequests.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (request) => {
      try {
        const result = await sendEmail(request);
        return { ...request, result };
      } catch (error) {
        return { ...request, result: { success: false, error: error.message } };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Add delay between batches to avoid rate limiting
    if (i + batchSize < emailRequests.length) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return results;
}

/**
 * Email tracking kaydet
 */
async function trackEmail(trackingData) {
  if (!supabase) {
    console.log('Supabase yapılandırılmamış, tracking atlanıyor');
    return;
  }
  
  try {
    const { error } = await supabase
      .from('email_tracking')
      .insert([{
        user_id: trackingData.userId,
        email_type: trackingData.emailType,
        recipient: trackingData.recipient,
        subject: trackingData.subject,
        message_id: trackingData.messageId,
        status: trackingData.status || 'sent',
        sent_at: new Date().toISOString(),
        opened_at: null,
        clicked_at: null,
        error_message: trackingData.error,
        metadata: trackingData.metadata
      }]);
    
    if (error) {
      console.error('Email tracking hatası:', error);
    }
  } catch (error) {
    console.error('Email tracking kaydetme hatası:', error);
  }
}

/**
 * Email açılışını kaydet
 */
async function trackEmailOpen(messageId, metadata = {}) {
  if (!supabase) return;
  
  try {
    const { error } = await supabase
      .from('email_tracking')
      .update({ 
        opened_at: new Date().toISOString(),
        metadata: metadata 
      })
      .eq('message_id', messageId);
    
    if (error) {
      console.error('Email açılış tracking hatası:', error);
    }
  } catch (error) {
    console.error('Email açılış kaydetme hatası:', error);
  }
}

/**
 * Email tıklama tracking
 */
async function trackEmailClick(messageId, clickData = {}) {
  if (!supabase) return;
  
  try {
    const { error } = await supabase
      .from('email_tracking')
      .update({ 
        clicked_at: new Date().toISOString(),
        click_data: clickData
      })
      .eq('message_id', messageId);
    
    if (error) {
      console.error('Email tıklama tracking hatası:', error);
    }
  } catch (error) {
    console.error('Email tıklama kaydetme hatası:', error);
  }
}

/**
 * Email istatistikleri getir
 */
async function getEmailStats(userId = null, dateRange = null) {
  if (!supabase) return { error: 'Supabase yapılandırılmamış' };
  
  try {
    let query = supabase
      .from('email_tracking')
      .select('*')
      .order('sent_at', { ascending: false });
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    if (dateRange) {
      query = query
        .gte('sent_at', dateRange.start)
        .lte('sent_at', dateRange.end);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Calculate statistics
    const stats = {
      total: data.length,
      sent: data.filter(e => e.status === 'sent').length,
      failed: data.filter(e => e.status === 'failed').length,
      opened: data.filter(e => e.opened_at !== null).length,
      clicked: data.filter(e => e.clicked_at !== null).length
    };
    
    stats.openRate = stats.total > 0 ? (stats.opened / stats.total * 100).toFixed(2) : 0;
    stats.clickRate = stats.total > 0 ? (stats.clicked / stats.total * 100).toFixed(2) : 0;
    
    return { stats, data };
  } catch (error) {
    console.error('Email istatistik hatası:', error);
    return { error: error.message };
  }
}

/**
 * Subject line oluştur
 */
function generateSubject(templateName, data) {
  const subjects = {
    'welcome': '🎉 Botfusions Dashboard\'a Hoş Geldiniz!',
    'alert': '⚠️ Önemli Bildirim',
    'report': '📊 Dashboard Raporu',
    'digest': '📬 Haftalık Özet',
    'settings': '⚙️ Bildirim Ayarlarınız'
  };
  
  return subjects[templateName] || 'Botfusions Dashboard';
}

/**
 * Email template validation
 */
function validateEmailData(templateName, data) {
  const required = {
    'welcome': ['user.email', 'user.name'],
    'alert': ['user.email', 'alert_title', 'alert_message'],
    'report': ['user.email', 'report_title'],
    'digest': ['user.email'],
    'settings': ['user.email']
  };
  
  const templateRequired = required[templateName] || [];
  const missing = [];
  
  templateRequired.forEach(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], data);
    if (!value) {
      missing.push(field);
    }
  });
  
  return {
    valid: missing.length === 0,
    missing: missing,
    message: missing.length > 0 ? `Eksik alanlar: ${missing.join(', ')}` : null
  };
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendAlertEmail,
  sendReportEmail,
  sendDigestEmail,
  sendSettingsEmail,
  sendBulkEmails,
  trackEmail,
  trackEmailOpen,
  trackEmailClick,
  getEmailStats,
  loadTemplate,
  validateEmailData
};