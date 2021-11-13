import { createApp } from 'vue'
import App from './App.vue'

import '@vant/touch-emulator'

// 引入全局样式
import "@/global/styles/index.scss"

import { parseUrl } from "./router.js"

window.rid = parseUrl()
createApp(App).mount('#app')
