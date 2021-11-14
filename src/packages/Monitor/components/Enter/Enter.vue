<template>
    <div ref="dom_enter" class="enter">
        <div :style="getWrapStyle(item)" class="item" v-for="item in enterList" :key="item.tt">
            <div :class="`item__level UserLevel--${item.lv}`"></div>
            <div v-if="!!item.noble && options.enter.show.includes('noble')" class="item__noble"><img :src="`${item.noble in nobleData ? nobleData.prefix + nobleData[item.noble].pic : ''}`" loading="lazy"/></div>
            <div v-if="options.enter.show.includes('avatar')" class="item__avatar"><img :src="`https://apic.douyucdn.cn/upload/${item.avatar}_small.jpg`" loading="lazy" /></div>
            <div class="item__name">{{item.nn}} 进入了直播间</div>
        </div>
    </div>
</template>

<script setup>
import {ref, computed, onUpdated } from 'vue'
import {useFlexStyle} from "../../hooks/useFlexStyle.js"
import {useBorderStyle} from "../../hooks/useBorderStyle.js"
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
                return "background-color: rgb(255,243,223)";
            }
        }
    }
    return item.noble ? 'background-color:rgb(227,230,232)' : '';
}

onUpdated(() => {
    if (props.options.lock) {
        return;
    }
    dom_enter.value.scrollTop = dom_enter.value.scrollHeight;
})

</script>

<style lang="scss" scoped>
@import "@/global/utils/dydata/userLevel.scss";
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
            color: rgb(153,153,153);
        }
    }
}
</style>