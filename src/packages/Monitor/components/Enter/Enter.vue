<template>
    <div ref="dom_enter" class="enter">
        <Deafult
            v-for="item in enterList"
            :options="options"
            :data="item"
            :key="item.key"
        ></Deafult>
        <div v-show="isLock" class="gobottom" @click.stop="goToScrollBottom(dom_enter)">回到底部</div>
    </div>
</template>

<script setup>
import {ref, computed, onUpdated, onMounted } from 'vue'
import Deafult from "./templates/Default.vue"
import {useFlexStyle} from "../../hooks/useFlexStyle.js"
import {useBorderStyle} from "../../hooks/useBorderStyle.js"
import { useScroll } from '../../hooks/useScroll.js'
let props = defineProps({
    maxOrder: {
        type: Number,
    },
    options: {
        type: Object,
    },
    enterList: {
        type: Array,
    }
});
let { flexStyle, orderStyle } = useFlexStyle(props, "enter");
let { borderBottomStyle, borderRightStyle } = useBorderStyle(props, "enter");
let { isLock, onScroll, onScrollUpdate, goToScrollBottom } = useScroll();
let dom_enter = ref(null);

onUpdated(() => {
    onScrollUpdate(dom_enter.value);
})
onMounted(() => {
    dom_enter.value.addEventListener("mousewheel", () => {
        onScroll(dom_enter.value);
    })
    dom_enter.value.addEventListener("touchmove", () => {
        onScroll(dom_enter.value);
    })
})
</script>

<style lang="scss" scoped>
.enter {
    height: 100%;
    order: v-bind(orderStyle);
    flex: v-bind(flexStyle);
    border-bottom: v-bind(borderBottomStyle);
    border-right: v-bind(borderRightStyle);
    padding: 0 5px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    content-visibility: auto;
}
</style>