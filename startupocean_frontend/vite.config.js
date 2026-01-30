import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    allowedHosts: [
      'startupocean.in',
      'www.startupocean.in'
    ]
  }
})