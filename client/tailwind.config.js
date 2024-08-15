/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgba(var(--text-primary))",
        highlight: "rgba(var(--text-highlight))",
        highlightGray: "rgba(var(--text-highlight-gray))",
        primaryBg: "rgba(var(--primary-bg))",
        primaryBgShade1: "rgba(var(--primary-bg-shade-1))",
        primaryBtnBg: "rgba(var(--primary-btn-bg))",
      },
      keyframes: {
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        rotate: "rotate 0.4s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss"), require("autoprefixer")],
};
