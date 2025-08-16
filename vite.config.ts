import { defineConfig } from 'vite';
import path from 'path';

// Detect repository name from the GitHub environment to construct the correct
// base path when deploying to GitHub Pages. This allows the site to work both
// locally (where `GITHUB_REPOSITORY` is undefined and the base becomes `/`) and
// on pages (where the repo name is used as the base prefix).
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];

export default defineConfig(async () => ({
  plugins: [(await import('@vitejs/plugin-react')).default()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  base: repo ? `/${repo}/` : '/',
}));

