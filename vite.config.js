import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import importToCDN from 'vite-plugin-cdn-import'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    importToCDN({
      modules: [
        {
          name:'vue',
          var:'Vue',
          path:'https://cdn.jsdelivr.net/npm/vue@3.2.16/dist/vue.global.prod.js'
        }
      ]
    })
  ],
  resolve: {
    alias: {
        '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 添加公共样式
        additionalData: ` @import "@/global/styles/themes/index.scss";
                          @import "@/global/styles/vars.scss";`
      }
    }
  }
})
