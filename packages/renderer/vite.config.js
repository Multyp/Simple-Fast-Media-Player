/* eslint-env node */

import { chrome } from "../../.electron-vendors.cache.json";
import { join } from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      "main/": join(PACKAGE_ROOT, "..", "main") + "/",
      "/@/": join(PACKAGE_ROOT, "src") + "/",
    },
  },
  base: "",
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: "dist",
    assetsDir: ".",
    rollupOptions: {
      input: join(PACKAGE_ROOT, "index.html"),
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  plugins: [react(), tailwindcss()],
};

export default config;
