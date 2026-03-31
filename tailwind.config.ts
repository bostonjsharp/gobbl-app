import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gobbl: {
          50: "#fff8f0",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        plume: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f472b6",
          400: "#db2777",
          500: "#9f1239",
          600: "#881337",
          700: "#701a2e",
          800: "#5c1525",
          900: "#4a0e1e",
          950: "#2d0712",
        },
        roost: {
          50: "#faf6f1",
          100: "#f0e8dc",
          200: "#e2d2bc",
          300: "#d1b896",
          400: "#b89a6e",
          500: "#a07d52",
          600: "#86643e",
          700: "#6b4e32",
          800: "#4a3623",
          900: "#352718",
          950: "#1e160d",
        },
        golden: {
          50: "#fffdf0",
          100: "#fff9cc",
          200: "#fff085",
          300: "#ffe44d",
          400: "#ffd700",
          500: "#e6c200",
          600: "#b39500",
          700: "#806b00",
          800: "#594a00",
          900: "#332b00",
        },
      },
      animation: {
        "feather-fall": "featherFall 2s ease-in-out infinite",
        "hatch": "hatch 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "strut": "strut 0.8s ease-in-out",
        "gobble": "gobble 0.3s ease-in-out",
        "float": "float 3s ease-in-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
      },
      keyframes: {
        featherFall: {
          "0%": { transform: "translateY(-10px) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(60px) rotate(45deg)", opacity: "0" },
        },
        hatch: {
          "0%": { transform: "scale(0.8) rotate(-5deg)", opacity: "0" },
          "50%": { transform: "scale(1.1) rotate(3deg)" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        strut: {
          "0%, 100%": { transform: "translateX(0) rotate(0deg)" },
          "25%": { transform: "translateX(4px) rotate(2deg)" },
          "75%": { transform: "translateX(-4px) rotate(-2deg)" },
        },
        gobble: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
