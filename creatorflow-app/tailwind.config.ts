import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'dark:bg-green-900/60',
    'dark:bg-yellow-900/60',
    'dark:bg-red-900/60',
    'dark:bg-blue-900/60',
    'dark:bg-purple-900/70',
    'dark:from-purple-900/70',
    'dark:to-blue-900/70',
    'dark:bg-white/10',
    'dark:hover:bg-white/20',
    'dark:text-white',
    'bg-gray-100',
    'dark:bg-gray-800',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;