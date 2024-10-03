import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig({
  plugins: [vue()],
  // 设置代理
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "https://www.bluearchive.top/",
        changeOrigin: true,
      },
    },
    port: 9090,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    __VUE_PROD_DEVTOOLS__: "true",
  },
});
