import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: path.join(__dirname, 'windows/pref'),
  optimizeDeps: {
    // This is how you prevent Vite's development esbuild from unpacking certain
    // modules. https://github.com/vitejs/vite/discussions/14813
    exclude: ['class-variance-authority', 'tiny-invariant'],
  },
  build: {
    sourcemap: true,
    outDir: '../../.vite/renderer/pref_window',
  },
})
