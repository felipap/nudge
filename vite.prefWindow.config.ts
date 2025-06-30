import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: path.join(__dirname, 'windows/settings'),
  optimizeDeps: {
    // This is how you prevent Vite's development esbuild from unpacking certain
    // modules. https://github.com/vitejs/vite/discussions/14813
    exclude: [
      'class-variance-authority',
      // 'react-error-boundary'
    ],
  },
  build: {
    sourcemap: true,
    outDir: '../../.vite/renderer/pref_window',
  },
})
