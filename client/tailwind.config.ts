import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // ── Brand palette ──────────────────────────────────────────────────
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // ── Accent (cyan) ─────────────────────────────────────────────────
        accent: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        // ── Dark surface palette ───────────────────────────────────────────
        surface: {
          900: '#0a0a0f',
          800: '#0f0f1a',
          750: '#12121f',
          700: '#16162a',
          600: '#1e1e35',
          500: '#252540',
          400: '#2e2e50',
          300: '#3a3a60',
        },
        // ── Status colors ─────────────────────────────────────────────────
        status: {
          passed:    '#22c55e',
          failed:    '#ef4444',
          running:   '#f59e0b',
          pending:   '#94a3b8',
          cancelled: '#6b7280',
        },
        // ── Severity colors ───────────────────────────────────────────────
        severity: {
          critical: '#dc2626',
          high:     '#ea580c',
          medium:   '#d97706',
          low:      '#65a30d',
          info:     '#0ea5e9',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(135deg, #0a0a0f 0%, #12122a 50%, #0a0a0f 100%)',
        'brand-gradient': 'linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(30,30,53,0.8) 0%, rgba(22,22,42,0.9) 100%)',
      },
      boxShadow: {
        'glow-brand': '0 0 20px rgba(99,102,241,0.3)',
        'glow-accent': '0 0 20px rgba(6,182,212,0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
