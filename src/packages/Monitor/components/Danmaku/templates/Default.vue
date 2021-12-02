<template>
    <div :class="`item ${options.animation?'fadeInLeft' : ''} ${getItemClass(data)}`">
        <!-- 等级 -->
        <span v-if="options.danmaku.show.includes('level')" :class="`item__level UserLevel ${options.mode==='night' && Number(data.lv < 70)?'fansLevelNight':''} UserLevel--${data.lv}`"></span>
        <!-- 贵族 -->
        <span v-if="!!data.noble && options.danmaku.show.includes('noble')" class="item__noble Barrage-icon Barrage-noble">
            <img :src="`${data.noble in nobleData ? nobleData.prefix + nobleData[data.noble].pic : ''}`" loading="lazy"/>
        </span>
        <!-- 粉丝牌 -->
        <div v-if="!!data.fansName && options.danmaku.show.includes('fans')" :class="`item__fans ${!!data.diamond && options.danmaku.show.includes('diamond') ? 'is-diamonds' : ''} FansMedal fansLevel-${data.fansLv}`">
            <span class="FansMedal-name">{{data.fansName}}</span>
            <img v-if="!!data.diamond && options.danmaku.show.includes('diamond')" class="FansMedalBox-diamondsIcon" src="https://sta-op.douyucdn.cn/douyu/2021/08/05/02304a1c04587e43ac626ce5ce07d935.png" alt="" loading="lazy">
        </div>
        <span v-if="data.roomAdmin=='4' && options.danmaku.show.includes('roomAdmin')" class="item__roomAdmin">
            <span class="Barrage-icon Barrage-icon--roomAdmin"></span>
        </span>
        <span v-if="options.danmaku.show.includes('avatar')" class="item__avatar"><img :src="`https://apic.douyucdn.cn/upload/${data.avatar}_small.jpg`" loading="lazy" /></span>
        <span class="item__name">{{data.nn}}：</span>
        <span :style="`color:${danmakuColor[data.color]};`" class="item__txt">{{data.txt}}</span>
    </div>
</template>

<script setup>
import {computed} from 'vue'
import {nobleData} from "@/global/utils/dydata/nobleData.js"
import {danmakuColor} from "@/global/utils/dydata/danmakuColor.js"
let props = defineProps({
    // 配置项文件，具体内容参考src\packages\Monitor\options.js
    options: {
        type: Object,
    },
    // 每一条的信息，具体内容参考src\packages\Monitor\hooks\useWebsocket.js
    data: {
        type: Object,
    }
});

// 图片（头像）尺寸
let imgSizeStyle = computed(() => {
    return `${props.options.fontSize * 2}px`;
});

// 控制左右对齐
let justifyContentStyle = computed(() => {
    return props.options.align === "right" ? "flex-end" : "flex-start";
});
// 控制左右对齐
let textAlignStyle = computed(() => {
    return props.options.align === "right" ? "right" : "left";
});

// 控制日夜模式背景颜色
function getItemClass(data) {
    let ret = "";
    if (data.nobleC) {
        if (props.options.mode === "night") {
            ret = "noble-night";
        } else {
            ret = "noble-day"
        }
    }
    return ret;
}
</script>

<style lang="scss" scoped>
@import "@/global/styles/themes/index.scss";
.item {
    vertical-align: middle;
    width: 100%;
    margin-bottom: 5px;
    justify-content: v-bind(justifyContentStyle);
    text-align: v-bind(textAlignStyle);
    &:first-child {
        margin-top: 5px;
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
.noble-day {
    background-color:rgb(255,243,223);border-top:1px solid #ffe4b8;border-bottom:1px solid #ffe4b8;
}

.noble-night {
    background-color:rgb(55,55,55);border-top:1px solid rgb(90,90,90);border-bottom:1px solid rgb(90,90,90);
}
</style>