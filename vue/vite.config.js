import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

import styleImport from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    styleImport({
      libs: [
        {
          libraryName: 'vant',
          esModule: true,
          resolveStyle: (name) => `vant/es/${name}/style`,
        },
      ],
    }),
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
                          @import "@/global/styles/vars.scss";`,
        charset: false,
      }
    }
  },
})
