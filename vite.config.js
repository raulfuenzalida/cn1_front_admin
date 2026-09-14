import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/cn1_front_admin/',
  plugins: [react()],

  server: {
    proxy: {
      '/api/v1/config': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/v1/products': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/v1/tags': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/v1/orders': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separar dependencias vendor del código de la aplicación
          // Esto mejora el cacheo del navegador ya que las dependencias cambian menos frecuentemente
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('bootstrap')) {
              return 'vendor-bootstrap';
            }
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('@azure/msal')) {
              return 'vendor-msal';
            }
            return 'vendor';
          }
        },
      },
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})