import { createApp } from 'vue'
import App from './App.vue'

import '@vant/touch-emulator'

// 引入全局样式
import "@/global/styles/index.scss"

import { parseUrl } from "./router.js"

let info = parseUrl();
window.rid = info.rid;
window.options = info.options;
createApp(App).mount('#app')
