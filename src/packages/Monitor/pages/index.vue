<template>
    <div class="monitor" @click.prevent="onClickMonitor">
        <Gift v-if="options.switch.includes('gift')" :maxOrder="maxOrder" :options="options"></Gift>
        <Enter v-if="options.switch.includes('enter')" :maxOrder="maxOrder" :options="options"></Enter>
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
                            <Checkbox name="noble" shape="square">贵族</Checkbox>
                            <Checkbox name="fans" shape="square">粉丝牌</Checkbox>
                            <Checkbox name="avatar" shape="square">头像</Checkbox>
                        </CheckboxGroup>
                    </template>
                </Field>
                <Field v-model="options.danmaku.ban.level" label="屏蔽等级" type="digit" placeholder="请输入屏蔽的等级"></Field>
                <Field v-model="options.danmaku.ban.keywords" label="屏蔽关键词" placeholder="空格隔开 例如:弹幕1 弹幕2"></Field>
                <Field v-model="options.danmaku.ban.nicknames" label="屏蔽昵称" placeholder="模糊匹配 空格隔开 例如:昵称1 昵称2"></Field>
            </Tab>
            <Tab title="礼物">
                <Field label="占比">
                    <template #input>
                        <Slider v-model="options.size.gift" :disabled="maxOrder===options.order.gift"/>
                    </template>
                </Field>
            </Tab>
            <Tab title="进场">
                <Field label="占比">
                    <template #input>
                        <Slider v-model="options.size.enter" :disabled="maxOrder===options.order.enter"/>
                    </template>
                </Field>
            </Tab>
        </Tabs>
    </Popup>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import Danmaku from "../components/Danmaku/Danmaku.vue"
import Gift from "../components/Gift/Gift.vue"
import Enter from "../components/Enter/Enter.vue"

import { Popup, Tab, Tabs, Form, Field, CellGroup, Slider, Checkbox, CheckboxGroup, RadioGroup, Radio } from 'vant'

import { useNormalStyle } from "../hooks/useNormalStyle.js"
import { useWebsocket } from "../hooks/useWebsocket.js"

let options = ref({
    // 纵向column 横向row
    direction: "column",
    // 每个模块的占比%
    size: {
        enter: 20,
        gift: 20,
        danmaku: 30,
    },
    // 每个模块的排序
    order: {
        enter: 0,
        gift: 1,
        danmaku: 2,
    },
    // 每个模块开关，按顺序排
    switch: ["enter", "gift", "danmaku"],
    // 数据阈值
    threshold: 300,
    // 锁屏
    lock: false, 
    // 字号
    fontSize: 14,
    // 弹幕设置
    danmaku: {
        show: ["avatar", "fans", "noble"],
        ban: {
            level: 0,
            keywords: "",
            nicknames: "",
        }
    }
});

let { directionStyle, fontSizeStyle } = useNormalStyle(options);
let { connectWs, danmakuList } = useWebsocket(options);

let isShowOption = ref(false);
let activeTab = ref(0);

let maxOrder = computed(() => {
    let ret = 0;
    for (const key in options.value.order) {
        if (options.value.order[key] > ret) {
            ret = options.value.order[key];
        }
    }
    return ret;
});

onMounted(() => {
	connectWs(window.rid);
})


function onClickMonitor() {
    isShowOption.value = true;
}

function onChangeSwitch(list) {
    for (const key in options.value.order) {
        let index = list.indexOf(key);
        options.value.order[key] = index + 1;
    }
}

</script>

<style lang="scss" scoped>
.monitor {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: v-bind(directionStyle);
    font-size: v-bind(fontSizeStyle);
}
</style>