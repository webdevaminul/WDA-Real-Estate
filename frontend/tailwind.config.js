// tailwind.config.cjs
const daisyui = require("daisyui");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgba(var(--text-primary))",
        secondary: "rgba(var(--text-secondary))",
        blueColor: "rgba(var(--text-blue))",
        purpleColor: "rgba(var(--text-purple))",
        primaryWhite: "rgba(var(--primary-white))",
        primaryBlack: "rgba(var(--primary-black))",
        highlight: "rgba(var(--highlight))",
        highlightHover: "rgba(var(--highlight-hover))",
        primaryShadeHover: "rgba(var(--primary-shade-hover))",
        highlightGray: "rgba(var(--text-highlight-gray))",
        primaryBg: "rgba(var(--primary-bg))",
        primaryBgShade1: "rgba(var(--primary-bg-shade-1))",
        primaryBgShade2: "rgba(var(--primary-bg-shade-2))",
        primaryBtnBg: "rgba(var(--primary-btn-bg))",
        primaryBtn: "rgba(var(--primary-btn))",
      },
      keyframes: {
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        zoom: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        rotate: "rotate 0.4s ease-in-out",
        zoom: "zoom 10s ease-in-out infinite",
      },
      fontFamily: {
        body: ["Roboto", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [
    daisyui,
    function ({ addUtilities }) {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none", // Internet Explorer 10+
          "scrollbar-width": "none", // Firefox
        },
      };
      addUtilities(newUtilities);
    },
  ],
  daisyui: {
    themes: [],
  },
};
