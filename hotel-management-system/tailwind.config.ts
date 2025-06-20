import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // Though pages dir might not be used with App Router by default
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // './src/**/*.{js,ts,jsx,tsx,mdx}', // Only if a src directory is used
  ],
  theme: {
    extend: {
      // Example extensions:
      // colors: {
      //   brand: '#123456',
      // },
    },
  },
  plugins: [],
} satisfies Config
