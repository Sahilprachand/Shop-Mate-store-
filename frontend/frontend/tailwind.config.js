import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        premium: {
          primary: "#111111",
          "primary-content": "#ffffff",
          secondary: "#B08D57",
          "secondary-content": "#ffffff",
          accent: "#B08D57",
          "accent-content": "#ffffff",
          neutral: "#111111",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#F7F6F3",
          "base-300": "#EDEBE6",
          "base-content": "#111111",
          info: "#3b82f6",
          success: "#16a34a",
          warning: "#d97706",
          error: "#dc2626",

          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.4rem",
          "--rounded-badge": "1.9rem",
          "--tab-radius": "0.5rem",
        },
      },
      "pastel",
      "retro",
      "coffee",
      "forest",
      "cyberpunk",
      "synthwave",
      "luxury",
      "autumn",
      "valentine",
      "aqua",
      "business",
      "night",
      "dracula",
    ],
  },
};