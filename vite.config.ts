import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Vite 8/rolldown stubs react-redux as an optional peer dep of @reduxjs/toolkit;
    // dedupe forces a single resolved copy from the project's own node_modules.
    dedupe: ['react', 'react-dom', 'react-redux'],
  },
  optimizeDeps: {
    include: ['react-redux', '@reduxjs/toolkit'],
  },
  server: {
    proxy: {
      // /api/v1/flights  →  http://localhost:3001/api/v1/flights
      // /api/v1/aircraft →  http://localhost:3001/api/v1/aircraft
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
