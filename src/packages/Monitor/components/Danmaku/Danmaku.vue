<template>
    <div ref="dom_danmaku" class="danmaku">
        <div :style="getItemStyle(item)" class="item" v-for="item in danmakuList" :key="item.key">
            <div v-if="options.danmaku.show.includes('level')" :class="`item__level ${options.mode==='night'?'fansLevelNight':''} UserLevel--${item.lv}`"></div>
            <div v-if="!!item.noble && options.danmaku.show.includes('noble')" class="item__noble"><img :src="`${item.noble in nobleData ? nobleData.prefix + nobleData[item.noble].pic : ''}`" loading="lazy"/></div>
            <div v-if="!!item.fansName && options.danmaku.show.includes('fans')" :class="`item__fans ${!!item.diamond && options.danmaku.show.includes('diamond') ? 'is-diamond' : ''} FansMedal fansLevel-${item.fansLv}`">
                <span class="FansMedal-name">{{item.fansName}}</span>
                <img v-if="!!item.diamond && options.danmaku.show.includes('diamond')" class="FansMedalBox-diamondsIcon" src="https://sta-op.douyucdn.cn/douyu/2021/08/05/02304a1c04587e43ac626ce5ce07d935.png" alt="" loading="lazy">
            </div>
            <div v-if="item.roomAdmin=='4' && options.danmaku.show.includes('roomAdmin')" class="item__roomAdmin">
                <span class="Barrage-icon Barrage-icon--roomAdmin"></span>
            </div>
            <div v-if="options.danmaku.show.includes('avatar')" class="item__avatar"><img :src="`https://apic.douyucdn.cn/upload/${item.avatar}_small.jpg`" loading="lazy" /></div>
            <div class="item__name">{{item.nn}}:</div>
            <div :style="`color:${danmakuColor[item.color]}`" class="item__txt">{{item.txt}}</div>
        </div>
    </div>
</template>

<script setup>
import {ref, computed, onUpdated } from 'vue'
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

function getItemStyle(item) {
    if (item.nobleC) {
        if (props.options.mode === "day") {
            return "background-color:rgb(255,243,223)";
        } else {
            return "background-color:rgb(55,55,55)";
        }
    }
    return "";
}

onUpdated(() => {
    if (!props.options.lock) {
        dom_danmaku.value.scrollTop = dom_danmaku.value.scrollHeight;
    }
    
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
    padding: 5px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
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
            border-radius: 50%;
        }
        .item__roomAdmin {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
        }
        .item__fans {
            width: 60px;
            position: relative;
        }
        .item__level {
            width: 40px;
            height: 16px;
        }
        .item__name {
            @include fontColor("nicknameColor");
        }
        .item__txt {
            @include fontColor("txtColor");
        }
        .is-diamond {
            padding-right: 24px;
        }
    }
}
</style>