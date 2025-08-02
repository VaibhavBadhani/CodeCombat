/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out forwards',
        'fade-in-delay': 'fadeIn 0.5s ease-in-out 0.3s forwards',
        'fade-in-delay-2': 'fadeIn 0.5s ease-in-out 0.6s forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  safelist: [
    // Generate color classes for dynamic usage
    'bg-blue-500', 'bg-blue-600', 'text-blue-400', 'border-blue-500', 'bg-blue-500/20', 'shadow-blue-500/30',
    'bg-purple-500', 'bg-purple-600', 'text-purple-400', 'border-purple-500', 'bg-purple-500/20', 'shadow-purple-500/30',
    'bg-green-500', 'bg-green-600', 'text-green-400', 'border-green-500', 'bg-green-500/20', 'shadow-green-500/30',
    'bg-pink-500', 'bg-pink-600', 'text-pink-400', 'border-pink-500', 'bg-pink-500/20', 'shadow-pink-500/30',
    'bg-yellow-500', 'bg-yellow-600', 'text-yellow-400', 'border-yellow-500', 'bg-yellow-500/20', 'shadow-yellow-500/30',
    'bg-indigo-500', 'bg-indigo-600', 'text-indigo-400', 'border-indigo-500', 'bg-indigo-500/20', 'shadow-indigo-500/30',
    'bg-red-500', 'bg-red-600', 'text-red-400', 'border-red-500', 'bg-red-500/20', 'shadow-red-500/30',
  ],
  plugins: [],
}