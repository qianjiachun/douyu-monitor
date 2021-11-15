<template>
    <div ref="dom_gift" class="gift">
        <div :style="getItemStyle(item)" class="item" v-for="item in giftList" :key="item.key">
            <div class="item__gift"><img :src="`${allGiftData.prefix}${allGiftData[item.gfid].pic}`" loading="lazy" /></div>
            <div class="item__cnt">{{allGiftData[item.gfid].n}}*{{item.gfcnt}}</div>
            <div class="item__name">{{item.nn}}</div>
        </div>
    </div>
</template>

<script setup>
import {ref, computed, onUpdated } from 'vue'
import {useFlexStyle} from "../../hooks/useFlexStyle.js"
import {useBorderStyle} from "../../hooks/useBorderStyle.js"
let props = defineProps({
    maxOrder: {
        type: Number,
    },
    options: {
        type: Object,
    },
    giftList: {
        type: Array,
    },
    allGiftData: {
        type: Object,
    }
});
let { flexStyle, orderStyle } = useFlexStyle(props, "gift");
let { borderBottomStyle, borderRightStyle } = useBorderStyle(props, "gift");
let dom_gift = ref(null);
let imgSizeStyle = computed(() => {
    return `${props.options.fontSize * 2}px`;
})

function getItemStyle(item) {
    if (Number(props.allGiftData[item.gfid].pc) * Number(item.gfcnt) >= Number(props.options.gift.totalPrice) * 100) {
        if (props.options.mode === "day") {
            return "background-color:rgb(255,243,223)";
        } else {
            return "background-color:rgb(55,55,55)";
        }
    } else {
        return "";
    }
}


onUpdated(() => {
    if (props.options.lock) {
        return;
    }
    dom_gift.value.scrollTop = dom_gift.value.scrollHeight;
})

</script>

<style lang="scss" scoped>
@import "@/global/styles/themes/index.scss";
.gift {
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
    }
}
</style>