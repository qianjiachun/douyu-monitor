<template>
    <div :class="`item ${showAnimation?'fadeInLeft' : ''} ${getItemClass(data)}`">
        <!-- 等级 -->
        <span v-if="showLevel" :class="`item__level UserLevel ${mode==='night' && Number(data.lv < 70)?'fansLevelNight':''} UserLevel--${data.lv}`"></span>
        <!-- 贵族 -->
        <span v-if="!!data.noble && showNoble" class="item__noble Barrage-icon Barrage-noble">
            <img :src="`${data.noble in nobleData ? nobleData.prefix + nobleData[data.noble].pic : ''}`" loading="lazy"/>
        </span>
        <!-- 粉丝牌 -->
        <div v-if="!!data.fansName && showFans" :class="`item__fans ${!!data.diamond && showDiamond ? 'is-diamonds' : ''} FansMedal fansLevel-${data.fansLv}`">
            <span class="FansMedal-name">{{data.fansName}}</span>
            <img v-if="!!data.diamond && showDiamond" class="FansMedalBox-diamondsIcon" src="https://sta-op.douyucdn.cn/douyu/2021/08/05/02304a1c04587e43ac626ce5ce07d935.png" alt="" loading="lazy">
        </div>
        <span v-if="data.roomAdmin=='4' && showRoomAdmin" class="item__roomAdmin">
            <span class="Barrage-icon Barrage-icon--roomAdmin"></span>
        </span>
        <span v-if="showAvatar" class="item__avatar"><img class="avatar" :src="`https://apic.douyucdn.cn/upload/${data.avatar}_small.jpg`" loading="lazy" /></span>
        <span class="item__name">{{data.nn}}：</span>
        <span :style="`color:${danmakuColor[data.color]};`" class="item__txt">{{data.txt}}</span>
    </div>
</template>

<script setup>
import {nobleData} from "@/global/utils/dydata/nobleData.js"
import {danmakuColor} from "@/global/utils/dydata/danmakuColor.js"
let props = defineProps(["data", "mode", "showAnimation", "showLevel", "showNoble", "showFans", "showDiamond", "showRoomAdmin", "showAvatar"])

// 控制日夜模式背景颜色
function getItemClass(data) {
    let ret = "";
    if (data.nobleC || data.super == "5") {
        if (props.mode === "night") {
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