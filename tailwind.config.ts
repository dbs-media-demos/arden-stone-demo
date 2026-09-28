import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        ink: "hsl(var(--ink))",
        "ink-soft": "hsl(var(--ink-soft))",
        ivory: "hsl(var(--ivory))",
        stone: "hsl(var(--stone))",
        bronze: "hsl(var(--bronze))",
        "bronze-light": "hsl(var(--bronze-light))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "ken-burns": {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.12)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        "ken-burns": "ken-burns 14s ease-out forwards",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
