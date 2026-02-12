import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const spaPlugin = () => {
  return {
    name: 'spa-history-fallback',
    apply: 'serve',
    enforce: 'pre',
    configureServer(server) {
      return () => {
        server.middlewares.use((req, res, next) => {
          // Ігноруємо api запити
          if (req.url.startsWith('/api')) {
            return next();
          }
          // Ігноруємо файли з розширеннями (js, css, png, etc)
          if (/\.\w+(\?.*)?$/.test(req.url)) {
            return next();
          }
          // Для всіх інших запитів повертаємо index.html
          req.url = '/index.html';
          next();
        });
      };
    }
  };
};

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        middlewareMode: false,
      },
      appType: 'spa',
      build: {
        rollupOptions: {
          output: {
            entryFileNames: `[name]-[hash:8].js`,
            chunkFileNames: `[name]-[hash:8].js`,
            assetFileNames: `[name]-[hash:8].[ext]`
          }
        }
      },
      plugins: [react(), spaPlugin()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
