import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        mist: "#f6f8fb"
      },
      boxShadow: {
        soft: "0 20px 70px rgba(17, 24, 39, 0.10)"
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};

export default config;
