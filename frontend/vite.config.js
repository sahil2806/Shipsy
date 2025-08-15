import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file - look in the same directory as vite.config.js
  const env = loadEnv(mode, __dirname, 'VITE_')
  console.log(env.VITE_BACKEND_URL)
  console.log(env.VITE_FRONTEND_PORT)
  
  return {
    plugins: [react()],
    server: {
      port: env.VITE_FRONTEND_PORT,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL ,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})