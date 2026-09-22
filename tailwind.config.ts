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
        background: "#070a13",
        foreground: "#f8fafc",
        card: {
          DEFAULT: "rgba(15, 23, 42, 0.75)",
          border: "rgba(255, 255, 255, 0.08)",
          hover: "rgba(30, 41, 59, 0.85)",
        },
        guard: {
          cyan: "#00f0ff",
          blue: "#38bdf8",
          purple: "#a855f7",
          danger: "#ff3366",
          warning: "#f59e0b",
          success: "#10b981",
        }
      },
      boxShadow: {
        "glow-cyan": "0 0 25px -5px rgba(0, 240, 255, 0.25)",
        "glow-danger": "0 0 25px -5px rgba(255, 51, 102, 0.3)",
        "glow-purple": "0 0 25px -5px rgba(168, 85, 247, 0.25)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scan 2.5s ease-in-out infinite",
      },
      keyframes: {
        scan: {
          "0%, 100%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(100%)" },
        }
      }
    },
  },
  plugins: [],
};

export default config;
