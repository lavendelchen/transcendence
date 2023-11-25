import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'
import path from 'path' // Stellen Sie sicher, dass Sie path importieren

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    checker({
      typescript: true,
      vueTsc: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias für src hinzugefügt
    }
  }
})
