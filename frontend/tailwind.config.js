/** @type {import('tailwindcss').Config} */
export default {
  /**
   * Tailwind Dark Mode Strategy:
   * 'class' = toggle by adding/removing 'dark' class on <html>
   * Light theme is the DEFAULT (no class). Dark theme requires class="dark" on html.
   */
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /**
         * App surface color tokens - all backed by CSS custom properties.
         * Values flip automatically between :root (light) and .dark (dark).
         * Supports Tailwind opacity modifiers via rgb() syntax.
         */
        app: {
          bg:           'rgb(var(--app-bg) / <alpha-value>)',
          sidebar:      'rgb(var(--app-sidebar) / <alpha-value>)',
          surface:      'rgb(var(--app-surface) / <alpha-value>)',
          card:         'rgb(var(--app-card) / <alpha-value>)',
          hover:        'rgb(var(--app-hover) / <alpha-value>)',
          border:       'rgb(var(--app-border) / <alpha-value>)',
          borderSubtle: 'rgb(var(--app-borderSubtle) / <alpha-value>)',
          divider:      'rgb(var(--app-divider) / <alpha-value>)',
        },
        /**
         * Zinc scale override - backed by CSS vars.
         * In light mode: scale is INVERTED (zinc-100 = dark text, zinc-800 = light surface).
         * In dark mode: scale is NORMAL (zinc-100 = light text, zinc-800 = dark surface).
         * This allows the entire codebase to work in both themes without changing component files.
         */
        zinc: {
          50:  'rgb(var(--zinc-50)  / <alpha-value>)',
          100: 'rgb(var(--zinc-100) / <alpha-value>)',
          200: 'rgb(var(--zinc-200) / <alpha-value>)',
          300: 'rgb(var(--zinc-300) / <alpha-value>)',
          400: 'rgb(var(--zinc-400) / <alpha-value>)',
          500: 'rgb(var(--zinc-500) / <alpha-value>)',
          600: 'rgb(var(--zinc-600) / <alpha-value>)',
          700: 'rgb(var(--zinc-700) / <alpha-value>)',
          750: 'rgb(var(--zinc-750) / <alpha-value>)',
          800: 'rgb(var(--zinc-800) / <alpha-value>)',
          900: 'rgb(var(--zinc-900) / <alpha-value>)',
          950: 'rgb(var(--zinc-950) / <alpha-value>)',
        },
        /**
         * White override - in light mode, 'white' maps to near-black so
         * text-white becomes dark readable text on a light background.
         * In dark mode, 'white' remains pure white as expected.
         */
        white: 'rgb(var(--color-white) / <alpha-value>)',
        /**
         * Semantic accent colors - same in both light and dark themes.
         * These are intentionally NOT linked to CSS vars.
         */
        accent: {
          blue:    '#3B82F6',
          indigo:  '#6366F1',
          emerald: '#10B981',
          amber:   '#F59E0B',
          rose:    '#F43F5E',
          cyan:    '#06B6D4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
