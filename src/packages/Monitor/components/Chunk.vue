<template>
    <div class="chunk"></div>
</template>

<script setup>
import {ref, computed} from 'vue'
let props = defineProps({
    order: Number,
    size: Number
})

let sizeStyle = computed(() => {
    return `${String(props.size)}%`
})
let orderStyle = computed(() => {
    return props.order
})

</script>

<style scoped>
.chunk {
    width: 100%;
    flex: 0 0 v-bind(sizeStyle);
    order: v-bind(orderStyle);

    background-color: pink;
    border-radius: 10px;
}
</style>