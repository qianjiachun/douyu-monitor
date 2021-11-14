<template>
    <div class="monitor" @click.prevent="onClickMonitor">
        <Gift v-if="options.switch.includes('gift')" :maxOrder="maxOrder" :options="options" :giftList="giftList" :allGiftData="allGiftData"></Gift>
        <Enter v-if="options.switch.includes('enter')" :maxOrder="maxOrder" :options="options" :enterList="enterList"></Enter>
        <Danmaku v-if="options.switch.includes('danmaku')" :maxOrder="maxOrder" :options="options" :danmakuList="danmakuList"></Danmaku>
    </div>
    <Popup v-model:show="isShowOption" position="bottom" :style="{ height: '40%' }">
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
                <Field label="锁屏">
                    <template #input>
                        <Switch v-model="options.lock" size="20" />
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

import { Popup, Tab, Tabs, Field, Slider, Checkbox, CheckboxGroup, RadioGroup, Radio, Switch } from 'vant'

import { useNormalStyle } from "../hooks/useNormalStyle.js"
import { useWebsocket } from "../hooks/useWebsocket.js"

import { giftData } from "@/global/utils/dydata/giftData.js"
import { saveLocalData, getLocalData } from "@/global/utils"
import { defaultOptions } from '../options'

const LOCAL_NAME = "monitor_options"

let options = ref(defaultOptions);
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
        localData = defaultOptions;
    }
    options.value = localData;
    let data = await getRoomGiftData(rid);
    let roomGiftData = {prefix: "https://gfs-op.douyucdn.cn/dygift"};
    for (let i = 0; i < data.data.giftList.length; i++) {
        let item = data.data.giftList[i];
        roomGiftData[item.id] = {
            n: item.name,
            pic: item.basicInfo.focusPic,
            pc: item.priceInfo.price,
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

watch(options, (n, o) => {
    saveLocalData(LOCAL_NAME, JSON.stringify(n));
}, {deep: true})

</script>

<style lang="scss" scoped>
.monitor {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: v-bind(directionStyle);
    font-size: v-bind(fontSizeStyle);
    user-select: none;
}
</style>