import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Sentry shu bayroqlarni o'z kodida tekshiradi. Build paytida `false`
  // ga almashtirilsa, tezlik o'lchash (tracing) va nosozlik xabarlari
  // butunlay tashlab yuboriladi — bizga faqat xatolar kerak.
  define: {
    __SENTRY_DEBUG__: false,
    __SENTRY_TRACING__: false,
  },
  resolve: {
    alias: {
      // `import.meta.dirname` — `__dirname` Vite'ning kelajakdagi native
      // config yuklovchisida ishlamaydi (Node 20.11+ da mavjud)
      "@": path.resolve(import.meta.dirname, "./src"),
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
