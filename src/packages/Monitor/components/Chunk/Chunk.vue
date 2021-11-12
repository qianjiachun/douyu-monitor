<template>
    <div class="chunk" :style='direction === "row" ? `width:${String(size)}px;height: 100%;` : `height:${String(size)}px;width: 100%;`'>
        <div v-show="direction === 'column'" class="resize-x" @mousedown.prevent="onMouseDownResizeX" @touchstart.prevent="onMouseDownResizeX"></div>
        <div v-show="direction === 'row'" class="resize-y" @mousedown.prevent="onMouseDownResizeY" @touchstart.prevent="onMouseDownResizeY"></div>
    </div>
</template>

<script setup>
import { useResizeY } from "./hooks/useResizeY.js"
import { useResizeX } from "./hooks/useResizeX.js"
let props = defineProps(["id", "size", "direction"]);
let emits = defineEmits(["changeSize"])

let {onMouseDownResizeY} = useResizeY(props.id, emits);
let {onMouseDownResizeX} = useResizeX(props.id, emits);


</script>

<style lang="scss">
$resize-width: 5px;
$resize-color: #d6d6d6;

.chunk {
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    .resize-y {
        height: 100%;
        width: $resize-width;
        background-color: $resize-color;
        cursor: col-resize;
        position: absolute;
        top: 0;
        right: 0;
    }
    .resize-x {
        width: 100%;
        height: $resize-width;
        background-color: $resize-color;
        cursor: row-resize;
        position: absolute;
        left: 0;
        bottom: 0;
    }
}

</style>