import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { red: "#E31E24", dark: "#B5151A" },
        ink: { DEFAULT: "#0A0D14", soft: "#0E131D", panel: "#121826", deep: "#06080D" },
      },
      fontFamily: {
        display: ["'Oswald Variable'", "Oswald", "Impact", "sans-serif"],
        sans: ["'Inter Variable'", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
