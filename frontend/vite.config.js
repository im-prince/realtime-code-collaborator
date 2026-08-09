import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      'monaco-editor/esm/vs/editor/editor.api.js': 'monaco-editor',
    },
  },
  optimizeDeps: {
    exclude: ['y-monaco'],
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          monaco: ['monaco-editor'],
          yjs: ['yjs', 'y-websocket', 'y-monaco'],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
})