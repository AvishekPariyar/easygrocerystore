import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: 'var(--color-primary)',
          600: 'var(--color-primary-dull)',
        },
      },
    },
  },
  plugins: [
    forms,
  ],
}
