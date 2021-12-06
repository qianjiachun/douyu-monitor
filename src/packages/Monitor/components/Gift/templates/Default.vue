<template>
    <div :class="`item ${showAnimation?'fadeInLeft' : ''} ${getItemClass(data)}`">
        <div class="item__gift">
            <img class="avatar" :src="`${'type' in data ? DIAMOND_URL : GIFT_IMG_PREFIX}${'type' in data ? '' : giftData.pic}`" loading="lazy" />
        </div>
        <div class="item__cnt">{{'type' in data ? data.type : giftData.n}}*{{data.gfcnt}}</div>
        <div class="item__name">{{data.nn}}</div>
        <div v-if="Number(data.hits)>=5" class="item__hits">累计x{{data.hits}}</div>
    </div>
</template>

<script setup>
// 钻粉图片
const DIAMOND_URL = "https://shark2.douyucdn.cn/front-publish/live-player-aside-master/assets/images/diamonds_banner_logo_c077d7b.gif"
const GIFT_IMG_PREFIX = "https://gfs-op.douyucdn.cn/dygift"

let props = defineProps(["data", "giftData", "mode", "showAnimation", "totalPrice"])


function getItemClass(item) {
    if ("type" in item) {
        if (props.mode === "night") {
            return "highlight-night";
        } else {
            return "highlight-day";
        }
    }
    if (Number(props.giftData.pc) * Number(item.gfcnt) >= Number(props.totalPrice) * 100) {
        if (props.mode === "night") {
            return "highlight-night";
        } else {
            return "highlight-day";
        }
    } else {
        return "";
    }
}
</script>

<style lang="scss" scoped>
@import "@/global/styles/themes/index.scss";
.item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 5px;
    justify-content: v-bind(justifyContentStyle);
    text-align: v-bind(textAlignStyle);

    &:first-child {
        margin-top: 5px;
    }
    >*{
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