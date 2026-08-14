import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // React ilova kodi bilan bitta chunk'da edi, ya'ni har deploy'da
        // qaytib kelgan foydalanuvchi 200KB+ ni qaytadan yuklab olardi.
        // Alohida ajratilgach uning hash'i versiyalar orasida o'zgarmaydi
        // va brauzer keshidan olinadi.
        manualChunks(id) {
          if (
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react/") ||
            id.includes("node_modules/scheduler")
          ) {
            return "react-vendor";
          }
        },
      },
    },
  },
});
