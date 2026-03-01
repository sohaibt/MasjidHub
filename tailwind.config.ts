import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B5E20",
          50: "#E8F5E9",
          100: "#C8E6C9",
          200: "#A5D6A7",
          300: "#81C784",
          400: "#66BB6A",
          500: "#1B5E20",
          600: "#175219",
          700: "#134513",
          800: "#0E380E",
          900: "#0A2B09",
        },
        accent: {
          DEFAULT: "#C9A84C",
          50: "#FBF6E8",
          100: "#F5EAC7",
          200: "#EDDA9E",
          300: "#E5CA75",
          400: "#D4B85E",
          500: "#C9A84C",
          600: "#B8963A",
          700: "#9A7D30",
          800: "#7C6526",
          900: "#5E4C1D",
        },
        warmWhite: "#FAF7F2",
        warmGray: {
          100: "#F5F0E8",
          200: "#E8E0D4",
          300: "#D4C9B8",
          400: "#B8A994",
          500: "#9C8E78",
        },
      },
      fontFamily: {
        amiri: ["Amiri", "serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
