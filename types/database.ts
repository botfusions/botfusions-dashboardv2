export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: Tenant
        Insert: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Tenant, 'id' | 'created_at'>>
      }
      users: {
        Row: User
        Insert: Omit<User, 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'created_at'>>
      }
      user_tenants: {
        Row: UserTenant
        Insert: Omit<UserTenant, 'id' | 'created_at'>
        Update: Partial<Omit<UserTenant, 'id' | 'created_at'>>
      }
      metrics: {
        Row: Metric
        Insert: Omit<Metric, 'id' | 'created_at'>
        Update: Partial<Omit<Metric, 'id' | 'created_at'>>
      }
      keywords: {
        Row: Keyword
        Insert: Omit<Keyword, 'id' | 'created_at'>
        Update: Partial<Omit<Keyword, 'id' | 'created_at'>>
      }
      competitors: {
        Row: Competitor
        Insert: Omit<Competitor, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Competitor, 'id' | 'created_at'>>
      }
      competitor_snapshots: {
        Row: CompetitorSnapshot
        Insert: Omit<CompetitorSnapshot, 'id' | 'created_at'>
        Update: Partial<Omit<CompetitorSnapshot, 'id' | 'created_at'>>
      }
      chat_history: {
        Row: ChatMessage
        Insert: Omit<ChatMessage, 'id' | 'created_at'>
        Update: Partial<Omit<ChatMessage, 'id' | 'created_at'>>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'id' | 'created_at' | 'sent_at'>
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>
      }
      tenant_settings: {
        Row: TenantSetting
        Insert: Omit<TenantSetting, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<TenantSetting, 'id' | 'created_at'>>
      }
      reports: {
        Row: Report
        Insert: Omit<Report, 'id' | 'created_at'>
        Update: Partial<Omit<Report, 'id' | 'created_at'>>
      }
      alerts: {
        Row: Alert
        Insert: Omit<Alert, 'id' | 'created_at'>
        Update: Partial<Omit<Alert, 'id' | 'created_at'>>
      }
    }
    Views: Record<string, unknown>
    Functions: Record<string, unknown>
    Enums: Record<string, unknown>
  }
}

export interface Tenant {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'viewer' | 'editor' | 'admin'
  created_at: string
  updated_at: string
}

export interface UserTenant {
  id: string
  user_id: string
  tenant_id: string
  role: 'viewer' | 'editor' | 'admin'
  created_at: string
}

export interface Metric {
  id: string
  tenant_id: string
  revenue: number | null
  customers: number | null
  sku: number | null
  profit_margin: number | null
  date: string
  created_at: string
}

export interface Keyword {
  id: string
  tenant_id: string
  keyword: string
  position: number | null
  search_volume: number | null
  difficulty: number | null
  url: string | null
  last_updated: string
  created_at: string
}

export interface Competitor {
  id: string
  tenant_id: string
  name: string
  website: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface CompetitorSnapshot {
  id: string
  competitor_id: string
  keywords_count: number | null
  estimated_traffic: number | null
  backlinks: number | null
  snapshot_date: string
  created_at: string
}

export interface ChatMessage {
  id: string
  tenant_id: string
  user_id: string
  message: string
  response: string | null
  message_type: 'user' | 'assistant'
  created_at: string
}

export interface Notification {
  id: string
  tenant_id: string
  user_id: string
  type: 'email' | 'telegram' | 'webhook'
  recipient: string
  subject: string | null
  message: string
  status: 'pending' | 'sent' | 'failed'
  created_at: string
  sent_at: string | null
}

export interface TenantSetting {
  id: string
  tenant_id: string
  key: string
  value: string | null
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  tenant_id: string
  title: string
  content: string | null
  report_type: 'weekly' | 'monthly' | 'custom' | null
  generated_by: string | null
  created_at: string
}

export interface Alert {
  id: string
  tenant_id: string
  title: string
  description: string | null
  severity: 'info' | 'warning' | 'critical'
  read: boolean
  created_at: string
}
