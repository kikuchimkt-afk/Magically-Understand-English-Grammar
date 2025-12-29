/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-bg': '#f0f4f8',
        'noun': '#3b82f6', // Blue for Nouns
        'verb': '#ef4444', // Red for Verbs
        'adj': '#10b981', // Green for Adjectives
      },
    },
  },
  plugins: [],
}
