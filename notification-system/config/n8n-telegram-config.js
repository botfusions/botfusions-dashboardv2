/**
 * N8N Telegram Node Configuration
 * Botfusions Dashboard için N8N Telegram node konfigürasyonu
 */

// N8N Telegram node ayarları
const N8N_TELEGRAM_CONFIG = {
  // Telegram Bot Token
  bot_token: process.env.TELEGRAM_BOT_TOKEN || 'your-bot-token-here',
  
  // Webhook ayarları
  webhook: {
    url: process.env.TELEGRAM_WEBHOOK_URL || 'https://your-domain.com/api/telegram/webhook',
    method: 'POST',
    path: '/api/telegram/webhook'
  },

  // Node ayarları
  nodes: {
    // 1. Telegram Trigger Node
    telegram_trigger: {
      name: 'Telegram Bot Trigger',
      type: 'n8n-nodes-base.telegramTrigger',
      parameters: {
        updates: ['message', 'callback_query', 'edited_message'],
        webhook: true,
        webhook_url: process.env.TELEGRAM_WEBHOOK_URL
      },
      webhook_id: 'telegram-bot-webhook'
    },

    // 2. Telegram Node (Mesaj Gönderme)
    telegram_sender: {
      name: 'Telegram Mesaj Gönder',
      type: 'n8n-nodes-base.telegram',
      parameters: {
        operation: 'sendMessage',
        chat_id: '={{ $json.message.chat.id }}',
        text: '={{ $json.message.text }}',
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '📊 Dashboard Durumu',
                callback_data: 'status'
              },
              {
                text: '🔔 Bildirimler',
                callback_data: 'notifications'
              }
            ],
            [
              {
                text: '⚙️ Ayarlar',
                callback_data: 'settings'
              },
              {
                text: '🚨 Uyarılar',
                callback_data: 'alerts'
              }
            ]
          ]
        }
      }
    },

    // 3. Telegram Callback Query Handler
    telegram_callback: {
      name: 'Telegram Callback Handler',
      type: 'n8n-nodes-base.telegram',
      parameters: {
        operation: 'answerCallbackQuery',
        callback_query_id: '={{ $json.callback_query.id }}',
        text: 'İşlem gerçekleştiriliyor...',
        show_alert: false
      }
    },

    // 4. Dashboard Status Node
    dashboard_status: {
      name: 'Dashboard Status Checker',
      type: 'n8n-nodes-base.httpRequest',
      parameters: {
        method: 'GET',
        url: 'https://your-dashboard-api.com/status',
        options: {
          timeout: 5000
        },
        response: {
          response: {
            fullResponse: false
          }
        }
      }
    },

    // 5. System Alert Node
    system_alert: {
      name: 'Sistem Uyarısı Gönder',
      type: 'n8n-nodes-base.telegram',
      parameters: {
        operation: 'sendMessage',
        chat_id: '={{ $json.subscribers || "admin_chat_id" }}',
        text: '={{ $json.alert_message }}',
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '✅ Çözüldü Olarak İşaretle',
                callback_data: '={{ "resolve_" + $json.alert_id }}'
              },
              {
                text: '⚙️ Ayarlar',
                callback_data: 'alert_settings'
              }
            ]
          ]
        }
      }
    }
  },

  // Workflow ayarları
  workflows: {
    // Ana bildirim workflow'u
    main_notification_workflow: {
      name: 'Botfusions Dashboard Notifications',
      active: true,
      nodes: [
        {
          parameters: {},
          id: 'telegram-trigger',
          name: 'Telegram Trigger',
          type: 'n8n-nodes-base.telegramTrigger',
          typeVersion: 1,
          position: [240, 300],
          webhookId: 'telegram-bot-webhook'
        },
        {
          parameters: {
            conditions: {
              options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict'
              },
              conditions: [
                {
                      leftValue: '={{ $json.message.text }}',
                      rightValue: '/start',
                      operator: {
                        type: 'string',
                        operation: 'startsWith'
                      }
                    },
                    {
                      leftValue: '={{ $json.message.text }}',
                      rightValue: '/help',
                      operator: {
                        type: 'string',
                        operation: 'startsWith'
                      }
                    },
                    {
                      leftValue: '={{ $json.message.text }}',
                      rightValue: '/status',
                      operator: {
                        type: 'string',
                        operation: 'startsWith'
                      }
                    },
                    {
                      leftValue: '={{ $json.message.text }}',
                      rightValue: '/alerts',
                      operator: {
                        type: 'string',
                        operation: 'startsWith'
                      }
                    }
                  ],
                  combineOperation: 'any'
                }
              },
              options: {}
          },
          id: 'command-router',
          name: 'Komut Yönlendirici',
          type: 'n8n-nodes-base.switch',
          typeVersion: 3,
          position: [460, 300]
        },
        {
          parameters: {
            mode: 'combine',
            combinationMode: 'mergeByPosition',
            options: {}
          },
          id: 'merge-commands',
          name: 'Komut Birleştirici',
          type: 'n8n-nodes-base.merge',
          typeVersion: 2.1,
          position: [680, 200]
        },
        {
          parameters: {
            resource: 'message',
            operation: 'send',
            chatId: '={{ $json.message.chat.id }}',
            text: '=🚀 *Hoş Geldin!*\\n\\nBotfusions Dashboard botuna hoş geldin!\\n\\nMevcut komutlar:\\n• /start - Botu başlat\\n• /help - Yardım menüsü\\n• /status - Dashboard durumu\\n• /alerts - Uyarı ayarları',
            additionalFields: {
              parseMode: 'Markdown',
              replyMarkup: {
                inlineKeyboard: {
                  inlineKeyboard: [
                    [
                      {
                        text: '📊 Dashboard Durumu',
                        callbackData: 'status'
                      }
                    ],
                    [
                      {
                        text: '🔔 Bildirimler',
                        callbackData: 'notifications'
                      }
                    ]
                  ]
                }
              }
            }
          },
          id: 'send-welcome',
          name: 'Hoş Geldin Mesajı',
          type: 'n8n-nodes-base.telegram',
          typeVersion: 1.1,
          position: [900, 100]
        },
        {
          parameters: {
            resource: 'message',
            operation: 'send',
            chatId: '={{ $json.message.chat.id }}',
            text: '=📚 *Yardım Menüsü*\\n\\nMevcut komutlar:\\n• /start - Botu başlat\\n• /help - Bu menüyü göster\\n• /status - Dashboard durumunu göster\\n• /alerts - Uyarı ayarları\\n• /unsubscribe - Bildirimleri durdur',
            additionalFields: {
              parseMode: 'Markdown',
              replyMarkup: {
                inlineKeyboard: {
                  inlineKeyboard: [
                    [
                      {
                        text: '🚀 Ana Menü',
                        callbackData: 'main_menu'
                      },
                      {
                        text: '📊 Durumu Gör',
                        callbackData: 'status'
                      }
                    ]
                  ]
                }
              }
            }
          },
          id: 'send-help',
          name: 'Yardım Mesajı',
          type: 'n8n-nodes-base.telegram',
          typeVersion: 1.1,
          position: [900, 200]
        },
        {
          parameters: {
            method: 'GET',
            url: 'https://your-dashboard-api.com/status',
            options: {
              timeout: 5000
            }
          },
          id: 'get-dashboard-status',
          name: 'Dashboard Durum Al',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 4.2,
          position: [680, 400]
        },
        {
          parameters: {
            resource: 'message',
            operation: 'send',
            chatId: '={{ $json.message.chat.id }}',
            text: '=📊 *Dashboard Durum Raporu*\\n\\n🟢 *Genel Durum:* {{ $json.status }}\\n⏱️ *Çalışma Süresi:* {{ $json.uptime }}\\n👥 *Aktif Bağlantılar:* {{ $json.active_connections }}\\n🚀 *Toplam İstekler:* {{ $json.total_requests }}\\n⚠️ *Hata Oranı:* {{ $json.error_rate }}%',
            additionalFields: {
              parseMode: 'Markdown',
              replyMarkup: {
                inlineKeyboard: {
                  inlineKeyboard: [
                    [
                      {
                        text: '🔔 Uyarıları Aç',
                        callbackData: 'alerts_on'
                      },
                      {
                        text: '🔕 Uyarıları Kapat',
                        callbackData: 'alerts_off'
                      }
                    ]
                  ]
                }
              }
            }
          },
          id: 'send-status',
          name: 'Durum Mesajı Gönder',
          type: 'n8n-nodes-base.telegram',
          typeVersion: 1.1,
          position: [900, 400]
        }
      ],
      connections: {
        'Telegram Trigger': {
          main: [
            [
              {
                node: 'Komut Yönlendirici',
                type: 'main',
                index: 0
              }
            ]
          ]
        },
        'Komut Yönlendirici': {
          main: [
            [
              {
                node: 'Hoş Geldin Mesajı',
                type: 'main',
                index: 0
              }
            ],
            [
              {
                node: 'Yardım Mesajı',
                type: 'main',
                index: 0
              }
            ],
            [
              {
                node: 'Dashboard Durum Al',
                type: 'main',
                index: 0
              }
            ],
            [
              {
                node: 'Birleştirici (Mevcut değil - manuel eklenmeli)',
                type: 'main',
                index: 0
              }
            ]
          ]
        },
        'Dashboard Durum Al': {
          main: [
            [
              {
                node: 'Durum Mesajı Gönder',
                type: 'main',
                index: 0
              }
            ]
          ]
        }
      },
      settings: {
        executionOrder: 'v1'
      },
      staticData: {},
      meta: {
        templateCredsSetupCompleted: true,
        instanceId: 'your-instance-id'
      },
      id: 'main-notification-workflow',
      tags: [
        {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          id: 'telegram-bot',
          name: 'Telegram Bot'
        },
        {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          id: 'dashboard',
          name: 'Dashboard'
        }
      ]
    },

    // Sistem izleme workflow'u
    system_monitoring_workflow: {
      name: 'Botfusions System Monitoring',
      active: true,
      nodes: [
        {
          parameters: {
            rule: {
              interval: [
                {
                  field: 'cronExpression',
                  cronExpression: '*/5 * * * *' // Her 5 dakikada bir
                }
              ]
            }
          },
          id: 'schedule-trigger',
          name: 'Sistem Kontrol Zamanlayıcısı',
          type: 'n8n-nodes-base.scheduleTrigger',
          typeVersion: 1.2,
          position: [240, 300]
        },
        {
          parameters: {
            method: 'GET',
            url: 'https://your-dashboard-api.com/health',
            options: {
              timeout: 10000
            }
          },
          id: 'health-check',
          name: 'Sistem Sağlık Kontrolü',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 4.2,
          position: [460, 300]
        },
        {
          parameters: {
            conditions: {
              options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict'
              },
              conditions: [
                {
                  leftValue: '={{ $json.status }}',
                  rightValue: 'error',
                  operator: {
                    type: 'string',
                    operation: 'equals'
                  }
                }
              ],
              combineOperation: 'any'
            },
            options: {}
          },
          id: 'error-filter',
          name: 'Hata Filtresi',
          type: 'n8n-nodes-base.switch',
          typeVersion: 3,
          position: [680, 300]
        },
        {
          parameters: {
            resource: 'message',
            operation: 'send',
            chatId: process.env.ADMIN_CHAT_ID || 'admin_chat_id',
            text: '=🚨 *Sistem Uyarısı*\\n\\nSistemde hata tespit edildi!\\n\\n*Detaylar:*\\n• Zaman: {{ new Date().toLocaleString("tr-TR") }}\\n• Durum: {{ $json.status }}\\n• Mesaj: {{ $json.message || "Bilinmiyor" }}',
            additionalFields: {
              parseMode: 'Markdown',
              replyMarkup: {
                inlineKeyboard: {
                  inlineKeyboard: [
                    [
                      {
                        text: '📊 Dashboard Kontrol Et',
                        url: 'https://your-dashboard-url.com'
                      },
                      {
                        text: '⚙️ Ayarlar',
                        callbackData: 'settings'
                      }
                    ]
                  ]
                }
              }
            }
          },
          id: 'send-alert',
          name: 'Uyarı Gönder',
          type: 'n8n-nodes-base.telegram',
          typeVersion: 1.1,
          position: [900, 200]
        }
      ],
      connections: {
        'Sistem Kontrol Zamanlayıcısı': {
          main: [
            [
              {
                node: 'Sistem Sağlık Kontrolü',
                type: 'main',
                index: 0
              }
            ]
          ]
        },
        'Sistem Sağlık Kontrolü': {
          main: [
            [
              {
                node: 'Hata Filtresi',
                type: 'main',
                index: 0
              }
            ]
          ]
        },
        'Hata Filtresi': {
          main: [
            [
              {
                node: 'Uyarı Gönder',
                type: 'main',
                index: 0
              }
            ]
          ]
        }
      },
      settings: {
        executionOrder: 'v1'
      },
      staticData: {},
      meta: {
        templateCredsSetupCompleted: true,
        instanceId: 'your-instance-id'
      },
      id: 'system-monitoring-workflow',
      tags: [
        {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          id: 'monitoring',
          name: 'Sistem İzleme'
        },
        {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          id: 'telegram-bot',
          name: 'Telegram Bot'
        }
      ]
    }
  },

  // Credentials (API key'ler)
  credentials: {
    telegram_api: {
      name: 'Telegram Bot API',
      type: 'telegramApi',
      data: {
        accessToken: process.env.TELEGRAM_BOT_TOKEN
      }
    },
    dashboard_api: {
      name: 'Dashboard API',
      type: 'httpHeaderAuth',
      data: {
        name: 'Authorization',
        value: `Bearer ${process.env.DASHBOARD_API_TOKEN}`
      }
    }
  },

  // Environment variables
  env_variables: {
    TELEGRAM_BOT_TOKEN: 'your-telegram-bot-token',
    TELEGRAM_WEBHOOK_URL: 'https://your-domain.com/api/telegram/webhook',
    ADMIN_CHAT_ID: 'your-admin-chat-id',
    DASHBOARD_API_TOKEN: 'your-dashboard-api-token',
    DASHBOARD_API_URL: 'https://your-dashboard-api.com'
  },

  // Import/Export fonksiyonları
  exportWorkflows() {
    return {
      workflows: [
        this.workflows.main_notification_workflow,
        this.workflows.system_monitoring_workflow
      ],
      credentials: this.credentials,
      metadata: {
        version: '1.0.0',
        exported_at: new Date().toISOString(),
        description: 'Botfusions Dashboard Telegram Bot Notification System'
      }
    };
  },

  generateWebhookURL(baseUrl) {
    return `${baseUrl}/api/telegram/webhook`;
  },

  // N8N'de node oluşturmak için helper fonksiyonlar
  createTelegramNode(nodeType, parameters = {}) {
    return {
      name: nodeType,
      type: 'n8n-nodes-base.telegram',
      typeVersion: 1.1,
      position: [0, 0],
      parameters: {
        resource: 'message',
        operation: 'send',
        ...parameters
      }
    };
  },

  createHTTPCheckNode(name, url, interval = 5) {
    return {
      name,
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [0, 0],
      parameters: {
        method: 'GET',
        url,
        options: {
          timeout: interval * 1000
        }
      },
      schedule: {
        rules: [
          {
            cronExpression: `*/${interval} * * * *`
          }
        ]
      }
    };
  }
};

module.exports = N8N_TELEGRAM_CONFIG;