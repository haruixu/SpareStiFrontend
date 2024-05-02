import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as fs from 'node:fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    https: {
      key: fs.readFileSync('./src/keystore/privkey.pem'),
      cert: fs.readFileSync('./src/keystore/fullchain.pem')
    }
  }
})
