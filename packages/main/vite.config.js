import { node } from "../../.electron-vendors.cache.json";
import { join } from "path";

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: {
      "base/": join(PACKAGE_ROOT, "src", "base") + "/",
      "ipc/": join(PACKAGE_ROOT, "src", "ipc") + "/",
      "utils/": join(PACKAGE_ROOT, "src", "utils") + "/",
      "/@/": join(PACKAGE_ROOT, "src") + "/",
    },
  },
  build: {
    ssr: true,
    sourcemap: "inline",
    target: `node${node}`,
    outDir: "dist",
    assetsDir: ".",
    minify: process.env.MODE !== "development",
    lib: {
      entry: "src/index.ts",
      formats: ["cjs"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "[name].cjs",
      },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
};

export default config;
