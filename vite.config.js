import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default {
  server: {
    host: true,
    allowedHosts: [
      "tai-parodistic-hypersuggestibly.ngrok-free.dev"
    ]
  }
}
