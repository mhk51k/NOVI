/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Charte NOVI — bleu de marque tiré du logo, cf. src/styles/tokens.css
        brand: {
          DEFAULT: 'var(--color-brand)',
          light: 'var(--color-brand-light)',
          dark: 'var(--color-brand-dark)',
        },
        accent: 'var(--color-accent)',
        ink: 'var(--color-ink)',
        surface: 'var(--color-surface)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        brand: 'var(--radius-brand)',
      },
      maxWidth: {
        container: 'var(--container-max)',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
};
