<template>
    <div :class="`item ${showAnimation?'fadeInLeft' : ''} ${getItemClass(data)}`">
        <span v-if="showLevel" :class="`item__level ${mode==='night' && Number(data.lv) < 70 ?'fansLevelNight':''} UserLevel UserLevel--${data.lv}`"></span>
        <span v-if="!!data.noble && showNoble" class="item__noble"><img :src="`${data.noble in nobleData ? nobleData.prefix + nobleData[data.noble].pic : ''}`" loading="lazy"/></span>
        <span v-if="showAvatar" class="item__avatar"><img class="avatar" :src="`https://apic.douyucdn.cn/upload/${data.avatar}_small.jpg`" loading="lazy" /></span>
        <span class="item__name"><span>{{data.nn}}</span> 进入了直播间</span>
    </div>
</template>

<script setup>
import {nobleData} from "@/global/utils/dydata/nobleData.js"
let props = defineProps(["data", "mode", "keywords", "showAnimation", "showLevel", "showNoble", "showAvatar"]);

// 控制高亮以及日夜模式的背景色
function getItemClass(item) {
    let keywords = props.keywords.trim();
    if (keywords !== "") {
        let arr = keywords.split(" ");
        for (let i = 0; i < arr.length; i++) {
            if (item.nn.indexOf(arr[i]) !== -1) {
                if (props.mode === "night") {
                    return "highlight-night";
                } else {
                    return "highlight-day";
                }
            }
        }
    }
    if (item.noble) {
        if (props.mode === "night") {
            return "noble-night";
        } else {
            return "noble-day";
        }
    }
    return "";
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

    .item__name {
        @include fontColor("contentColor");
        span {
            @include fontColor("nicknameColor");
        }
    }
}

.highlight-day {
    background-color:rgb(255,243,223);border-top:1px solid #ffe4b8;border-bottom:1px solid #ffe4b8;
}
.highlight-night {
    background-color: #494949;background-image: linear-gradient(90deg, #494949 0%, #9a9a9a 100%);
}

.noble-day {
    background-color:rgb(227,230,232);
}

.noble-night {
    background-color:rgb(55,55,55);border-top:1px solid rgb(90,90,90);border-bottom:1px solid rgb(90,90,90);
}
</style>