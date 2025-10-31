/**
 * N8N SMTP Node Configuration
 * Botfusions Dashboard Email Notification System için N8N workflow konfigürasyonu
 */

const N8N_SMTP_CONFIG = {
  // SMTP Node Configuration
  smtpNode: {
    parameters: {
      // Host settings
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      
      // Authentication
      username: '={{$env.GMAIL_USER}}',
      password: '={{$env.GMAIL_APP_PASSWORD}}',
      
      // SSL/TLS settings
      allowUnauthorizedCerts: false,
      timeout: 10000,
      
      // Gmail specific settings
      gmail: true,
      oauth2: false // Using app password instead
    },
    
    // Email headers and settings
    options: {
      forceNew: false,
      pool: true,
      rateDelta: 1000,
      rateLimit: 100,
      tls: {
        rejectUnauthorized: false
      },
      dkim: {
        domainName: 'botfusions.com',
        keySelector: 'default',
        privateKey: '={{$env.DKIM_PRIVATE_KEY}}'
      }
    }
  },

  // SendGrid Node Alternative Configuration
  sendgridNode: {
    parameters: {
      apiKey: '={{$env.SENDGRID_API_KEY}}',
      fromEmail: '={{$env.FROM_EMAIL}}',
      fromName: 'Botfusions Dashboard',
      
      // Template settings
      templateId: null, // Use dynamic HTML instead
      dynamicTemplateData: {
        userName: '={{ $json.user.name }}',
        userEmail: '={{ $json.user.email }}',
        companyName: 'Botfusions',
        dashboardUrl: '={{ $env.DASHBOARD_URL }}'
      }
    },
    
    options: {
      mailSettings: {
        sandboxMode: {
          enable: '={{ $env.NODE_ENV === "development" }}'
        }
      },
      trackingSettings: {
        clickTracking: {
          enable: true,
          enableText: false
        },
        openTracking: {
          enable: true,
          substitutionTag: '%open-track%'
        },
        subscriptionTracking: {
          enable: true
        }
      }
    }
  }
};

// N8N Workflow Configuration
const N8N_WORKFLOWS = {
  // Welcome Email Workflow
  welcomeWorkflow: {
    name: 'Botfusions Welcome Email',
    active: true,
    nodes: [
      {
        parameters: {
          httpMethod: 'POST',
          path: 'welcome-email',
          responseMode: 'responseNode',
          options: {}
        },
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1,
        position: [240, 300],
        webhookId: 'welcome-email-webhook'
      },
      {
        parameters: {
          jsCode: `
            // User data validation and preparation
            const userData = $input.first().json;
            
            // Validate required fields
            if (!userData.email || !userData.name) {
              throw new Error('Email and name are required');
            }
            
            // Prepare email data
            const emailData = {
              to: userData.email,
              subject: '🎉 Botfusions Dashboard\'a Hoş Geldiniz!',
              template: 'welcome',
              data: {
                user: {
                  name: userData.name,
                  email: userData.email,
                  id: userData.id
                },
                dashboardUrl: $env.DASHBOARD_URL,
                supportUrl: $env.DASHBOARD_URL + '/support',
                logoUrl: $env.COMPANY_LOGO_URL,
                companyUrl: $env.COMPANY_URL,
                privacyUrl: $env.COMPANY_URL + '/privacy',
                termsUrl: $env.COMPANY_URL + '/terms'
              }
            };
            
            return [{ json: emailData }];
          `
        },
        name: 'Prepare Welcome Data',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [460, 300]
      },
      {
        parameters: {
          resource: 'message',
          operation: 'send',
          fromEmail: '={{$env.FROM_EMAIL}}',
          fromName: 'Botfusions Dashboard',
          subject: '={{$json.subject}}',
          messageType: 'html',
          emailType: 'html',
          message: `
            <!DOCTYPE html>
            <html lang="tr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Botfusions Dashboard - Hoş Geldiniz</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                    .header { text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; margin: -30px -30px 30px -30px; }
                    .logo { max-width: 120px; margin-bottom: 20px; }
                    .company-name { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
                    .greeting { font-size: 24px; color: #2c3e50; margin-bottom: 20px; font-weight: bold; }
                    .message { font-size: 16px; line-height: 1.8; margin-bottom: 25px; color: #555; }
                    .features { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea; }
                    .features h3 { margin-top: 0; color: #2c3e50; }
                    .features ul { list-style: none; padding: 0; }
                    .features li { padding: 8px 0; padding-left: 25px; position: relative; }
                    .features li:before { content: "✓"; position: absolute; left: 0; color: #27ae60; font-weight: bold; }
                    .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
                    @media (max-width: 600px) { .container { margin: 10px; padding: 20px; } .header { margin: -20px -20px 20px -20px; padding: 20px; } }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="{{$json.data.logoUrl}}" alt="Botfusions Logo" class="logo">
                        <h1 class="company-name">Botfusions</h1>
                        <p>Hoş Geldiniz!</p>
                    </div>
                    
                    <h2 class="greeting">Merhaba {{$json.data.user.name}}!</h2>
                    
                    <div class="message">
                        Botfusions Dashboard'a hoş geldiniz! Hesabınız başarıyla oluşturuldu ve artık tüm özelliklerden yararlanabilirsiniz.
                    </div>
                    
                    <div class="features">
                        <h3>Dashboard Özellikleri</h3>
                        <ul>
                            <li>Gerçek zamanlı veri analizi</li>
                            <li>Özelleştirilebilir raporlar</li>
                            <li>Gelişmiş bildirim sistemi</li>
                            <li>Kullanıcı dostu arayüz</li>
                            <li>Güvenli veri yönetimi</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="{{$json.data.dashboardUrl}}" class="cta-button">Dashboard'a Git</a>
                    </div>
                    
                    <div class="message">
                        Herhangi bir sorunuz olursa, lütfen destek ekibimizle iletişime geçmekten çekinmeyin.
                    </div>
                </div>
                
                <div class="footer">
                    <p>© {{ new Date().getFullYear() }} Botfusions - Tüm hakları saklıdır</p>
                    <p>
                        <a href="{{$json.data.privacyUrl}}">Gizlilik Politikası</a> | 
                        <a href="{{$json.data.termsUrl}}">Kullanım Şartları</a>
                    </p>
                </div>
            </body>
            </html>
          `
        },
        name: 'Send Welcome Email',
        type: 'n8n-nodes-base.emailSend',
        typeVersion: 2,
        position: [680, 300],
        credentials: {
          smtp: {
            id: 'gmail-smtp',
            name: 'Gmail SMTP'
          }
        }
      },
      {
        parameters: {
          method: 'POST',
          url: '{{$env.SUPABASE_URL}}/rest/v1/email_tracking',
          authentication: 'serviceAccount',
          sendHeaders: true,
          headerParameters: {
            parameters: [
              {
                name: 'apikey',
                value: '={{$env.SUPABASE_SERVICE_ROLE_KEY}}'
              },
              {
                name: 'Authorization',
                value: 'Bearer {{$env.SUPABASE_SERVICE_ROLE_KEY}}'
              }
            ]
          },
          sendBody: true,
          bodyParameters: {
            parameters: [
              {
                name: 'user_id',
                value: '={{$("Prepare Welcome Data").item.json.user.id}}'
              },
              {
                name: 'email_type',
                value: 'welcome'
              },
              {
                name: 'recipient',
                value: '={{$("Prepare Welcome Data").item.json.data.user.email}}'
              },
              {
                name: 'subject',
                value: '={{$("Prepare Welcome Data").item.json.subject}}'
              },
              {
                name: 'status',
                value: 'sent'
              }
            ]
          },
          options: {}
        },
        name: 'Track Email',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4,
        position: [900, 300]
      },
      {
        parameters: {
          code: `
            const result = $input.all();
            
            return {
              json: {
                success: true,
                message: 'Welcome email sent successfully',
                user: result[0].json,
                tracking: result[1].json
              }
            };
          `
        },
        name: 'Response',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [1120, 300]
      }
    ],
    
    connections: {
      'Webhook': {
        main: [
          [
            {
              'node': 'Prepare Welcome Data',
              'type': 'main',
              'index': 0
            }
          ]
        ]
      },
      'Prepare Welcome Data': {
        main: [
          [
            {
              'node': 'Send Welcome Email',
              'type': 'main',
              'index': 0
            }
          ]
        ]
      },
      'Send Welcome Email': {
        main: [
          [
            {
              'node': 'Track Email',
              'type': 'main',
              'index': 0
            }
          ]
        ]
      },
      'Track Email': {
        main: [
          [
            {
              'node': 'Response',
              'type': 'main',
              'index': 0
            }
          ]
        ]
      }
    },
    
    settings: {
      timezone: 'Europe/Istanbul',
      saveManualExecutions: true
    }
  },

  // Alert Email Workflow
  alertWorkflow: {
    name: 'Botfusions Alert Email',
    active: true,
    nodes: [
      {
        parameters: {
          httpMethod: 'POST',
          path: 'alert-email',
          responseMode: 'responseNode',
          options: {}
        },
        name: 'Alert Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1,
        position: [240, 300],
        webhookId: 'alert-email-webhook'
      },
      {
        parameters: {
          conditions: {
            string: [
              {
                value1: '={{$json.alert_type}}',
                operation: 'equal',
                value2: 'error'
              }
            ]
          },
          combineOperation: 'any',
          options: {}
        },
        name: 'Check Alert Type',
        type: 'n8n-nodes-base.if',
        typeVersion: 2,
        position: [460, 300]
      },
      {
        parameters: {
          jsCode: `
            // Prepare alert email data
            const alertData = $input.first().json;
            
            // Determine priority and subject based on alert type
            let priority = 'normal';
            let emoji = '📢';
            
            switch (alertData.alert_type) {
              case 'error':
                priority = 'high';
                emoji = '❌';
                break;
              case 'warning':
                priority = 'normal';
                emoji = '⚠️';
                break;
              case 'info':
                priority = 'low';
                emoji = 'ℹ️';
                break;
              case 'success':
                priority = 'low';
                emoji = '✅';
                break;
            }
            
            const emailData = {
              to: alertData.user_email,
              subject: \`\${emoji} \${alertData.title}\`,
              template: 'alert',
              data: {
                user: {
                  name: alertData.user_name,
                  email: alertData.user_email,
                  id: alertData.user_id
                },
                alert_type: alertData.alert_type,
                alert_title: alertData.title,
                alert_message: alertData.message,
                alert_priority: priority,
                alert_data: alertData.data,
                action_url: alertData.action_url,
                dashboard_url: $env.DASHBOARD_URL,
                support_url: $env.DASHBOARD_URL + '/support',
                unsubscribe_url: $env.DASHBOARD_URL + '/settings/notifications'
              }
            };
            
            return [{ json: emailData }];
          `
        },
        name: 'Prepare Alert Data',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [680, 200]
      },
      {
        parameters: {
          jsCode: `
            // Prepare error-specific alert email data
            const alertData = $input.first().json;
            
            const emailData = {
              to: alertData.user_email,
              subject: \`🚨 Acil: \${alertData.title}\`,
              template: 'alert',
              data: {
                user: {
                  name: alertData.user_name,
                  email: alertData.user_email,
                  id: alertData.user_id
                },
                alert_type: 'error',
                alert_title: alertData.title,
                alert_message: alertData.message,
                alert_priority: 'urgent',
                alert_data: alertData.data,
                action_url: alertData.action_url,
                dashboard_url: $env.DASHBOARD_URL,
                support_url: $env.DASHBOARD_URL + '/support',
                unsubscribe_url: $env.DASHBOARD_URL + '/settings/notifications'
              }
            };
            
            return [{ json: emailData }];
          `
        },
        name: 'Prepare Error Alert Data',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [680, 400]
      },
      {
        parameters: {
          resource: 'message',
          operation: 'send',
          fromEmail: '={{$env.FROM_EMAIL}}',
          fromName: 'Botfusions Dashboard',
          subject: '={{$json.subject}}',
          messageType: 'html',
          emailType: 'html',
          message: `
            <!DOCTYPE html>
            <html lang="tr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>{{$json.data.alert_title}}</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                    .header { text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; margin: -30px -30px 30px -30px; }
                    .logo { max-width: 120px; margin-bottom: 20px; }
                    .company-name { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
                    .greeting { font-size: 24px; color: #2c3e50; margin-bottom: 20px; font-weight: bold; }
                    .alert-box { padding: 20px; border-radius: 8px; margin: 25px 0; font-weight: 500; }
                    .alert-error { background-color: #ffebee; color: #c62828; border-left: 4px solid #f44336; }
                    .alert-warning { background-color: #fff3e0; color: #ef6c00; border-left: 4px solid #ff9800; }
                    .alert-info { background-color: #e3f2fd; color: #1565c0; border-left: 4px solid #2196f3; }
                    .alert-success { background-color: #e8f5e8; color: #2e7d32; border-left: 4px solid #4caf50; }
                    .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; }
                    .details h3 { margin-top: 0; color: #2c3e50; }
                    .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
                    @media (max-width: 600px) { .container { margin: 10px; padding: 20px; } .header { margin: -20px -20px 20px -20px; padding: 20px; } }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="{{$env.COMPANY_LOGO_URL}}" alt="Botfusions Logo" class="logo">
                        <h1 class="company-name">Botfusions</h1>
                        <p>⚠️ Önemli Bildirim</p>
                    </div>
                    
                    <h2 class="greeting">Merhaba {{$json.data.user.name}},</h2>
                    
                    <div class="alert-box alert-{{$json.data.alert_type}}">
                        <strong>{{$json.data.alert_title}}</strong><br>
                        {{$json.data.alert_message}}
                    </div>
                    
                    <div class="details">
                        <h3>Bildirim Detayları</h3>
                        <p><strong>Zaman:</strong> {{ new Date().toLocaleString('tr-TR') }}</p>
                        <p><strong>Öncelik:</strong> {{$json.data.alert_priority}}</p>
                        {{#if $json.data.action_url}}
                        <p><strong>Gerekli Aksiyon:</strong> Bu bildirimi incelemeniz önerilir</p>
                        {{/if}}
                    </div>
                    
                    {{#if $json.data.alert_data}}
                    <div class="details">
                        <h3>İlgili Veriler</h3>
                        <pre style="background: #f1f1f1; padding: 15px; border-radius: 5px; overflow-x: auto;">{{$json.data.alert_data}}</pre>
                    </div>
                    {{/if}}
                    
                    {{#if $json.data.action_url}}
                    <div style="text-align: center;">
                        <a href="{{$json.data.action_url}}" class="cta-button">Detayları Görüntüle</a>
                    </div>
                    {{/if}}
                    
                    <div style="margin-top: 25px; padding: 15px; background: #f8f9fa; border-radius: 5px; font-size: 14px;">
                        Bu bildirim otomatik olarak gönderilmiştir. Acil durumlar için lütfen doğrudan destek ekibimizle iletişime geçin.
                    </div>
                </div>
                
                <div class="footer">
                    <p>© {{ new Date().getFullYear() }} Botfusions - Tüm hakları saklıdır</p>
                    <p>
                        <a href="{{$json.data.dashboard_url}}">Dashboard</a> | 
                        <a href="{{$json.data.support_url}}">Destek</a> | 
                        <a href="{{$json.data.unsubscribe_url}}">Bildirimleri Yönet</a>
                    </p>
                </div>
            </body>
            </html>
          `
        },
        name: 'Send Alert Email',
        type: 'n8n-nodes-base.emailSend',
        typeVersion: 2,
        position: [900, 300],
        credentials: {
          smtp: {
            id: 'gmail-smtp',
            name: 'Gmail SMTP'
          }
        }
      },
      {
        parameters: {
          code: `
            const result = $input.all();
            
            return {
              json: {
                success: true,
                message: 'Alert email sent successfully',
                data: result
              }
            };
          `
        },
        name: 'Alert Response',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [1120, 300]
      }
    ],
    
    connections: {
      'Alert Webhook': {
        main: [
          [
            {
              'node': 'Check Alert Type',
              'type': 'main',
              'index': 0
            }
          ]
        ]
      },
      'Check Alert Type': {
        main: [
          [
            {
              'node': 'Prepare Alert Data',
              'type': 'main',
              'index': 0
            }
          ],
          [
            {
              'node': 'Prepare Error Alert Data',
              'type': 'main',
              'index': 0
            }
          ]
        ]
      },
      'Prepare Alert Data': {
        main: [
          [
            {
              'node': 'Send Alert Email',
              'type': 'main',
              'index': 0
            }
          ]
        ]
      },
      'Prepare Error Alert Data': {
        main: [
          [
            {
              'node': 'Send Alert Email',
              'type': 'main',
              'index': 0
            }
          ]
        ]
      },
      'Send Alert Email': {
        main: [
          [
            {
              'node': 'Alert Response',
              'type': 'main',
              'index': 0
            }
          ]
        ]
      }
    },
    
    settings: {
      timezone: 'Europe/Istanbul',
      saveManualExecutions: true
    }
  },

  // Daily Digest Workflow
  digestWorkflow: {
    name: 'Botfusions Daily Digest',
    active: true,
    nodes: [
      {
        parameters: {
          rule: {
            interval: [
              {
                field: 'hours',
                value: 24
              }
            ]
          }
        },
        name: 'Daily Trigger',
        type: 'n8n-nodes-base.cron',
        typeVersion: 1,
        position: [240, 300]
      },
      {
        parameters: {
          method: 'GET',
          url: '{{$env.SUPABASE_URL}}/rest/v1/users?status=eq.active&select=id,email,full_name,preferences',
          authentication: 'serviceAccount',
          sendHeaders: true,
          headerParameters: {
            parameters: [
              {
                name: 'apikey',
                value: '={{$env.SUPABASE_SERVICE_ROLE_KEY}}'
              },
              {
                name: 'Authorization',
                value: 'Bearer {{$env.SUPABASE_SERVICE_ROLE_KEY}}'
              }
            ]
          },
          options: {}
        },
        name: 'Get Active Users',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4,
        position: [460, 300]
      },
      {
        parameters: {
          jsCode: `
            // Filter users who want daily digest
            const users = $input.all();
            const digestUsers = [];
            
            users.forEach(user => {
              if (user.json.preferences?.daily_digest !== false) {
                digestUsers.push(user.json);
              }
            });
            
            return digestUsers.map(user => ({
              json: {
                user: user,
                digest_data: {
                  summary: [
                    { label: 'Toplam Kullanıcı', value: Math.floor(Math.random() * 1000) + 500 },
                    { label: 'Aktif Oturum', value: Math.floor(Math.random() * 200) + 50 },
                    { label: 'Tamamlanan Görevler', value: Math.floor(Math.random() * 50) + 10 }
                  ],
                  activities: [
                    { description: 'Dashboard girişi', time: '2 saat önce' },
                    { description: 'Rapor oluşturuldu', time: '4 saat önce' },
                    { description: 'Profil güncellendi', time: '1 gün önce' }
                  ],
                  performers: [
                    { rank: 1, name: 'Ahmet Yılmaz', score: 95, trend: '↗️' },
                    { rank: 2, name: 'Fatma Demir', score: 87, trend: '→' },
                    { rank: 3, name: 'Mehmet Kaya', score: 82, trend: '↗️' }
                  ]
                }
              }
            }));
          `
        },
        name: 'Prepare Digest Data',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [680, 300]
      },
      {
        parameters: {
          resource: 'message',
          operation: 'send',
          fromEmail: '={{$env.FROM_EMAIL}}',
          fromName: 'Botfusions Dashboard',
          subject: '📬 Günlük Dashboard Özeti',
          messageType: 'html',
          emailType: 'html',
          message: `
            <!DOCTYPE html>
            <html lang="tr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Günlük Dashboard Özeti</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                    .header { text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; margin: -30px -30px 30px -30px; }
                    .logo { max-width: 120px; margin-bottom: 20px; }
                    .company-name { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
                    .greeting { font-size: 24px; color: #2c3e50; margin-bottom: 20px; font-weight: bold; }
                    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 20px; margin: 30px 0; }
                    .stat-item { text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef; }
                    .stat-number { font-size: 32px; font-weight: bold; color: #667eea; display: block; }
                    .stat-label { font-size: 14px; color: #6c757d; margin-top: 5px; }
                    .section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea; }
                    .section h3 { margin-top: 0; color: #2c3e50; }
                    .activities ul { list-style: none; padding: 0; }
                    .activities li { padding: 8px 0; border-bottom: 1px solid #eee; }
                    .activities li:last-child { border-bottom: none; }
                    .performers table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    .performers th, .performers td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                    .performers th { background-color: #f8f9fa; font-weight: bold; }
                    .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
                    @media (max-width: 600px) { .container { margin: 10px; padding: 20px; } .header { margin: -20px -20px 20px -20px; padding: 20px; } .stats-grid { grid-template-columns: repeat(2, 1fr); } }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="{{$env.COMPANY_LOGO_URL}}" alt="Botfusions Logo" class="logo">
                        <h1 class="company-name">Botfusions</h1>
                        <p>📬 Günlük Özet</p>
                    </div>
                    
                    <h2 class="greeting">Merhaba {{$json.user.full_name}},</h2>
                    
                    <div class="message">
                        İşte bugün {{$env.COMPANY_NAME}} Dashboard'unuzda yaşananlar:
                    </div>
                    
                    <div class="stats-grid">
                        {{#each $json.digest_data.summary}}
                        <div class="stat-item">
                            <span class="stat-number">{{this.value}}</span>
                            <div class="stat-label">{{this.label}}</div>
                        </div>
                        {{/each}}
                    </div>
                    
                    <div class="section">
                        <h3>Son Aktiviteler</h3>
                        <div class="activities">
                            <ul>
                                {{#each $json.digest_data.activities}}
                                <li>{{this.description}} <small style="color: #888;">({{this.time}})</small></li>
                                {{/each}}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h3>En Çok Performans Gösterenler</h3>
                        <div class="performers">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Sıralama</th>
                                        <th>İsim</th>
                                        <th>Skor</th>
                                        <th>Trend</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {{#each $json.digest_data.performers}}
                                    <tr>
                                        <td>{{this.rank}}</td>
                                        <td>{{this.name}}</td>
                                        <td>{{this.score}}</td>
                                        <td>{{this.trend}}</td>
                                    </tr>
                                    {{/each}}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="{{$env.DASHBOARD_URL}}" class="cta-button">Dashboard'u Ziyaret Et</a>
                    </div>
                    
                    <div style="margin-top: 25px; padding: 15px; background: #e8f5e8; border-radius: 5px; font-size: 14px; border-left: 4px solid #4caf50;">
                        <strong>Harika gün!</strong> Dashboard'unuzda kayda değer ilerlemeler var. Devam edin! 🚀
                    </div>
                </div>
                
                <div class="footer">
                    <p>© {{ new Date().getFullYear() }} Botfusions - Tüm hakları saklıdır</p>
                    <p>
                        <a href="{{$env.DASHBOARD_URL}}">Dashboard</a> | 
                        <a href="{{$env.DASHBOARD_URL}}/settings">Ayarlar</a> | 
                        <a href="{{$env.DASHBOARD_URL}}/unsubscribe">Abonelikten Çık</a>
                    </p>
                </div>
            </body>
            </html>
          `
        },
        name: 'Send Digest Email',
        type: 'n8n-nodes-base.emailSend',
        typeVersion: 2,
        position: [900, 300],
        credentials: {
          smtp: {
            id: 'gmail-smtp',
            name: 'Gmail SMTP'
          }
        }
      }
    ],
    
    connections: {
      'Daily Trigger': {
        main: [
          [
            {
              'node': 'Get Active Users',
              'type': 'main',
              'index': 0
            }
          ]
        ]
      },
      'Get Active Users': {
        main: [
          [
            {
              'node': 'Prepare Digest Data',
              'type': 'main',
              'index': 0
            }
          ]
        ]
      },
      'Prepare Digest Data': {
        main: [
          [
            {
              'node': 'Send Digest Email',
              'type': 'main',
              'index': 0
            }
          ]
        ]
      }
    },
    
    settings: {
      timezone: 'Europe/Istanbul',
      saveManualExecutions: true
    }
  }
};

// N8N Credential Configuration
const N8N_CREDENTIALS = {
  gmailSmtp: {
    name: 'Gmail SMTP',
    type: 'smtp',
    data: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      username: '={{$env.GMAIL_USER}}',
      password: '={{$env.GMAIL_APP_PASSWORD}}',
      allowUnauthorizedCerts: false,
      timeout: 10000
    }
  },
  
  supabaseApi: {
    name: 'Supabase API',
    type: 'httpHeaderAuth',
    data: {
      name: 'apikey',
      value: '={{$env.SUPABASE_ANON_KEY}}'
    }
  }
};

// Environment Variables Required
const REQUIRED_ENV_VARS = [
  'GMAIL_USER',
  'GMAIL_APP_PASSWORD', 
  'FROM_EMAIL',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DASHBOARD_URL',
  'COMPANY_LOGO_URL',
  'COMPANY_URL'
];

module.exports = {
  N8N_SMTP_CONFIG,
  N8N_WORKFLOWS,
  N8N_CREDENTIALS,
  REQUIRED_ENV_VARS
};