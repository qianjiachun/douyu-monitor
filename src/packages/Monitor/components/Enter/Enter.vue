<template>
    <div ref="dom_enter" class="enter">
        <div :style="getWrapStyle(item)" :class="`item ${options.animation?'fadeInLeft' : ''}`" v-for="item in enterList" :key="item.key">
            <div v-if="options.enter.show.includes('level')" :class="`item__level ${options.mode==='night' && Number(item.lv < 70)?'fansLevelNight':''} UserLevel--${item.lv}`"></div>
            <div v-if="!!item.noble && options.enter.show.includes('noble')" class="item__noble"><img :src="`${item.noble in nobleData ? nobleData.prefix + nobleData[item.noble].pic : ''}`" loading="lazy"/></div>
            <div v-if="options.enter.show.includes('avatar')" class="item__avatar"><img :src="`https://apic.douyucdn.cn/upload/${item.avatar}_small.jpg`" loading="lazy" /></div>
            <div class="item__name"><span>{{item.nn}}</span> 进入了直播间</div>
        </div>
        <div v-show="isLock" class="gobottom" @click.stop="goToScrollBottom(dom_enter)">回到底部</div>
    </div>
</template>

<script setup>
import {ref, computed, onUpdated, onMounted } from 'vue'
import {useFlexStyle} from "../../hooks/useFlexStyle.js"
import {useBorderStyle} from "../../hooks/useBorderStyle.js"
import { useScroll } from '../../hooks/useScroll.js'
import {nobleData} from "@/global/utils/dydata/nobleData.js"
let props = defineProps({
    maxOrder: {
        type: Number,
    },
    options: {
        type: Object,
    },
    enterList: {
        type: Array,
    }
});
let { flexStyle, orderStyle } = useFlexStyle(props, "enter");
let { borderBottomStyle, borderRightStyle } = useBorderStyle(props, "enter");
let { isLock, onScroll, onScrollUpdate, goToScrollBottom } = useScroll();
let dom_enter = ref(null);
let imgSizeStyle = computed(() => {
    return `${props.options.fontSize * 2}px`;
})
function getWrapStyle(item) {
    let keywords = props.options.enter.keywords.trim();
    if (keywords !== "") {
        let arr = keywords.split(" ");
        for (let i = 0; i < arr.length; i++) {
            if (item.nn.indexOf(arr[i]) !== -1) {
                if (props.options.mode === "night") {
                    return "background-color: #494949;background-image: linear-gradient(90deg, #494949 0%, #9a9a9a 100%);";
                } else {
                    return "background-color:rgb(255,243,223);border-top:1px solid #ffe4b8;border-bottom:1px solid #ffe4b8;";
                }
            }
        }
    }
    if (item.noble) {
        if (props.options.mode === "night") {
            return "background-color:rgb(55,55,55);border-top:1px solid rgb(90,90,90);border-bottom:1px solid rgb(90,90,90);";
        } else {
            return "background-color:rgb(227,230,232);";
        }
    }
    return "";
}

onUpdated(() => {
    onScrollUpdate(dom_enter.value);
})
onMounted(() => {
    dom_enter.value.addEventListener("mousewheel", () => {
        onScroll(dom_enter.value);
    })
    dom_enter.value.addEventListener("touchmove", () => {
        onScroll(dom_enter.value);
    })
})
</script>

<style lang="scss" scoped>
@import "@/global/styles/themes/index.scss";
.enter {
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
        margin-bottom: 5px;

        &:last-child {
            margin-bottom: 0px;
        }
        >*{
            margin-right: 5px;
        }

        img {
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
}
</style>