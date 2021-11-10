<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
import {Ex_WebSocket_UnLogin} from "./js/websocket.js"
let ws = null;
setTimeout(() => {
  ws.close();
  ws = null;
  console.log("断开连接了")
  setTimeout(() => {
    connect();
  }, 5000);
  
}, 5000);

connect();
function connect() {
  console.log("连接")
  ws = new Ex_WebSocket_UnLogin("288016", m => {
    console.log(m);
  })  
}

</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + Vite" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
