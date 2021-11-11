<template>
    <div class="chunk">
        <div v-for="(item, index) in content" :key="index" style="user-select: none;">{{item}}</div>
    </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
let props = defineProps({
    size: Number
})

let sizeStyle = computed(() => {
    return `${String(props.size)}%`
})

let content = ref([]);

let i = 0;
onMounted(() => {
    setInterval(() => {
        content.value.push(i);
        i++;
    }, 1000);
})

</script>

<style scoped>
.chunk {
    width: 100%;
    flex: 0 0 v-bind(sizeStyle);
    background-color: pink;
    border-radius: 10px;
}
</style>