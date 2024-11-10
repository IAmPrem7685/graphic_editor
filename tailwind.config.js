/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust according to your file structure
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A', // Elegant deep blue for primary elements
        secondary: '#4F8D9B', // Muted teal for accents and buttons
        background: '#F3F4F6', // Subtle light gray background
        accent: '#38BDF8', // Soft cyan accent color for links or highlights
        muted: '#A0AEC0', // Soft grayish-blue for less prominent text
        error: '#E53E3E', // Gentle red for error messages
        success: '#48BB78', // Soft green for success messages
        warning: '#F6A400', // Elegant gold-orange for warnings
        info: '#2563EB', // Rich blue for informational messages
        dark: '#2D3748', // Dark background or elements for contrast
        light: '#EDF2F7', // Very light gray for subtle contrasts
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'], // "Inter" font for modern feel
        heading: ['"Playfair Display"', 'serif'], // Elegant serif font for headings
      },
      spacing: {
        128: '32rem',
        144: '36rem',
        160: '40rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'primary-lg': '0 10px 15px -3px rgba(0, 58, 105, 0.4), 0 4px 6px -2px rgba(0, 58, 105, 0.2)', // Elegant shadow with subtle blue tint
        'secondary-sm': '0 1px 3px rgba(79, 141, 155, 0.4)', // Soft teal shadow
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        wiggle: 'wiggle 0.8s ease-in-out infinite',
        fadeIn: 'fadeIn 0.4s ease-in',
      },
      screens: {
        xs: '480px',
        '2xl': '1536px',
      },
      zIndex: {
        '-10': '-10',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
