import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://api.housecallpro.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Removes /api prefix so the request matches any endpoint
      },
    },
  },
});
