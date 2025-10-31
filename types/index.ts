export * from './database'

export interface ChartDataPoint {
  name: string
  value: number
  timestamp?: string
}

export interface DashboardMetrics {
  revenue: number
  customers: number
  sku: number
  profitMargin: number
}

export interface ChatMessage {
  id: string
  question: string
  response: string
  timestamp: string
}

export interface AlertType {
  id: string
  title: string
  description: string
  severity: 'info' | 'warning' | 'critical'
  createdAt: string
}

export interface CompetitorData {
  id: string
  name: string
  website: string
  keywordsCount: number
  estimatedTraffic: number
  backlinks: number
  lastUpdated: string
}

export interface ReportData {
  id: string
  title: string
  content: string
  type: 'weekly' | 'monthly' | 'custom'
  generatedAt: string
}
