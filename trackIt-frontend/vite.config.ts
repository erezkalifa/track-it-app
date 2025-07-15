import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(
      process.env.VITE_API_URL ||
        "https://track-it-app-backend-production.up.railway.app"
    ),
    "import.meta.env.VITE_ENV": JSON.stringify(
      process.env.VITE_ENV || "production"
    ),
  },
});
