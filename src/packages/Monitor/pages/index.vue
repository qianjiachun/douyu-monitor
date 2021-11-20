<template>
    <div class="monitor" @click.prevent="onClickMonitor" ref="domMonitor">
        <Gift v-if="options.switch.includes('gift')" :maxOrder="maxOrder" :options="options" :giftList="giftList" :allGiftData="allGiftData"></Gift>
        <Enter v-if="options.switch.includes('enter')" :maxOrder="maxOrder" :options="options" :enterList="enterList"></Enter>
        <Danmaku v-if="options.switch.includes('danmaku')" :maxOrder="maxOrder" :options="options" :danmakuList="danmakuList"></Danmaku>
    </div>
    <Popup class="popup" v-model:show="isShowOption" position="bottom" :style="{ height: '50%' }">
        <div class="popup-top">
            <div class="douyuex">
                <a href="https://xiaochunchun.gitee.io/douyuex/" target="_blank">
                    <svg t="1637284063150" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2978" width="24" height="24"><path d="M1006.1 412.7l-187.5-141c0-0.2 0.1-0.3 0.1-0.4V121.4c0-2.3-1.9-4.2-4.2-4.2h-92.4c-2.3 0-4.2 1.9-4.2 4.2V196L535.3 58.8c-7.3-5.5-16-8.4-25.1-8.4-9.2 0-17.9 2.9-25.2 8.5L16.7 412.5C7.8 419.2 2.1 429 0.5 440.1c-2.1 14.8 3.8 29.5 16.2 39.3 4.3 3.3 9.2 5.7 14.5 7 13 3.2 25.8 0.6 36-7.1L505 148.6c3.1-2.3 7.4-2.3 10.4 0l441.8 332c7.3 5.5 16 8.4 25.1 8.4 13.7 0 26.3-6.5 34.2-17.7 13.3-18.8 7.9-44.9-10.4-58.6z" p-id="2979" fill="#8a8a8a"></path><path d="M906.7 499.4l-193.2-140-196.7-142.5c-3.4-2.5-8.1-2.5-11.5 0L308.7 359.4l-193.2 140c-5.6 4.1-9 10.6-9 17.6v392.1c0 35.5 29 64.5 64.5 64.5h246.7V716.2c0-30 24.6-54.6 54.6-54.6h77.5c30 0 54.6 24.6 54.6 54.6v257.4h246.7c35.5 0 64.5-29 64.5-64.5V517c0.1-6.9-3.3-13.5-8.9-17.6z" p-id="2980" fill="#8a8a8a"></path></svg>
                </a>
            </div>
            <div class="github">
                <a href="https://github.com/qianjiachun/douyu-monitor" target="_blank"><svg t="1636974784707" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7184" width="24" height="24"><path d="M511.957333 21.333333C241.024 21.333333 21.333333 240.981333 21.333333 512c0 216.832 140.544 400.725333 335.573334 465.664 24.490667 4.394667 32.256-10.069333 32.256-23.082667 0-11.690667 0.256-44.245333 0-85.205333-136.448 29.610667-164.736-64.64-164.736-64.64-22.314667-56.704-54.4-71.765333-54.4-71.765333-44.586667-30.464 3.285333-29.824 3.285333-29.824 49.194667 3.413333 75.178667 50.517333 75.178667 50.517333 43.776 75.008 114.816 53.333333 142.762666 40.789333 4.522667-31.658667 17.152-53.376 31.189334-65.536-108.970667-12.458667-223.488-54.485333-223.488-242.602666 0-53.546667 19.114667-97.322667 50.517333-131.669334-5.034667-12.330667-21.930667-62.293333 4.778667-129.834666 0 0 41.258667-13.184 134.912 50.346666a469.802667 469.802667 0 0 1 122.88-16.554666c41.642667 0.213333 83.626667 5.632 122.88 16.554666 93.653333-63.488 134.784-50.346667 134.784-50.346666 26.752 67.541333 9.898667 117.504 4.864 129.834666 31.402667 34.346667 50.474667 78.122667 50.474666 131.669334 0 188.586667-114.730667 230.016-224.042666 242.090666 17.578667 15.232 33.578667 44.672 33.578666 90.453334v135.850666c0 13.141333 7.936 27.605333 32.853334 22.869334C862.250667 912.597333 1002.666667 728.746667 1002.666667 512 1002.666667 240.981333 783.018667 21.333333 511.957333 21.333333z" p-id="7185" fill="#8a8a8a"></path></svg></a>
            </div>
            <div @click="onClickChangeMode">
                <svg v-if="options.mode === 'night'" t="1636947364663" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17884" width="24" height="24"><path d="M487.204571 67.474286A444.525714 444.525714 0 1 1 92.16 715.373714a357.778286 357.778286 0 1 0 296.96-636.708571c32.182857-7.350857 65.097143-11.081143 98.084571-11.190857z" p-id="17885" fill="#8a8a8a"></path></svg>
                <svg v-else t="1636947463842" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20823" width="24" height="24"><path d="M438.857 73.143c0-40.396 32.466-73.143 73.143-73.143 40.396 0 73.143 32.466 73.143 73.143v73.143h-146.286v-73.143zM438.857 877.714h146.286v73.143c0 40.396-32.466 73.143-73.143 73.143-40.396 0-73.143-32.466-73.143-73.143v-73.143zM73.143 585.143c-40.396 0-73.143-32.466-73.143-73.143 0-40.396 32.466-73.143 73.143-73.143h73.143v146.286h-73.143zM877.714 585.143v-146.286h73.143c40.396 0 73.143 32.466 73.143 73.143 0 40.396-32.466 73.143-73.143 73.143h-73.143zM149.961 253.401c-28.564-28.564-28.763-74.676 0-103.44 28.564-28.564 74.676-28.763 103.44 0l51.719 51.719-103.44 103.44-51.722-51.719zM718.879 822.319l103.44-103.44 51.719 51.722c28.564 28.564 28.763 74.676 0 103.44-28.564 28.564-74.676 28.763-103.44 0l-51.719-51.719zM253.401 874.039c-28.564 28.564-74.676 28.763-103.44 0-28.564-28.564-28.763-74.676 0-103.44l51.719-51.719 103.44 103.44-51.719 51.722zM822.319 305.121l-103.44-103.44 51.722-51.719c28.564-28.564 74.676-28.763 103.44 0 28.564 28.564 28.763 74.676 0 103.44l-51.719 51.719zM512 804.571c161.583 0 292.571-130.989 292.571-292.571 0-161.583-130.989-292.571-292.571-292.571-161.583 0-292.571 130.989-292.571 292.571 0 161.583 130.989 292.571 292.571 292.571z" p-id="20824" fill="#8a8a8a"></path></svg>
            </div>
            <div @click="onClickRestOptions">
                <svg t="1636947206527" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14990" width="24" height="24"><path d="M890.092308 988.002462a37.257846 37.257846 0 0 1-25.67877-27.72677c-53.326769-236.937846-209.526154-305.467077-408.576-368.64l-55.847384 182.744616a37.415385 37.415385 0 0 1-67.741539 8.428307L65.851077 353.516308a37.257846 37.257846 0 0 1 15.281231-53.090462L549.021538 70.656a37.257846 37.257846 0 0 1 40.96 5.198769 37.651692 37.651692 0 0 1 11.500308 39.384616l-47.261538 154.702769c92.317538 34.264615 169.905231 87.985231 230.636307 159.901538 54.429538 64.275692 95.310769 142.966154 121.619693 233.787077 42.771692 147.692308 33.004308 277.897846 31.744 292.312616v0.157538a37.336615 37.336615 0 0 1-34.816 33.634462 40.329846 40.329846 0 0 1-13.39077-1.732923zM352.492308 673.476923l42.692923-139.657846a37.494154 37.494154 0 0 1 46.710154-24.733539c129.969231 39.778462 233.314462 78.769231 314.998153 140.288 35.052308 26.151385 65.851077 56.871385 91.766154 91.608616a733.026462 733.026462 0 0 0-14.493538-58.683077c-53.563077-182.114462-166.990769-300.819692-337.289846-352.886154a38.281846 38.281846 0 0 1-22.291693-18.432 36.312615 36.312615 0 0 1-2.599384-28.356923l32.610461-106.653538-353.28 173.292307L352.492308 673.476923z" fill="#8a8a8a" p-id="14991"></path></svg>
            </div>
        </div>
        <Tabs v-model:active="activeTab">
            <Tab title="通用">
                <Field label="布局">
                    <template #input>
                        <CheckboxGroup v-model="options.switch" direction="horizontal" @change="onChangeSwitch">
                            <Checkbox name="enter" shape="square">进场</Checkbox>
                            <Checkbox name="gift" shape="square">礼物</Checkbox>
                            <Checkbox name="danmaku" shape="square">弹幕</Checkbox>
                        </CheckboxGroup>
                    </template>
                </Field>
                <Field label="方向">
                    <template #input>
                        <RadioGroup v-model="options.direction" direction="horizontal">
                            <Radio name="column">纵向</Radio>
                            <Radio name="row">横向</Radio>
                        </RadioGroup>
                    </template>
                </Field>
                <Field label="字号">
                    <template #input>
                        <Slider v-model="options.fontSize" :min="12" :max="30"/>
                    </template>
                </Field>
                <Field label="背景透明">
                    <template #input>
                        <Switch v-model="options.transparent" size="20" />
                    </template>
                </Field>
                <Field label="动画">
                    <template #input>
                        <Switch v-model="options.animation" size="20" />
                    </template>
                </Field>
                <Field v-model="options.threshold" label="数据上限" type="digit" placeholder="当超过上限 旧数据会被删除"></Field>
            </Tab>
            <Tab title="弹幕">
                <Field label="占比">
                    <template #input>
                        <Slider v-model="options.size.danmaku" :disabled="maxOrder===options.order.danmaku"/>
                    </template>
                </Field>
                <Field label="显示">
                    <template #input>
                        <CheckboxGroup v-model="options.danmaku.show" direction="horizontal">
                            <Checkbox name="level" shape="square">等级</Checkbox>
                            <Checkbox name="noble" shape="square">贵族</Checkbox>
                            <Checkbox name="fans" shape="square">粉丝牌</Checkbox>
                            <Checkbox name="avatar" shape="square">头像</Checkbox>
                            <Checkbox name="roomAdmin" shape="square">房管</Checkbox>
                            <Checkbox name="diamond" shape="square">钻粉</Checkbox>
                        </CheckboxGroup>
                    </template>
                </Field>
                <Field v-model="options.danmaku.ban.level" label="屏蔽等级≤" type="digit" placeholder="请输入屏蔽的等级"></Field>
                <Field v-model="options.danmaku.ban.keywords" label="屏蔽关键词" placeholder="空格隔开 例如:弹幕1 弹幕2"></Field>
                <Field v-model="options.danmaku.ban.nicknames" label="屏蔽昵称" placeholder="模糊匹配 空格隔开 例如:昵称1 昵称2"></Field>
            </Tab>
            <Tab title="礼物">
                <Field label="占比">
                    <template #input>
                        <Slider v-model="options.size.gift" :disabled="maxOrder===options.order.gift"/>
                    </template>
                </Field>
                <Field v-model="options.gift.ban.price" label="屏蔽单价<" type="number" placeholder="请输入单价"></Field>
                <Field v-model="options.gift.totalPrice" label="高亮总价≥" type="number" placeholder="请输入总价"></Field>
                <Field v-model="options.gift.ban.keywords" label="屏蔽关键词" placeholder="空格隔开 例如:荧光棒 鱼丸"></Field>
            </Tab>
            <Tab title="进场">
                <Field label="占比">
                    <template #input>
                        <Slider v-model="options.size.enter" :disabled="maxOrder===options.order.enter"/>
                    </template>
                </Field>
                <Field label="显示">
                    <template #input>
                        <CheckboxGroup v-model="options.enter.show" direction="horizontal">
                            <Checkbox name="level" shape="square">等级</Checkbox>
                            <Checkbox name="noble" shape="square">贵族</Checkbox>
                            <Checkbox name="avatar" shape="square">头像</Checkbox>
                        </CheckboxGroup>
                    </template>
                </Field>
                <Field v-model="options.enter.keywords" label="关键昵称" placeholder="空格隔开 例如:昵称1 昵称2"></Field>
            </Tab>
        </Tabs>
    </Popup>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

import Danmaku from "../components/Danmaku/Danmaku.vue"
import Gift from "../components/Gift/Gift.vue"
import Enter from "../components/Enter/Enter.vue"

import { Popup, Tab, Tabs, Field, Slider, Checkbox, CheckboxGroup, RadioGroup, Radio, Switch, Dialog } from 'vant'

import { useNormalStyle } from "../hooks/useNormalStyle.js"
import { useWebsocket } from "../hooks/useWebsocket.js"

import { giftData } from "@/global/utils/dydata/giftData.js"
import { saveLocalData, getLocalData, deepCopy, getClassStyle, getStrMiddle } from "@/global/utils"
import { defaultOptions } from '../options'

const LOCAL_NAME = "monitor_options"

let domMonitor = ref(null);
let options = ref(deepCopy(defaultOptions));
let allGiftData = ref({});
let isShowOption = ref(false);
let activeTab = ref(0);
let { directionStyle, fontSizeStyle } = useNormalStyle(options);
let { connectWs, danmakuList, enterList, giftList } = useWebsocket(options, allGiftData);

let maxOrder = computed(() => {
    let ret = 0;
    for (const key in options.value.order) {
        if (options.value.order[key] > ret) {
            ret = options.value.order[key];
        }
    }
    return ret;
});

onMounted(async () => {
    let rid = window.rid;
    let localData = JSON.parse(getLocalData(LOCAL_NAME));
    if (Object.prototype.toString.call(localData) !== '[object Object]') {
        localData = deepCopy(defaultOptions);
    }
    options.value = localData;

    let data = await getRoomGiftData(rid);
    let roomGiftData = {prefix: "https://gfs-op.douyucdn.cn/dygift"};
    if ("giftList" in data.data) {
        for (let i = 0; i < data.data.giftList.length; i++) {
            let item = data.data.giftList[i];
            roomGiftData[item.id] = {
                n: item.name,
                pic: item.basicInfo.focusPic,
                pc: item.priceInfo.price,
            }
        }
    }
    allGiftData.value = {...roomGiftData, ...giftData};
	connectWs(rid);
})

function getRoomGiftData(rid) {
    return new Promise(resolve => {
        fetch('https://gift.douyucdn.cn/api/gift/v2/web/list?rid=' + rid,{
            method: 'GET',
        }).then(res => {
            return res.json();
        }).then(ret => {
            resolve(ret);
        }).catch(err => {
            console.log("请求失败!", err);
        })
    })
}

function onClickMonitor() {
    isShowOption.value = true;
}

function onChangeSwitch(list) {
    for (const key in options.value.order) {
        let index = list.indexOf(key);
        options.value.order[key] = index + 1;
    }
}

function onClickChangeMode() {
    if (options.value.mode === "night") {
        options.value.mode = "day";
    } else {
        options.value.mode = "night";
    }
}

function onClickRestOptions() {
    Dialog.confirm({
        title: '提示',
        message: '确认恢复默认设置？',
    })
    .then(() => {
        options.value = deepCopy(defaultOptions);
    }).catch(() => {});
}



watch(options, (n, o) => {
    saveLocalData(LOCAL_NAME, JSON.stringify(n));
}, {deep: true})

watch(() => options.value.mode, (n, o) => {
    if (n === "night") {
        window.document.documentElement.setAttribute("data-theme", 'night');
    } else {
        window.document.documentElement.setAttribute("data-theme", 'day');
    }
}, {immediate: true, deep: true})


watch(() => options.value.transparent, (n, o) => {
    if (!domMonitor.value) {
        return;
    }
    if (!n) {
        domMonitor.value.style.backgroundColor = ``;
        return;
    }
    let str = getClassStyle(domMonitor.value, "backgroundColor");
    let rgb = String(str).match(/[^\(\)]+(?=\))/g)[0];
    if (n) {
        domMonitor.value.style.backgroundColor = `rgba(${rgb},0)`;
    }
}, {immediate: true, deep: true})


</script>

<style lang="scss" scoped>
@import "@/global/styles/themes/index.scss";
.monitor {
    @include backgroundColor("backgroundColor");
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: v-bind(directionStyle);
    font-size: v-bind(fontSizeStyle);
    user-select: none;
}
.popup {
    .popup-top {
        user-select: none;
        height: 32px;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        padding: 0 10px;
        box-sizing: border-box;
        text-align: right;
        border-bottom: 1px solid rgb(227, 227, 227);
        > div {
            width: 24px;
            height: 24px;
            margin-left: 10px;
            cursor: pointer;
        }
        .douyuex {
            position: absolute;
            left: 0;
        }
        .github {
            position: absolute;
            left: 34px;
        }
    }
}

</style>