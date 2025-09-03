import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Use a relative base path so built assets load correctly regardless of where
// the site is hosted. This avoids servers responding with a generic MIME type
// for module scripts when an absolute path cannot be resolved.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  base: './',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
});

