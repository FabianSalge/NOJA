import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime + router — needed on every page.
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // Animation library — large and used widely, but splittable.
          motion: ["framer-motion"],
          // CMS client + rich-text rendering — only needed once data loads.
          contentful: [
            "contentful",
            "@contentful/rich-text-react-renderer",
            "@contentful/rich-text-types",
          ],
        },
      },
    },
  },
});
