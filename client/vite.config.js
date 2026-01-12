import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://skill-share-lj7s.vercel.app',
        changeOrigin: true,
      },
    },
  },
  esbuild: {
    // Treat .js files as JSX to support JSX syntax in .js files
    // This is optional since we renamed to .jsx, but included for robustness
    include: /\.(jsx|js)$/,
    loader: 'jsx',
  },
});