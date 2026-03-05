export const theme = {
  colors: {
    primary: {
      light: "#dcfce7",
      main: "#16a34a",
      dark: "#15803d",
    },
    accent: {
      light: "#dbeafe",
      main: "#3b82f6",
      dark: "#1d4ed8",
    },
    neutral: {
      gray50: "#f9fafb",
      gray100: "#f3f4f6",
      gray200: "#e5e7eb",
      gray300: "#d1d5db",
      gray400: "#9ca3af",
      gray500: "#6b7280",
      gray600: "#4b5563",
      gray700: "#374151",
      gray800: "#1f2937",
      gray900: "#111827",
    },
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
  shadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  },
};

export type Theme = typeof theme;
