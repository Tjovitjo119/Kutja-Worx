import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { red: "#E60012", dark: "#B8000E" },
        ink: { DEFAULT: "#0A0A0A", soft: "#101010", panel: "#141414", deep: "#050505", line: "#1F1F1F", line2: "#2A2A2A" },
        muted: "#9CA3AF",
        ok: "#22C55E",
        warn: "#F59E0B",
        info: "#3B82F6",
      },
      fontFamily: {
        display: ["'Oswald Variable'", "Oswald", "Impact", "sans-serif"],
        sans: ["'Inter Variable'", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: { "2xl": "1rem" },
    },
  },
  plugins: [],
};
export default config;
