import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // GSAP powers the cinematic landing page but does not need to inflate
        // the core application chunk used to resolve every route.
        manualChunks: {
          gsap: ['gsap', 'gsap/ScrollTrigger'],
        },
      },
    },
  },
})
