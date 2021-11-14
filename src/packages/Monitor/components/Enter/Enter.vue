<template>
    <div class="enter">进场</div>
</template>

<script setup>
import {ref, computed} from 'vue'
import {useFlexStyle} from "../../hooks/useFlexStyle.js"
import {useBorderStyle} from "../../hooks/useBorderStyle.js"
let props = defineProps({
    maxOrder: {
        type: Number,
    },
    options: {
        type: Object,
    }
});

let { flexStyle, orderStyle } = useFlexStyle(props, "enter");
let { borderBottomStyle, borderRightStyle } = useBorderStyle(props, "enter");
</script>

<style lang="scss" scoped>
.enter {
    order: v-bind(orderStyle);
    flex: v-bind(flexStyle);
    border-bottom: v-bind(borderBottomStyle);
    border-right: v-bind(borderRightStyle);
    content-visibility: auto;
    padding: 5px;
    box-sizing: border-box;
}
</style>