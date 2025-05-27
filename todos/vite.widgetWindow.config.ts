import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: path.join(__dirname, 'windows/widget'),
  optimizeDeps: {
    // Remove the exclusions that were causing build issues
    include: ['tiny-invariant', 'tiny-warning', 'jsesc'],
  },
  build: {
    sourcemap: true,
    outDir: '../../.vite/renderer/widget_window',
    rollupOptions: {
      // Ensure these dependencies are bundled, not externalized
      external: [],
    },
  },
})
