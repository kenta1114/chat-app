/// <reference types="node" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Root-level Vite config so that running `vite build` from repo root
// will build the app under ./chat-app and find its index.html
export default defineConfig({
  root: './chat-app',
  plugins: [react()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
})
