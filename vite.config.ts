import { defineConfig } from "vitest/config";
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
  test: {
    // Testlar localStorage va DOM API'lariga tegadi (savat store'i,
    // authStorage), shuning uchun jsdom muhiti
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
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
