import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: path.join(__dirname, 'windows/main'),
  optimizeDeps: {
    // This is how you prevent Vite's development esbuild from unpacking certain
    // modules. https://github.com/vitejs/vite/discussions/14813
    exclude: [
      'class-variance-authority',
      '@tanstack/react-router',
      'react-icons',
    ],
  },
  build: {
    sourcemap: true,
    outDir: '../../.vite/renderer/main_window',
    rollupOptions: {
      // Ensure these dependencies are bundled, not externalized
      external: [
        // '@tanstack/react-router',
        'framer-motion',
      ],
    },
  },
})
