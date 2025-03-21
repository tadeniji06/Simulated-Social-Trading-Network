/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark mode base colors
        'dark-base': '#121212',
        'dark-surface': '#1E1E1E',
        'dark-elevated': '#2D2D2D',
        
        // Primary brand colors - rich blue with teal undertones
        'primary': '#0A84FF',
        'primary-dark': '#0066CC',
        'primary-light': '#4DA3FF',
        
        // Secondary accent - vibrant purple for highlights
        'accent': '#9D4EDD',
        'accent-dark': '#7B2CBF',
        'accent-light': '#C77DFF',
        
        // Success colors - modern green tones
        'success': '#00C853',
        'success-dark': '#00A344',
        'success-light': '#5EE077',
        
        // Danger/error colors - striking red
        'danger': '#FF3B30',
        'danger-dark': '#D50000',
        'danger-light': '#FF6B6B',
        
        // Warning colors - gold/amber
        'warning': '#FFCC00',
        'warning-dark': '#FFA000',
        'warning-light': '#FFE082',
        
        // Neutral grays - cool undertones
        'gray-100': '#F5F5F5',
        'gray-200': '#E0E0E0',
        'gray-300': '#BDBDBD',
        'gray-400': '#9E9E9E',
        'gray-500': '#757575',
        'gray-600': '#616161',
        'gray-700': '#424242',
        'gray-800': '#303030',
        'gray-900': '#212121',
        
        // Chart colors
        'chart-1': '#0A84FF',
        'chart-2': '#9D4EDD',
        'chart-3': '#00C853',
        'chart-4': '#FF3B30',
        'chart-5': '#FFCC00',
        
        // Gradient components
        'gradient-start': '#0A84FF',
        'gradient-mid': '#6A5AE0',
        'gradient-end': '#9D4EDD',
        
        // Background options
        'bg-dark': '#121212',
        'bg-card': '#1E1E1E',
        'bg-elevated': '#2D2D2D',
        
        // Border colors
        'border-dark': '#424242',
        'border-light': '#616161',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0A84FF 0%, #6A5AE0 50%, #9D4EDD 100%)',
        'gradient-success': 'linear-gradient(135deg, #00C853 0%, #00A344 100%)',
        'gradient-danger': 'linear-gradient(135deg, #FF3B30 0%, #D50000 100%)',
        'gradient-dark': 'linear-gradient(135deg, #212121 0%, #121212 100%)',
        'gradient-card': 'linear-gradient(135deg, #2D2D2D 0%, #1E1E1E 100%)',
      },
      boxShadow: {
        'card': '0 4px 20px 0 rgba(0, 0, 0, 0.25)',
        'button': '0 4px 10px 0 rgba(10, 132, 255, 0.3)',
        'success': '0 4px 10px 0 rgba(0, 200, 83, 0.3)',
        'danger': '0 4px 10px 0 rgba(255, 59, 48, 0.3)',
      },
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    fontFamily: {
      'stencil': ['"Big Shoulders Stencil"', 'cursive'],
      'sans': ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      'mono': ['JetBrains Mono', 'monospace'],
    },
  },
  plugins: [],
  darkMode: 'class',
}
