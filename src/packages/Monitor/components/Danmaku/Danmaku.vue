<template>
    <div ref="dom_danmaku" class="danmaku">
        <div :style="`${item.nobleC ? 'background-color:rgb(255,243,223)' : ''}`" class="item" v-for="item in danmakuList" :key="item.tt">
            <div :class="`item__level UserLevel--${item.lv}`"></div>
            <div v-if="!!item.noble && options.danmaku.show.includes('noble')" class="item__noble"><img :src="`${item.noble in nobleData ? nobleData.prefix + nobleData[item.noble].pic : ''}`" loading="lazy"/></div>
            <div v-if="!!item.fansName && options.danmaku.show.includes('fans')" :class="`item__fans FansMedal fansLevel-${item.fansLv}`">
                <span class="FansMedal-name">{{item.fansName}}</span>
            </div>
            <div v-if="options.danmaku.show.includes('avatar')" class="item__avatar"><img :src="`https://apic.douyucdn.cn/upload/${item.avatar}_small.jpg`" loading="lazy" /></div>
            <div class="item__name">{{item.nn}}:</div>
            <div :style="`color:${danmakuColor[item.color]}`" class="item__txt">{{item.txt}}</div>
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
let imgSizeStyle = computed(() => {
    return `${props.options.fontSize * 2}px`;
})


onUpdated(() => {
    if (props.options.lock) {
        return;
    }
    dom_danmaku.value.scrollTop = dom_danmaku.value.scrollHeight;
})

</script>

<style lang="scss" scoped>
@import "@/global/utils/dydata/userLevel.scss";
@import "@/global/utils/dydata/fansLevel.scss";
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
        flex-wrap: wrap;
        align-items: center;
        >*{
            margin-right: 5px;
        }

        img {
            width: v-bind(imgSizeStyle);
            height: v-bind(imgSizeStyle);
        }
        .item__fans {
            width: 60px;
        }
        .item__level {
            width: 40px;
            height: 16px;
        }
        .item__name {
            color: rgb(153,153,153);
        }
        .item__txt {
            color: rgb(51,51,51)
        }
    }
}
</style>