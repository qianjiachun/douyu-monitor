<template>
    <div class="monitor">
        <!-- <Chunk v-for="(item, index) in chunks" :key="item.id"
            :order="item.order"
            :size="item.size"
        ></Chunk> -->
        <draggable
            class="monitor__wrap"
            item-key="order"
            tag="transition-group"
            :component-data="{ name: 'fade' }"
            v-model="list"
            v-bind="dragOptions"
        >
            <template #item="{ element }">
                <Chunk :size="element.size"></Chunk>
            </template>
        </draggable>
    </div>
    
</template>

<script setup>
import draggable from "vuedraggable";
import {ref, computed} from 'vue'
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

let list = ref([
    {
        name: "1",
        order: 0,
        size: 50,
    },
    {
        name: "2",
        order: 1,
        size: 20,
    },
    {
        name: "3",
        order: 2,
        size: 30,
    },
]);
let dragOptions = computed(() => {
    return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
    }
})

</script>

<style lang="scss" scoped>
.monitor {
    width: 100%;
    height: 100%;
    display: flex;
    // flex-direction: column;
    // overflow: hidden;
    // padding: 10px;
    // box-sizing: border-box;
}


.fade-move {
  transition: transform 0.5s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>