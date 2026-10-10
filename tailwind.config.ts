import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        zinc: {
          950: "#09090B",
        },
        indigo: {
          500: "#6366F1",
          600: "#4F46E5",
        },
        violet: {
          500: "#8B5CF6",
          600: "#7C3AED",
        },
        brand: {
          bg: "#09090B",
          indigo: "#6366F1",
          violet: "#8B5CF6",
        },
      },
      transitionTimingFunction: {
        "out-strong": "cubic-bezier(0.23, 1, 0.32, 1)",
      },
    },
  },
};

export default config;
