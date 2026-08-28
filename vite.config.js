import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
