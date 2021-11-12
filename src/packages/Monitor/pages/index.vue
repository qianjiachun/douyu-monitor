<template>
    <div class="monitor">
        <draggable
            ref="domMonitorWrap"
            class="monitor__wrap"
            item-key="id"
            tag="transition-group"
            :component-data="{ name: 'fade' }"
            v-model="chunks"
            v-bind="dragOptions"
        >
            <template #item="{ element }">
                <Chunk
                    :id="element.id"
                    :size="element.size"
                    :direction="direction"
                    @changeSize="changeSize"
                ></Chunk>
            </template>
        </draggable>
    </div>
</template>

<script setup>
import draggable from "vuedraggable";
import { ref } from 'vue'
import Chunk from "../components/Chunk/Chunk.vue"
import { usedrag } from "../hooks/usedrag.js"
let chunks = ref([
    {
        id: 1,
        size: 74,
    },
    {
        id: 0,
        size: 645,
    },
    {
        id: 2,
        size: 469,
    },
]);
let direction = ref("column");
let { changeSize, dragOptions } = usedrag(chunks);

</script>

<style lang="scss">
.monitor {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: v-bind(direction);
    .chunk:last-child {
        flex: 1;
        .resize-y {
            display: none;
        }
        .resize-x {
            display: none;
        }
    }
}

.fade-move {
    transition: transform 0.5s;
}
.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}
</style>