import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5178,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  optimizeDeps: {
    exclude: ['@/wasm'], // 排除WASM相关依赖
  },

  // TODO: 尝试下
  //  import tsconfigPaths from 'vite-tsconfig-paths'
  //  plugins: [tsconfigPaths()] 
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
