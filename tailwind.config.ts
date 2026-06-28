import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        forest: { DEFAULT: '#1B4332', deep: '#0F2C20', soft: '#2D5A47' },
        terracotta: { DEFAULT: '#E07A5F', soft: '#F4A58A' },
        paper: { DEFAULT: '#FAFAFA', warm: '#F5F1E8', edge: '#E5E2D9' },
        scene: '#EFEBE0',
        ink: '#1A1A1A',
      },
      keyframes: {
        'float-up': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        'fade-in-up': { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'float-up': 'float-up 3s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out both',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
