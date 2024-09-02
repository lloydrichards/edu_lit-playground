import {defineConfig} from 'vite';
import {fileURLToPath, URL} from 'node:url';

const config = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        normalize: 'normalize.css',
        utilities: 'styles.css',
      },
      output: {
        entryFileNames: 'bundle.[hash].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});

export default config;