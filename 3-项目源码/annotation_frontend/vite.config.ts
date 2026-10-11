import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default ({ mode }) =>
  defineConfig({
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: loadEnv(mode, process.cwd()).VITE_BACKEND_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    plugins: [vue()],

    resolve: {
      alias: {
        '@': resolve('./src'),
      },
    },

    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            hack: `true; @import '@/assets/less/config.less'`,
          },
        },
      },
    },
  })
