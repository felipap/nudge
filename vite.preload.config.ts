import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        preload: path.resolve(__dirname, 'windows/shared/preload.ts'),
      },
    },
    outDir: '.vite/renderer',
    emptyOutDir: false,
  },
})
