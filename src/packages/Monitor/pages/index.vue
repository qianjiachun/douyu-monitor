<template>
    <div class="monitor" @click.prevent="onClickMonitor">
        <Gift v-show="options.switch.includes('gift')" :maxOrder="maxOrder" :options="options"></Gift>
        <Enter v-show="options.switch.includes('enter')" :maxOrder="maxOrder" :options="options"></Enter>
        <Danmaku v-show="options.switch.includes('danmaku')" :maxOrder="maxOrder" :options="options"></Danmaku>
    </div>
    <Popup v-model:show="isShowOption" position="bottom" :style="{ height: '40%' }">
        <Tabs v-model:active="activeTab">
            <Tab title="通用">
                <Field label="布局">
                    <template #input>
                        <CheckboxGroup style="display: flex;justify-content: space-between;width: 100%;" v-model="options.switch" direction="horizontal" @change="onChangeSwitch">
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
            </Tab>
            <Tab title="弹幕">
                <Field label="占比">
                    <template #input>
                        <Slider v-model="options.size.danmaku" :disabled="maxOrder===options.order.danmaku"/>
                    </template>
                </Field>
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

import { useDirectionStyle } from "../hooks/useDirectionStyle.js"
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
});

let { directionStyle } = useDirectionStyle(options);
let { connectWs } = useWebsocket();

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
}
</style>