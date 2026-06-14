import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
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
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Function form (portable across Rollup and Vite's Rolldown bundler).
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          // Core React runtime + router — needed on every page.
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|@remix-run[\\/]router|history)[\\/]/.test(id)) {
            return "react-vendor";
          }
          // Animation library — large and used widely, but splittable.
          if (id.includes("node_modules/framer-motion") || id.includes("node_modules/motion")) {
            return "motion";
          }
          // CMS client + rich-text rendering — only needed once data loads.
          if (id.includes("node_modules/contentful") || id.includes("node_modules/@contentful")) {
            return "contentful";
          }
        },
      },
    },
  },
});
