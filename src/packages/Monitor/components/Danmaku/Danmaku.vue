<template>
    <div ref="dom_danmaku" class="danmaku">
        <Deafult
            v-for="item in danmakuList"
            :key="item.key"
            :data="item"
            :mode="options.mode"
            :showAnimation="options.animation"
            :showLevel="options.danmaku.show.includes('level')"
            :showNoble="options.danmaku.show.includes('noble')"
            :showFans="options.danmaku.show.includes('fans')"
            :showDiamond="options.danmaku.show.includes('diamond')"
            :showRoomAdmin="options.danmaku.show.includes('roomAdmin')"
            :showAvatar="options.danmaku.show.includes('avatar')"
            :showVip="options.danmaku.show.includes('vip')"
            :showColor="options.danmaku.show.includes('color')"
        ></Deafult>
        <div v-show="isLock" class="gobottom" @click.stop="goToScrollBottom(dom_danmaku)">回到底部</div>
    </div>
</template>

<script setup>
import {ref, onUpdated, onMounted } from 'vue'
import Deafult from "./templates/Default.vue"

import { useFlexStyle } from "../../hooks/useFlexStyle.js"
import { useBorderStyle } from "../../hooks/useBorderStyle.js"
import { useScroll } from '../../hooks/useScroll.js'
let props = defineProps({
    maxOrder: {
        type: Number,
    },
    options: {
        type: Object,
    },
    danmakuList: {
        type: Array,
    }
});
let dom_danmaku = ref(null);
let { flexStyle, orderStyle, justifyContentStyle, textAlignStyle } = useFlexStyle(props, "danmaku");
let { borderBottomStyle, borderRightStyle } = useBorderStyle(props, "danmaku");
let { isLock, onScroll, onScrollUpdate, goToScrollBottom } = useScroll();


onUpdated(() => {
    onScrollUpdate(dom_danmaku.value);
})
onMounted(() => {
    dom_danmaku.value.addEventListener("mousewheel", () => {
        onScroll(dom_danmaku.value);
    })
    dom_danmaku.value.addEventListener("touchmove", () => {
        onScroll(dom_danmaku.value);
    })
})

</script>

<style lang="scss" scoped>
@import "@/global/styles/themes/index.scss";
.danmaku {
    height: 100%;
    order: v-bind(orderStyle);
    flex: v-bind(flexStyle);
    border-bottom: v-bind(borderBottomStyle);
    border-right: v-bind(borderRightStyle);
    overflow-x: hidden;
    overflow-y: auto;
    content-visibility: auto;
    .item {
        justify-content: v-bind(justifyContentStyle);
        text-align: v-bind(textAlignStyle);
    }
}
</style>