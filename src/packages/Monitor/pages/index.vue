<template>
    <div class="monitor">
        <Chunk v-for="(item, index) in chunks" :key="item.id"
            :order="item.order"
            :size="item.size"
        ></Chunk>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import Chunk from "../components/Chunk.vue"
let chunks = ref([
    {
        id: 0,
        order: 0,
        size: 30,
    },
    {
        id: 1,
        order: 1,
        size: 30,
    },
    {
        id: 2,
        order: 2,
        size: 10,
    },
])

</script>

<style lang="scss" scoped>
.monitor {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 10px;
    box-sizing: border-box;
}
</style>