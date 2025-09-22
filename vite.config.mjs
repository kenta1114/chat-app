import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: './chat-app',
  plugins: [react()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
  },
  server: { port: 5173 },
  preview: { port: 4173 },
})
