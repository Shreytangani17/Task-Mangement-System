import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split vendor libraries into separate cached chunks
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'charts-vendor': ['recharts'],
          'icons-vendor': ['lucide-react'],
        },
      },
    },
    // Minify output for production
    minify: 'esbuild',
    target: 'es2015',
    sourcemap: false,
  },
  // Faster dev server startup
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'lucide-react'],
  },
})
