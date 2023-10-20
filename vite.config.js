import pkg from "./package.json";
import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  build: {
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react-dom/client",
        "moment",
        "antd",
        "ag-grid-react",
        "@ant-design/icons",
        "@hp-view/request",
        "@hp-view/theme",
        "@icon-park/react",
      ],
      output: {
        globals: {
          antd: "antd",
          react: "React",
          "react-dom": "ReactDOM",
          "react-dom/client": "ReactDOM",
          moment: "moment",
        },
      },
    },
    lib: {
      entry: "./src/App",
      name: `${pkg.name}@${pkg.version.replace(/\./g, "_")}`,
      formats: ["es"],
      fileName: (format) => `index.${format}.js`,
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    host: "localhost.hyperpaas-inc.com",
    https: true,
    proxy: {
      "/rest": {
        target: "https://dev.hyperpaas-inc.com/",
        changeOrigin: true,
      },
    },
  },
});
