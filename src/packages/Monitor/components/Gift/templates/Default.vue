<template>
    <div :class="`item ${options.animation?'fadeInLeft' : ''} ${getItemClass(data)}`">
        <div class="item__gift">
            <img :src="`${'type' in data ? DIAMOND_URL : allGiftData.prefix}${'type' in data ? '' : allGiftData[data.gfid].pic}`" loading="lazy" />
        </div>
        <div class="item__cnt">{{'type' in data ? data.type : allGiftData[data.gfid].n}}*{{data.gfcnt}}</div>
        <div class="item__name">{{data.nn}}</div>
        <div v-if="Number(data.hits)>=5" class="item__hits">累计x{{data.hits}}</div>
    </div>
</template>

<script setup>
import {computed} from 'vue'
// 钻粉图片
const DIAMOND_URL = "https://shark2.douyucdn.cn/front-publish/live-player-aside-master/assets/images/diamonds_banner_logo_c077d7b.gif"
let props = defineProps({
    // 配置项文件，具体内容参考src\packages\Monitor\options.js
    options: {
        type: Object,
    },
    // 每一条的信息，具体内容参考src\packages\Monitor\hooks\useWebsocket.js
    data: {
        type: Object,
    },
    // 全部礼物数据，这个不要动，原封不动传进来就行
    allGiftData: {
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

function getItemClass(item) {
    if ("type" in item) {
        if (props.options.mode === "night") {
            return "highlight-night";
        } else {
            return "highlight-day";
        }
    }
    if (Number(props.allGiftData[item.gfid].pc) * Number(item.gfcnt) >= Number(props.options.gift.totalPrice) * 100) {
        if (props.options.mode === "night") {
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

    .item__gift, img {
        width: v-bind(imgSizeStyle);
        height: v-bind(imgSizeStyle);
        border-radius: 10%;
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