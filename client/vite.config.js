import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/ - edited to force reload
export default defineConfig({
  plugins: [react()],
})
