<template>
    <div ref="dom_danmaku" class="danmaku">
        <div class="item" v-for="item in danmakuList" :key="item.tt">
            <div class="item__avatar"><img :src="`https://apic.douyucdn.cn/upload/${item.avatar}_small.jpg`" loading="lazy" /></div>
            <div class="item__noble"><img :src="`${nobleData.prefix}${nobleData[item.noble]?.pic}`" loading="lazy"/></div>
            <div class="item__fans">【Lv.{{item.fansLv}} {{item.fansName}}】</div>
            <div :class="`item__level UserLevel--${item.lv}`"></div>
            <div class="item__name">{{item.nn}}</div>
            <div :style="`color:${danmakuColor[item.color]}`" class="item__txt">：{{item.txt}}</div>
        </div>
    </div>
</template>

<script setup>
import {ref, computed, watch, onUpdated } from 'vue'
import {useFlexStyle} from "../../hooks/useFlexStyle.js"
import {useBorderStyle} from "../../hooks/useBorderStyle.js"
import {nobleData} from "@/global/utils/dydata/nobleData.js"
import {danmakuColor} from "@/global/utils/dydata/danmakuColor.js"
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
let { flexStyle, orderStyle } = useFlexStyle(props, "danmaku");
let { borderBottomStyle, borderRightStyle } = useBorderStyle(props, "danmaku");
let dom_danmaku = ref(null);


onUpdated(() => {
    dom_danmaku.value.scrollTop = dom_danmaku.value.scrollHeight
})

</script>

<style lang="scss" scoped>
@import "@/global/utils/dydata/userLevel.scss";
.danmaku {
    height: 100%;
    order: v-bind(orderStyle);
    flex: v-bind(flexStyle);
    border-bottom: v-bind(borderBottomStyle);
    border-right: v-bind(borderRightStyle);
    padding: 5px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: scroll;
    content-visibility: auto;
    .item {
        display: flex;
        .item__avatar img {
            width: 20px;
            height: 20px;
        }
        .item__noble img {
            width: 20px;
            height: 20px;
        }
        .item__level {
            width: 40px;
            height: 16px;
        }
    }
}
</style>