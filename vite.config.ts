import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: process.cwd(),
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(process.cwd(), 'index.html'),
        options: resolve(process.cwd(), 'src/options.html'),
        dashboard: resolve(process.cwd(), 'src/dashboard.html'),
        background: resolve(process.cwd(), 'src/background.ts'),
        content: resolve(process.cwd(), 'src/content.ts'),
      },
      output: {
        entryFileNames: (chunk) => chunk.name === 'background' || chunk.name === 'content' ? '[name].js' : 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
