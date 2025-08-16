import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(async () => ({
  plugins: [(await import('@vitejs/plugin-react')).default()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  base: '/ED-dashboard/',
}));

