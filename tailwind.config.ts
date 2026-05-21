import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        kola: {
          50:  "#fdf6ee",
          100: "#f9e9d1",
          200: "#f2cfa0",
          300: "#e9ae64",
          400: "#e0903a",
          500: "#d4721e",
          600: "#bc5918",
          700: "#9c4217",
          800: "#7d351a",
          900: "#662d18",
          950: "#3a150a",
        },
        earth: {
          50:  "#f8f4ef",
          100: "#ede3d5",
          200: "#dcc7ab",
          300: "#c7a47a",
          400: "#b68455",
          500: "#a56e3f",
          600: "#8d5935",
          700: "#74452e",
          800: "#5f392a",
          900: "#4f3026",
          950: "#2b1811",
        },
        savanna: {
          50:  "#f7f9f0",
          100: "#edf2dc",
          200: "#d8e4ba",
          300: "#bbd08e",
          400: "#9aba64",
          500: "#7da043",
          600: "#618033",
          700: "#4c642a",
          800: "#3e5025",
          900: "#354422",
          950: "#1a240f",
        },
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse_dot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease forwards",
        "fade-in": "fade-in 0.4s ease forwards",
        shimmer: "shimmer 2s linear infinite",
        pulse_dot: "pulse_dot 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
