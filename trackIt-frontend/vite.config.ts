import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  preview: {
    port: 3000,
    host: true,
    allowedHosts: [
      "track-it-app-frontend-production.up.railway.app",
      "localhost",
    ],
  },
  define: {
    "process.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL),
    "process.env.VITE_ENV": JSON.stringify(process.env.VITE_ENV),
  },
  build: {
    minify: "esbuild",
    target: "es2020",
    rollupOptions: {
      external: ["@rollup/rollup-linux-x64-gnu"],
      output: {
        manualChunks: undefined,
      },
    },
  },
});
