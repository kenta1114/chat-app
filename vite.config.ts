/// <reference types="node" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// Compute repo root dir in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Root-level Vite config so that running `vite build` from repo root
// will build the app under ./chat-app and find its index.html
export default defineConfig({
  root: resolve(__dirname, 'chat-app'),
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
})
