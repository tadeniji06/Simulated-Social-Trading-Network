/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#2F6D38',  
        'secondary-green': '#3D8050', 
        'accent-green': '#81B29A',  
        'primary-grey': '#4A4A4A', 
        'secondary-grey': '#6D6D6D', 
        'primary-purple': '#8E44AD', 
        'tertiary-green': '#264E36',  
        'background': '#F4F4F4', 
        'border': '#D1D1D1'  
      }
      
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
}