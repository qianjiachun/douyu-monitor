<template>
    <div :class="`item ${options.animation?'fadeInLeft' : ''} ${getItemClass(data)}`">
        <div v-if="options.enter.show.includes('level')" :class="`item__level ${options.mode==='night' && Number(data.lv < 70)?'fansLevelNight':''} UserLevel--${data.lv}`"></div>
        <div v-if="!!data.noble && options.enter.show.includes('noble')" class="item__noble"><img :src="`${data.noble in nobleData ? nobleData.prefix + nobleData[data.noble].pic : ''}`" loading="lazy"/></div>
        <div v-if="options.enter.show.includes('avatar')" class="item__avatar"><img :src="`https://apic.douyucdn.cn/upload/${data.avatar}_small.jpg`" loading="lazy" /></div>
        <div class="item__name"><span>{{data.nn}}</span> 进入了直播间</div>
    </div>
</template>

<script setup>
import {computed} from 'vue'
import {nobleData} from "@/global/utils/dydata/nobleData.js"
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

// 控制高亮以及日夜模式的背景色
function getItemClass(item) {
    let keywords = props.options.enter.keywords.trim();
    if (keywords !== "") {
        let arr = keywords.split(" ");
        for (let i = 0; i < arr.length; i++) {
            if (item.nn.indexOf(arr[i]) !== -1) {
                if (props.options.mode === "night") {
                    return "highlight-night";
                } else {
                    return "highlight-day";
                }
            }
        }
    }
    if (item.noble) {
        if (props.options.mode === "night") {
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

    .item__noble, img {
        width: v-bind(imgSizeStyle);
        height: v-bind(imgSizeStyle);
        border-radius: 50%;
    }
    .item__level {
        width: 40px;
        height: 16px;
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