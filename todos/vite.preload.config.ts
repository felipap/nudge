import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        preload: path.resolve(__dirname, 'windows/shared/preload.ts'),
      },
      // Ensure these dependencies are bundled, not externalized
      external: ['@tanstack/react-router', '@dnd-kit/core', 'framer-motion'],
    },
    outDir: '.vite/renderer',
    emptyOutDir: false,
  },
})
