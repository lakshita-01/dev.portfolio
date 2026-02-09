/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: "#0a0a0c",
        light: "#f8f9fa",
        accent: {
          primary: "#6366f1",
          secondary: "#06b6d4"
        },
        vibrant: {
          // Dark mode palette - Vibrant neon colors
          darkBg: "#0a0a0c",
          darkCard: "#1a1a2e",
          darkCardBorder: "#16213e",
          neon: {
            purple: "#a855f7",
            pink: "#ec4899",
            cyan: "#06b6d4",
            lime: "#84cc16",
            orange: "#f97316",
            blue: "#3b82f6",
            violet: "#8b5cf6"
          },
          // Light mode palette - Vibrant bright colors
          lightBg: "#f8f9fa",
          lightCard: "#ffffff",
          lightCardBorder: "#e5e7eb",
          light: {
            purple: "#9333ea",
            pink: "#db2777",
            cyan: "#0891b2",
            lime: "#65a30d",
            orange: "#ea580c",
            blue: "#1d4ed8",
            violet: "#7c3aed"
          }
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
