<template>
    <div ref="dom_danmaku" class="danmaku">
        <div :style="getItemStyle(item)" :class="`item ${options.animation?'fadeInLeft' : ''}`" v-for="item in danmakuList" :key="item.key">
            <!-- 等级 -->
            <span v-if="options.danmaku.show.includes('level')" :class="`item__level UserLevel ${options.mode==='night' && Number(item.lv < 70)?'fansLevelNight':''} UserLevel--${item.lv}`"></span>
            <!-- 贵族 -->
            <span v-if="!!item.noble && options.danmaku.show.includes('noble')" class="item__noble Barrage-icon Barrage-noble">
                <img :src="`${item.noble in nobleData ? nobleData.prefix + nobleData[item.noble].pic : ''}`" loading="lazy"/>
            </span>
            <!-- 粉丝牌 -->
            <div v-if="!!item.fansName && options.danmaku.show.includes('fans')" :class="`item__fans ${!!item.diamond && options.danmaku.show.includes('diamond') ? 'is-diamonds' : ''} FansMedal fansLevel-${item.fansLv}`">
                <span class="FansMedal-name">{{item.fansName}}</span>
                <img v-if="!!item.diamond && options.danmaku.show.includes('diamond')" class="FansMedalBox-diamondsIcon" src="https://sta-op.douyucdn.cn/douyu/2021/08/05/02304a1c04587e43ac626ce5ce07d935.png" alt="" loading="lazy">
            </div>
            <span v-if="item.roomAdmin=='4' && options.danmaku.show.includes('roomAdmin')" class="item__roomAdmin">
                <span class="Barrage-icon Barrage-icon--roomAdmin"></span>
            </span>
            <span v-if="options.danmaku.show.includes('avatar')" class="item__avatar"><img :src="`https://apic.douyucdn.cn/upload/${item.avatar}_small.jpg`" loading="lazy" /></span>
            <span class="item__name">{{item.nn}}：</span>
            <span :style="`color:${danmakuColor[item.color]};`" class="item__txt">{{item.txt}}</span>
        </div>
        <div v-show="isLock" class="gobottom" @click.stop="goToScrollBottom(dom_danmaku)">回到底部</div>
    </div>
</template>

<script setup>
import {ref, computed, onUpdated, onMounted } from 'vue'
import {useFlexStyle} from "../../hooks/useFlexStyle.js"
import {useBorderStyle} from "../../hooks/useBorderStyle.js"
import { useScroll } from '../../hooks/useScroll.js'
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
let dom_danmaku = ref(null);
let { flexStyle, orderStyle } = useFlexStyle(props, "danmaku");
let { borderBottomStyle, borderRightStyle } = useBorderStyle(props, "danmaku");
let { isLock, onScroll, onScrollUpdate, goToScrollBottom } = useScroll();
let imgSizeStyle = computed(() => {
    return `${props.options.fontSize * 2}px`;
})

function getItemStyle(item) {
    if (item.nobleC) {
        if (props.options.mode === "night") {
            return "background-color:rgb(55,55,55);border-top:1px solid rgb(90,90,90);border-bottom:1px solid rgb(90,90,90);";
        } else {
            return "background-color:rgb(255,243,223);border-top:1px solid #ffe4b8;border-bottom:1px solid #ffe4b8;";
        }
    }
    return "";
}

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
    padding: 5px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    content-visibility: auto;
    .item {
        vertical-align: middle;
        width: 100%;
        margin-bottom: 5px;

        &:last-child {
            margin-bottom: 0px;
        }

        >* {
            margin-right: 5px;
        }
        >:nth-last-child(1), >:nth-last-child(2) {
            margin-right: 0;
        }
        .item__level {
            vertical-align: middle;
        }
        .item__fans {
            width: 60px;
            position: relative;
            vertical-align: middle;
        }

        .item__avatar {
            vertical-align: middle;
            img {
                width: v-bind(imgSizeStyle);
                height: v-bind(imgSizeStyle);
                border-radius: 50%;
            }
        }
        .item__name {
            vertical-align: middle;
            @include fontColor("nicknameColor");
        }
        .item__txt {
            vertical-align: middle;
            @include fontColor("txtColor");
        }

    }
}
</style>