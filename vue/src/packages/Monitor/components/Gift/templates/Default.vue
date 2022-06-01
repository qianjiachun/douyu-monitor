<template>
    <div :class="`item ${showAnimation?'fadeInLeft' : ''} ${getItemClass(data)}`">
        <span class="item__gift">
            <img class="avatar" :src="avatarSrc" loading="lazy" />
        </span>
        <span class="item__cnt">{{giftName}}</span>
        <span class="item__name">{{data.nn}}</span>
        <span v-if="Number(data.hits) >= 5" class="item__hits">累计x{{data.hits}}</span>
    </div>
</template>

<script setup>
import {computed} from "vue"
import {nobleData} from "@/global/utils/dydata/nobleData.js"
// 钻粉图片
const DIAMOND_URL = "https://shark2.douyucdn.cn/front-publish/live-player-aside-master/assets/images/diamonds_banner_logo_c077d7b.gif"
const GIFT_IMG_PREFIX = "https://gfs-op.douyucdn.cn/dygift"
const FANS_LEVEL_UP = "https://shark2.douyucdn.cn/front-publish/live-anchor-title-master/assets/images/exp_ca09807.webp"

let props = defineProps(["data", "giftData", "mode", "showAnimation", "totalPrice"])

let avatarSrc = computed(() => {
    let ret = "";
    switch (props.data.type) {
        case "礼物":
            ret += GIFT_IMG_PREFIX + props.giftData.pic;
            break;
        case "钻粉":
            ret += DIAMOND_URL;
            break;
        case "贵族":
            ret += nobleData.prefix + nobleData[props.data.nl].pic;
            break;
        case "粉丝牌升级":
            ret += FANS_LEVEL_UP;
            break;
        default:
            break;
    }
    return ret;
});

let giftName = computed(() => {
    let ret = "";
    switch (props.data.type) {
        case "礼物":
            ret = `${props.giftData.n}*${props.data.gfcnt}`;
            break;
        case "钻粉":
            ret = props.data.name;
            break;
        case "贵族":
            ret = props.data.name;
            break;
        case "粉丝牌升级":
            ret = props.data.name;
            break;
        default:
            break;
    }
    return ret;
});

function getItemClass(item) {
    let ret = "";
    switch (props.data.type) {
        case "礼物":
            if (Number(props.giftData.pc) * Number(item.gfcnt) >= Number(props.totalPrice) * 100) {
                if (props.mode === "night") {
                    ret = "highlight-night";
                } else {
                    ret = "highlight-day";
                }
            }
            break;
        case "钻粉":
            if (props.mode === "night") {
                ret = "highlight-night";
            } else {
                ret = "highlight-day";
            }
            break;
        case "贵族":
            if (props.mode === "night") {
                ret = "highlight-night";
            } else {
                ret = "highlight-day";
            }
            break;
        case "粉丝牌升级":
            // 当粉丝牌升级大于10级则高亮
            if (item.bl > 10) {
                if (props.mode === "night") {
                    ret = "highlight-night";
                } else {
                    ret = "highlight-day";
                }
            }
            break;
        default:
            break;
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
    padding: 0 4px;
    box-sizing: border-box;

    &:first-child {
        margin-top: 5px;
    }
    >*{
        vertical-align: middle;
        margin-right: 5px;
    }
    .item__gift {
        img {
            border-radius: 10%;
        }
    }
    .item__fans {
        width: 60px;
    }
    .item__level {
        width: 40px;
        height: 16px;
    }
    .item__name {
        @include fontColor("nicknameColor");
    }
    .item__cnt {
        @include fontColor("contentColor");
    }
    .item__hits {
        @include fontColor("contentColor");
    }
}

.highlight-day {
    background-color:rgb(255,243,223);
}

.highlight-night {
    background-color:rgb(55,55,55);border-top:1px solid rgb(90,90,90);border-bottom:1px solid rgb(90,90,90);
}
</style>