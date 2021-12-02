<template>
    <div ref="dom_gift" class="gift">
        <Deafult
            v-for="item in giftList"
            :options="options"
            :data="item"
            :allGiftData="allGiftData"
            :key="item.key"
        ></Deafult>
        <div v-show="isLock" class="gobottom" @click.stop="goToScrollBottom(dom_gift)">回到底部</div>
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
    giftList: {
        type: Array,
    },
    allGiftData: {
        type: Object,
    }
});
let { flexStyle, orderStyle } = useFlexStyle(props, "gift");
let { borderBottomStyle, borderRightStyle } = useBorderStyle(props, "gift");
let { isLock, onScroll, onScrollUpdate, goToScrollBottom } = useScroll();
let dom_gift = ref(null);

onUpdated(() => {
    onScrollUpdate(dom_gift.value);
})
onMounted(() => {
    dom_gift.value.addEventListener("mousewheel", () => {
        onScroll(dom_gift.value);
    })
    dom_gift.value.addEventListener("touchmove", () => {
        onScroll(dom_gift.value);
    })
})

</script>

<style lang="scss" scoped>
.gift {
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