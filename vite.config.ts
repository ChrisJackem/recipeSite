import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Change 'build' to your desired directory name
    emptyOutDir: true // Ensures the directory is cleared before building
  }
})
