import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rr: {
          bg: "#030712", surface: "#0B1117", card: "#0F1923",
          border: "#1F2937", cyan: "#38BDF8", indigo: "#818CF8",
          text: "#E2E8F0", muted: "#64748B", amber: "#F59E0B",
          green: "#34D399", red: "#F87171",
        },
      },
    },
  },
  plugins: [],
};
export default config;
