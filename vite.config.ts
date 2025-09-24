/// <reference types="node" />
import { defineConfig } from "vite";
// Use runtime require to avoid TypeScript's moduleResolution needing 'node16'/'nodenext'
import { createRequire } from "node:module";
// @ts-ignore - bypass type resolution for @vitejs/plugin-react
const require = createRequire(import.meta.url);
const react = require("@vitejs/plugin-react").default;
import { resolve } from "node:path";

// Compute repo root dir in ESM
// Compute repo root dir without using import.meta (avoid TS module requirement)
const __dirname = process.cwd();
// Root-level Vite config so that running `vite build` from repo root
// will build the app under ./chat-app and find its index.html
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    port: Number(process.env.PORT) || 4173,
    allowedHosts: ["chat-app-electron.onrender.com"],
  },
});
