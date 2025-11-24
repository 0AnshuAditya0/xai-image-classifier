/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark mode colors
        'dark-bg': '#0a0a1f',
        'dark-bg-secondary': '#1a1a2e',
        'dark-card': 'rgba(255, 255, 255, 0.05)',
        'dark-border': 'rgba(255, 255, 255, 0.1)',
        
        // Light mode colors
        'light-bg': '#f8f9fa',
        'light-bg-secondary': '#ffffff',
        'light-card': '#ffffff',
        'light-border': 'rgba(0, 0, 0, 0.1)',
        
        // Accent colors
        primary: '#3b82f6',
        secondary: '#1f2937',
        accent: '#10b981',
        border: '#374151',
        
        // Gradient colors
        'gradient-purple': '#8b5cf6',
        'gradient-pink': '#ec4899',
        'gradient-blue': '#3b82f6',
      },
      backgroundImage: {
        'gradient-purple-pink': 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
        'gradient-blue-purple': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0a1f 0%, #1a1a2e 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-lg': '0 12px 48px 0 rgba(31, 38, 135, 0.2)',
      },
    },
  },
  plugins: [],
};
