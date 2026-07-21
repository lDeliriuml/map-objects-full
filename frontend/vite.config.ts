/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

export default defineConfig({
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('maplibre-gl')) return 'maplibre';
          if (id.includes('vue') && id.includes('node_modules')) return 'vue';
          if (id.includes('pinia') && id.includes('node_modules')) return 'pinia';
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
  server: {
    host: 'localhost',
    port: 5173,
    https: {
      key: readFileSync(resolve('ssl/localhost.key')),
      cert: readFileSync(resolve('ssl/localhost.cer')),
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});