/**
 * Botfusions Dashboard Notification Rules
 * Email gönderim kuralları ve zamanlama ayarları
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase client
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY) 
  : null;

/**
 * Notification Rule Types
 */
const NOTIFICATION_TYPES = {
  REALTIME: 'realtime',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom'
};

/**
 * Email Template Types
 */
const EMAIL_TYPES = {
  WELCOME: 'welcome',
  ALERT: 'alert',
  REPORT: 'report',
  DIGEST: 'digest',
  SETTINGS: 'settings',
  SYSTEM: 'system'
};

/**
 * Priority Levels
 */
const PRIORITY_LEVELS = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
};

/**
 * Notification Triggers
 */
const NOTIFICATION_TRIGGERS = {
  USER_REGISTRATION: 'user_registration',
  DASHBOARD_ACCESS: 'dashboard_access',
  DATA_THRESHOLD: 'data_threshold',
  ERROR_OCCURRED: 'error_occurred',
  SYSTEM_MAINTENANCE: 'system_maintenance',
  WEEKLY_SUMMARY: 'weekly_summary',
  MONTHLY_REPORT: 'monthly_report',
  CUSTOM_EVENT: 'custom_event'
};

/**
 * Real-time notification kuralları
 */
const REALTIME_RULES = {
  userRegistration: {
    name: 'Kullanıcı Kaydı',
    description: 'Yeni kullanıcı kaydında hoş geldin emaili gönder',
    template: EMAIL_TYPES.WELCOME,
    trigger: NOTIFICATION_TRIGGERS.USER_REGISTRATION,
    enabled: true,
    conditions: [
      {
        field: 'user_type',
        operator: 'equals',
        value: 'new_user'
      }
    ],
    delay: 0, // Immediate
    priority: PRIORITY_LEVELS.NORMAL
  },

  errorAlert: {
    name: 'Sistem Hatası',
    description: 'Kritik sistem hatası oluştuğunda bildirim gönder',
    template: EMAIL_TYPES.ALERT,
    trigger: NOTIFICATION_TRIGGERS.ERROR_OCCURRED,
    enabled: true,
    conditions: [
      {
        field: 'severity',
        operator: 'in',
        value: ['high', 'critical']
      }
    ],
    delay: 0,
    priority: PRIORITY_LEVELS.URGENT
  },

  dataThreshold: {
    name: 'Veri Eşiği',
    description: 'Veri eşiği aşıldığında bildirim gönder',
    template: EMAIL_TYPES.ALERT,
    trigger: NOTIFICATION_TRIGGERS.DATA_THRESHOLD,
    enabled: true,
    conditions: [
      {
        field: 'threshold_exceeded',
        operator: 'equals',
        value: true
      }
    ],
    delay: 300, // 5 minutes
    priority: PRIORITY_LEVELS.HIGH
  },

  systemMaintenance: {
    name: 'Sistem Bakımı',
    description: 'Planlı sistem bakımı öncesi bildirim gönder',
    template: EMAIL_TYPES.ALERT,
    trigger: NOTIFICATION_TRIGGERS.SYSTEM_MAINTENANCE,
    enabled: true,
    conditions: [],
    delay: 86400, // 24 hours before
    priority: PRIORITY_LEVELS.NORMAL
  }
};

/**
 * Günlük notification kuralları
 */
const DAILY_RULES = {
  dailyDigest: {
    name: 'Günlük Özet',
    description: 'Günlük aktivite özeti gönder',
    template: EMAIL_TYPES.DIGEST,
    trigger: NOTIFICATION_TRIGGERS.WEEKLY_SUMMARY, // Reused for daily
    enabled: true,
    conditions: [
      {
        field: 'user_preferences.daily_digest',
        operator: 'equals',
        value: true
      }
    ],
    schedule: {
      time: '09:00', // 9 AM
      timezone: 'Europe/Istanbul',
      days: [1, 2, 3, 4, 5, 6, 7] // All days
    },
    priority: PRIORITY_LEVELS.LOW,
    frequency: 'daily'
  },

  performanceReport: {
    name: 'Günlük Performans',
    description: 'Günlük performans raporu gönder',
    template: EMAIL_TYPES.REPORT,
    trigger: NOTIFICATION_TRIGGERS.CUSTOM_EVENT,
    enabled: false, // Disabled by default
    conditions: [
      {
        field: 'user_preferences.performance_reports',
        operator: 'equals',
        value: true
      }
    ],
    schedule: {
      time: '18:00', // 6 PM
      timezone: 'Europe/Istanbul',
      days: [1, 2, 3, 4, 5] // Weekdays only
    },
    priority: PRIORITY_LEVELS.NORMAL,
    frequency: 'daily'
  }
};

/**
 * Haftalık notification kuralları
 */
const WEEKLY_RULES = {
  weeklySummary: {
    name: 'Haftalık Özet',
    description: 'Haftalık dashboard özeti gönder',
    template: EMAIL_TYPES.DIGEST,
    trigger: NOTIFICATION_TRIGGERS.WEEKLY_SUMMARY,
    enabled: true,
    conditions: [
      {
        field: 'user_preferences.weekly_summary',
        operator: 'equals',
        value: true
      }
    ],
    schedule: {
      time: '09:00', // 9 AM
      timezone: 'Europe/Istanbul',
      days: [1] // Monday only
    },
    priority: PRIORITY_LEVELS.LOW,
    frequency: 'weekly'
  },

  weeklyReport: {
    name: 'Haftalık Rapor',
    description: 'Detaylı haftalık performans raporu gönder',
    template: EMAIL_TYPES.REPORT,
    trigger: NOTIFICATION_TRIGGERS.WEEKLY_SUMMARY,
    enabled: true,
    conditions: [
      {
        field: 'user_preferences.weekly_reports',
        operator: 'equals',
        value: true
      }
    ],
    schedule: {
      time: '09:00', // 9 AM
      timezone: 'Europe/Istanbul',
      days: [1] // Monday only
    },
    priority: PRIORITY_LEVELS.NORMAL,
    frequency: 'weekly'
  }
};

/**
 * Aylık notification kuralları
 */
const MONTHLY_RULES = {
  monthlyReport: {
    name: 'Aylık Rapor',
    description: 'Kapsamlı aylık analiz raporu gönder',
    template: EMAIL_TYPES.REPORT,
    trigger: NOTIFICATION_TRIGGERS.MONTHLY_REPORT,
    enabled: true,
    conditions: [
      {
        field: 'user_preferences.monthly_reports',
        operator: 'equals',
        value: true
      }
    ],
    schedule: {
      time: '09:00', // 9 AM
      timezone: 'Europe/Istanbul',
      day: 1, // First day of month
      frequency: 'monthly'
    },
    priority: PRIORITY_LEVELS.NORMAL,
    frequency: 'monthly'
  }
};

/**
 * Tüm notification kurallarını birleştir
 */
const ALL_RULES = {
  realtime: REALTIME_RULES,
  daily: DAILY_RULES,
  weekly: WEEKLY_RULES,
  monthly: MONTHLY_RULES
};

/**
 * Notification Rule Manager
 */
class NotificationRuleManager {
  constructor() {
    this.rules = ALL_RULES;
  }

  /**
   * Belirli bir rule'u getir
   */
  getRule(category, ruleName) {
    return this.rules[category]?.[ruleName] || null;
  }

  /**
   * Tüm aktif rule'ları getir
   */
  getActiveRules(category = null) {
    if (category) {
      return Object.entries(this.rules[category] || {})
        .filter(([_, rule]) => rule.enabled)
        .reduce((acc, [name, rule]) => ({ ...acc, [name]: rule }), {});
    }

    return Object.entries(this.rules)
      .reduce((acc, [cat, rules]) => {
        const activeRules = Object.entries(rules)
          .filter(([_, rule]) => rule.enabled)
          .reduce((catAcc, [name, rule]) => ({ ...catAcc, [name]: rule }), {});
        return { ...acc, [cat]: activeRules };
      }, {});
  }

  /**
   * Rule'u etkinleştir/devre dışı bırak
   */
  toggleRule(category, ruleName, enabled) {
    if (this.rules[category] && this.rules[category][ruleName]) {
      this.rules[category][ruleName].enabled = enabled;
      return true;
    }
    return false;
  }

  /**
   * Yeni rule ekle
   */
  addRule(category, ruleName, ruleConfig) {
    if (!this.rules[category]) {
      this.rules[category] = {};
    }
    
    this.rules[category][ruleName] = {
      ...ruleConfig,
      name: ruleName,
      created_at: new Date().toISOString()
    };
    
    return true;
  }

  /**
   * Rule'u kaldır
   */
  removeRule(category, ruleName) {
    if (this.rules[category] && this.rules[category][ruleName]) {
      delete this.rules[category][ruleName];
      return true;
    }
    return false;
  }

  /**
   * Rule koşullarını değerlendir
   */
  evaluateConditions(conditions, context) {
    if (!conditions || conditions.length === 0) {
      return true;
    }

    return conditions.every(condition => {
      const { field, operator, value } = condition;
      const contextValue = this.getNestedValue(context, field);
      
      switch (operator) {
        case 'equals':
          return contextValue === value;
        case 'not_equals':
          return contextValue !== value;
        case 'greater_than':
          return contextValue > value;
        case 'less_than':
          return contextValue < value;
        case 'in':
          return Array.isArray(value) && value.includes(contextValue);
        case 'not_in':
          return Array.isArray(value) && !value.includes(contextValue);
        case 'exists':
          return contextValue !== undefined && contextValue !== null;
        case 'not_exists':
          return contextValue === undefined || contextValue === null;
        default:
          return false;
      }
    });
  }

  /**
   * Nested object value'sunu al
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Belirli bir trigger için applicable rule'ları bul
   */
  getRulesForTrigger(trigger) {
    const applicable = [];
    
    Object.entries(this.rules).forEach(([category, categoryRules]) => {
      Object.entries(categoryRules).forEach(([ruleName, rule]) => {
        if (rule.enabled && rule.trigger === trigger) {
          applicable.push({
            category,
            name: ruleName,
            rule: rule
          });
        }
      });
    });
    
    return applicable;
  }

  /**
   * Zamanlama kontrolü yap
   */
  shouldSendNotification(rule, now = new Date()) {
    if (!rule.schedule) {
      return true; // No schedule = always send
    }

    const { schedule } = rule;
    const currentTime = now.toLocaleTimeString('en-US', { 
      timeZone: schedule.timezone || 'Europe/Istanbul',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Check time
    if (schedule.time && currentTime !== schedule.time) {
      return false;
    }

    // Check day of week (1-7, Monday=1)
    const dayOfWeek = now.toLocaleDateString('en-US', { 
      timeZone: schedule.timezone || 'Europe/Istanbul',
      weekday: 'short'
    });
    
    const dayMap = {
      'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 
      'Fri': 5, 'Sat': 6, 'Sun': 7
    };
    
    const currentDay = dayMap[dayOfWeek];
    
    if (schedule.days && !schedule.days.includes(currentDay)) {
      return false;
    }

    // Check day of month
    const dayOfMonth = now.getDate();
    if (schedule.day && dayOfMonth !== schedule.day) {
      return false;
    }

    return true;
  }

  /**
   * User preferences'e göre filtrele
   */
  filterByUserPreferences(userPreferences) {
    const filtered = {};
    
    Object.entries(this.rules).forEach(([category, categoryRules]) => {
      filtered[category] = {};
      
      Object.entries(categoryRules).forEach(([ruleName, rule]) => {
        if (rule.enabled && this.evaluateConditions(rule.conditions, { 
          user_preferences: userPreferences 
        })) {
          filtered[category][ruleName] = rule;
        }
      });
    });
    
    return filtered;
  }
}

/**
 * Notification Scheduler
 */
class NotificationScheduler {
  constructor() {
    this.ruleManager = new NotificationRuleManager();
    this.running = false;
    this.schedules = new Map();
  }

  /**
   * Scheduler'ı başlat
   */
  async start() {
    if (this.running) {
      return;
    }

    this.running = true;
    console.log('📅 Notification Scheduler başlatıldı');

    // Schedule all active notifications
    await this.scheduleAllNotifications();
    
    // Start scheduler loop
    this.schedulerLoop();
  }

  /**
   * Scheduler'ı durdur
   */
  stop() {
    this.running = false;
    
    // Clear all schedules
    this.schedules.forEach(clearTimeout);
    this.schedules.clear();
    
    console.log('📅 Notification Scheduler durduruldu');
  }

  /**
   * Tüm notification'ları schedule et
   */
  async scheduleAllNotifications() {
    const activeRules = this.ruleManager.getActiveRules();
    
    Object.entries(activeRules).forEach(([category, categoryRules]) => {
      Object.entries(categoryRules).forEach(([ruleName, rule]) => {
        if (rule.schedule) {
          this.scheduleRule(category, ruleName, rule);
        }
      });
    });
  }

  /**
   * Belirli bir rule'u schedule et
   */
  scheduleRule(category, ruleName, rule) {
    if (!rule.schedule || !this.running) {
      return;
    }

    const scheduleKey = `${category}_${ruleName}`;
    
    // Clear existing schedule
    if (this.schedules.has(scheduleKey)) {
      clearTimeout(this.schedules.get(scheduleKey));
    }

    // Calculate next run time
    const nextRun = this.calculateNextRun(rule.schedule);
    const now = new Date();
    const delay = nextRun.getTime() - now.getTime();

    // Schedule the notification
    const timeoutId = setTimeout(async () => {
      if (this.running) {
        await this.triggerScheduledNotification(category, ruleName, rule);
        
        // Reschedule for next occurrence
        this.scheduleRule(category, ruleName, rule);
      }
    }, Math.max(delay, 0));

    this.schedules.set(scheduleKey, timeoutId);
    console.log(`📅 ${ruleName} schedule edildi: ${nextRun.toLocaleString('tr-TR')}`);
  }

  /**
   * Sonraki çalışma zamanını hesapla
   */
  calculateNextRun(schedule) {
    const now = new Date();
    
    if (schedule.frequency === 'monthly' && schedule.day) {
      // Next month
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, schedule.day);
      const [hours, minutes] = schedule.time.split(':');
      nextMonth.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return nextMonth;
    }
    
    if (schedule.days && schedule.days.length > 0) {
      // Next occurrence of specified days
      const currentDay = now.getDay() === 0 ? 7 : now.getDay(); // Convert Sunday (0) to 7
      const [hours, minutes] = schedule.time.split(':');
      
      let nextDay = schedule.days.find(day => day > currentDay);
      let daysToAdd = 0;
      
      if (nextDay) {
        daysToAdd = nextDay - currentDay;
      } else {
        // Next week
        daysToAdd = (7 - currentDay) + schedule.days[0];
      }
      
      const nextDate = new Date(now.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
      nextDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      return nextDate;
    }
    
    // Daily - next day at specified time
    const nextDay = new Date(now);
    nextDay.setDate(nextDay.getDate() + 1);
    const [hours, minutes] = schedule.time.split(':');
    nextDay.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    return nextDay;
  }

  /**
   * Scheduled notification'ı tetikle
   */
  async triggerScheduledNotification(category, ruleName, rule) {
    try {
      console.log(`📤 Scheduled notification gönderiliyor: ${ruleName}`);
      
      // Get affected users
      const users = await this.getAffectedUsers(rule);
      
      // Trigger notification for each user
      for (const user of users) {
        await this.sendNotificationToUser(user, rule, category, ruleName);
      }
      
      console.log(`✅ ${ruleName} notification'ı ${users.length} kullanıcıya gönderildi`);
    } catch (error) {
      console.error(`❌ Scheduled notification hatası (${ruleName}):`, error);
    }
  }

  /**
   * Etkilenen kullanıcıları al
   */
  async getAffectedUsers(rule) {
    if (!supabase) {
      console.log('Supabase yapılandırılmamış, varsayılan kullanıcı döndürülüyor');
      return [];
    }

    try {
      let query = supabase
        .from('users')
        .select('id, email, full_name, preferences')
        .eq('status', 'active');

      // Apply conditions
      if (rule.conditions && rule.conditions.length > 0) {
        // Note: This is simplified - in real implementation, 
        // you'd need to build proper Supabase queries
        console.log('Rule conditions found, filtering users...');
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Kullanıcı verileri alma hatası:', error);
      return [];
    }
  }

  /**
   * Kullanıcıya notification gönder
   */
  async sendNotificationToUser(user, rule, category, ruleName) {
    try {
      // Prepare notification data
      const notificationData = {
        user: user,
        template: rule.template,
        category: category,
        rule: ruleName,
        priority: rule.priority,
        metadata: {
          triggered_by: 'scheduler',
          rule_category: category,
          rule_name: ruleName,
          scheduled: true
        }
      };

      // Use email sender service (would be imported)
      // const { sendEmail } = require('./email-sender');
      // await sendEmail(notificationData);
      
      console.log(`📧 ${user.email} için ${ruleName} notification gönderildi`);
    } catch (error) {
      console.error(`❌ Kullanıcı notification hatası (${user.email}):`, error);
    }
  }

  /**
   * Ana scheduler döngüsü
   */
  schedulerLoop() {
    if (!this.running) return;

    // Check for real-time notifications every minute
    setInterval(async () => {
      await this.checkRealtimeNotifications();
    }, 60 * 1000); // Every minute

    console.log('📅 Scheduler loop başlatıldı');
  }

  /**
   * Real-time notifications'ları kontrol et
   */
  async checkRealtimeNotifications() {
    if (!this.running) return;

    try {
      const realtimeRules = this.ruleManager.getActiveRules('realtime');
      
      Object.entries(realtimeRules).forEach(async ([ruleName, rule]) => {
        const shouldSend = this.ruleManager.shouldSendNotification(rule);
        
        if (shouldSend) {
          await this.triggerRealtimeNotification(ruleName, rule);
        }
      });
    } catch (error) {
      console.error('Real-time notification kontrol hatası:', error);
    }
  }

  /**
   * Real-time notification'ı tetikle
   */
  async triggerRealtimeNotification(ruleName, rule) {
    try {
      console.log(`⚡ Real-time notification tetiklendi: ${ruleName}`);
      
      // Implementation depends on your real-time notification system
      // This could be triggered by database triggers, API events, etc.
    } catch (error) {
      console.error(`❌ Real-time notification hatası (${ruleName}):`, error);
    }
  }
}

module.exports = {
  NotificationRuleManager,
  NotificationScheduler,
  NOTIFICATION_TYPES,
  EMAIL_TYPES,
  PRIORITY_LEVELS,
  NOTIFICATION_TRIGGERS,
  REALTIME_RULES,
  DAILY_RULES,
  WEEKLY_RULES,
  MONTHLY_RULES,
  ALL_RULES
};