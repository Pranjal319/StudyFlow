/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // New minimal dark palette
        bg: {
          primary: "#0B0F1A",
          secondary: "#111827",
          tertiary: "#1F2937",
          hover: "#27313F"
        },
        text: {
          primary: "#E5E7EB",
          secondary: "#9CA3AF",
          muted: "#6B7280"
        },
        accent: {
          green: "#22C55E",
          blue: "#3B82F6",
          emerald: "#10B981"
        },
        border: "#1F2937",
        // Legacy colors (for backward compatibility)
        ink: "#101828",
        mist: "#0B0F1A",
        sunrise: "#22C55E",
        spruce: "#10B981",
        pine: "#3B82F6",
        sand: "#F59E0B"
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0, 0, 0, 0.3)",
        card: "0 4px 12px rgba(0, 0, 0, 0.4)",
        panel: "0 4px 12px rgba(0, 0, 0, 0.4)"
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        body: ["Manrope", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        // Clean, minimal mesh without heavy gradients
        mesh: "none"
      }
    }
  },
  plugins: []
};
