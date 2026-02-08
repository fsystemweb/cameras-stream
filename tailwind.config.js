/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,scss,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // blue-500
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#60A5FA', // blue-400
          foreground: '#FFFFFF',
        },
        cta: {
          DEFAULT: '#F97316', // orange-500
          foreground: '#FFFFFF',
        },
        background: '#F8FAFC', // slate-50
        surface: '#FFFFFF',
        text: {
          DEFAULT: '#1E293B', // slate-800
          muted: '#64748B', // slate-500
        }
      },
      fontFamily: {
        sans: ['"Fira Sans"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
}

