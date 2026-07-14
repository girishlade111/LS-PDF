import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  base: process.env.VITE_BASE || '/',
  server: {
    host: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,           // Smaller output, faster Vercel deploys
    assetsInlineLimit: 0,       // Never inline assets as base64 — WASM workers must stay as files
    chunkSizeWarningLimit: 3500, // pdf-lib, pdfjs, tesseract are legitimately large
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/pdf-lib')) return 'pdf-lib-core'
          if (id.includes('node_modules/pdfjs-dist')) return 'pdfjs-viewer'
          if (id.includes('node_modules/tesseract.js')) return 'tesseract-core'
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom/') ||
            id.includes('node_modules/lucide-react/') ||
            id.includes('node_modules/sonner/')
          ) return 'vendor-ui'
          if (
            id.includes('node_modules/jszip/') ||
            id.includes('node_modules/@dnd-kit/core/') ||
            id.includes('node_modules/@dnd-kit/sortable/') ||
            id.includes('node_modules/@dnd-kit/utilities/')
          ) return 'vendor-utils'
        }
      }
    }
  }
})

