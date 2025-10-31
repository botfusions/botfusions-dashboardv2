import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0D0C12',
          secondary: '#1A1820',
          tertiary: '#2D2B35',
        },
        primary: {
          purple: '#7B3FE4',
          blue: '#2F89FC',
        },
        success: '#4ADE80',
        warning: '#FBBF24',
        error: '#EF4444',
        text: {
          primary: '#FFFFFF',
          secondary: '#B4B0BC',
          tertiary: '#8B8793',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'card': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'elevation': '0 12px 48px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}

export default config
