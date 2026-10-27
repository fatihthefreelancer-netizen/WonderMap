import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@wondermap/shared': path.resolve(__dirname, '../shared/src/index.ts'),
    },
  },
  server: {
    port: 5173,
    /*
     * Vite compiles a module the first time something imports it, so a cold
     * `npm run dev` pays for the whole route graph one file at a time while
     * somebody sits on a blank page watching it. Naming the entry points gets
     * the server ahead of that before the first request arrives.
     */
    warmup: {
      clientFiles: [
        './src/main.tsx',
        './src/App.tsx',
        './src/pages/MapPage.tsx',
        './src/features/lesson/LessonModal.tsx',
      ],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  /*
   * Pre-bundle the dependencies up front.
   *
   * Left to itself Vite finds these by crawling imports, and anything it only
   * reaches through a dynamic import — which, now that the routes and the
   * chapters are lazy, is most of them — turns up after the page has already
   * loaded. Each late discovery triggers a re-optimise and a full reload.
   */
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'framer-motion',
      'zustand',
      'axios',
      '@tanstack/react-query',
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['framer-motion'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query', 'axios'],
        },
      },
    },
  },
});
