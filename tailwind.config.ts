import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // tailwind.config.js
  theme: {
    extend: {
      dropShadow: {
        glow: '0 0 10px rgba(255, 255, 255, 0.4)',
      },
    },
  }
  ,
  plugins: [],
} satisfies Config;
