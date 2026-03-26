import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    target: 'es2020',
    // Reduce CSS output size
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Public site core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Heavy libraries
          'vendor-map': ['maplibre-gl'],
          'vendor-icons': ['lucide-react'],
          'vendor-animation': ['gsap'],
          // Admin panel (only loads when navigating to /admin)
          'vendor-admin-editor': ['@tiptap/react', '@tiptap/starter-kit'],
          'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: ['**/node_modules/**', '**/dist/**', '**/tests/**'],
  },
})
