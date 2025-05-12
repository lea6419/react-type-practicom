import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path';
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],resolve: {
    alias: {
      react: resolve('./node_modules/react'),
      '@': path.resolve(__dirname, './src'),
    }
  }
})
