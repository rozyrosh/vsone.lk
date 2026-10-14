import type { Config } from "tailwindcss";

/*
  VS One design tokens, light mode.
  The canvas is porcelain tinted cool, never pure white. Panels sit a half step
  brighter. Graphite carries the type, steel carries the secondary type, and the
  crimson accent appears in rare doses: the call to action, focus states, and the
  tip of the Line.
*/
// Each token is an RGB triplet variable (see :root in globals.css) so Tailwind
// opacity modifiers like bg-panel/90 keep working.
const v = (name: string) => `rgb(var(--${name}-rgb) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: v("canvas"),
        surface: v("canvas"),
        "surface-dim": "#dde0e7",
        "surface-bright": v("panel"),
        "surface-container-lowest": v("panel"),
        "surface-container-low": v("panel-low"),
        "surface-container": v("panel-mid"),
        "surface-container-high": "#e6e9ef",
        "surface-container-highest": "#dfe3ea",
        "surface-variant": v("hair"),
        "on-surface": v("ink"),
        "on-surface-variant": v("ink-2"),
        "on-background": v("ink"),
        "on-primary": "#ffffff",
        "on-secondary": "#ffffff",
        "primary-container": "#272b33",
        "secondary-container": v("accent-hover"),
        "secondary-fixed": "#ffdad7",
        outline: v("ink-3"),
        "outline-variant": v("hair-strong"),
        primary: v("ink"),
        secondary: v("accent"),
        canvas: v("canvas"),
        panel: v("panel"),
        mist: v("panel-low"),
        graphite: v("ink"),
        steel: v("ink-2"),
        hairline: v("hair"),
        crimson: v("accent"),
        "crimson-deep": v("accent-hover"),
        azure: v("blue"),
        "azure-deep": v("blue-hover"),
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        lg: "1.25rem",
        xl: "1.75rem",
      },
      spacing: {
        "space-2xs": "0.25rem",
        "space-xs": "0.45rem",
        "space-sm": "0.7rem",
        "space-md": "0.9rem",
        "space-lg": "1.35rem",
        "space-xl": "1.8rem",
        "space-2xl": "2.7rem",
        "space-3xl": "3.6rem",
        "space-4xl": "5.25rem",
        "gutter-desktop": "1.35rem",
        "gutter-mobile": "0.9rem",
        "margin-desktop": "2.7rem",
        "margin-mobile": "1.15rem",
      },
      fontFamily: {
        "label-sm": ["var(--font-mono)", "IBM Plex Mono", "monospace"],
        "label-md": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "body-sm": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "body-md": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "body-lg": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "headline-md": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "headline-lg": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "display-hero": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "display-hero-mobile": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        display: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        body: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      fontSize: {
        "label-sm": ["11px", { lineHeight: "15px", letterSpacing: "0.06em", fontWeight: "500" }],
        "label-md": ["13px", { lineHeight: "18px", letterSpacing: "-0.005em", fontWeight: "500" }],
        "body-sm": ["12.5px", { lineHeight: "19px", letterSpacing: "0em", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "22px", letterSpacing: "-0.005em", fontWeight: "400" }],
        "body-lg": ["16.5px", { lineHeight: "26px", letterSpacing: "-0.01em", fontWeight: "400" }],
        "headline-md": ["22px", { lineHeight: "28px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["36px", { lineHeight: "40px", letterSpacing: "-0.03em", fontWeight: "700" }],
        "headline-lg-mobile": ["26px", { lineHeight: "30px", letterSpacing: "-0.025em", fontWeight: "700" }],
        "display-hero-mobile": ["34px", { lineHeight: "38px", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display-hero": ["60px", { lineHeight: "62px", letterSpacing: "-0.04em", fontWeight: "800" }],
      },
      maxWidth: {
        canvas: "1440px",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        inout: "var(--ease-inout)",
      },
      boxShadow: {
        panel: "0 1px 0 rgba(15,17,21,.04), 0 12px 32px -18px rgba(15,17,21,.18)",
        lift: "0 1px 0 rgba(15,17,21,.05), 0 24px 48px -24px rgba(15,17,21,.28)",
      },
    },
  },
  plugins: [],
};

export default config;
