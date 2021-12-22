<p align="center">
    <img src="./icon.png" width="150">
    <h3 align="center">Douyu-Monitor</h3>
    <br>
    <p align="center">
        <a href="https://github.com/qianjiachun/douyu-monitor"><img src="https://img.shields.io/github/languages/code-size/qianjiachun/douyu-monitor?color=blueviolet"></a>
        <a href="https://github.com/qianjiachun/douyu-monitor"><img src="https://img.shields.io/github/stars/qianjiachun/douyu-monitor?color=green"></a>
        <a href="https://github.com/qianjiachun/douyu-monitor"><img src="https://img.shields.io/github/commit-activity/m/qianjiachun/douyu-monitor?color=9cf"></a>
        <a href="https://github.com/qianjiachun/douyu-monitor"><img src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
    </p>
    <p align="center">
       斗鱼跨平台弹幕助手<br>
    </p>
</p>

> `Douyu-Monitor` 是基于 `Vite2.x`+`Vue3.2.x`+`VantUI` 开发的**纯前端**斗鱼弹幕助手，用于查看、展示房间内弹幕/礼物/入场信息等。在性能上，页面无论在任何情况都能**丝滑**展示与操作；在项目结构上，**底层与业务解耦**，**样式与业务解耦**，可以方便地定制各式各样的弹幕样式；在场景上，**支持所有设备**并且**显示/操作一致**，具有灵活和高扩展的特性。
## 斗鱼跨平台弹幕助手

### 预览（Demo）
[https://www.douyuex.com/288016](https://www.douyuex.com/288016)

### 特性
1. 纯前端
2. 全响应式
3. vue3 tree shaking
4. vite编译优化
5. lazy-load
6. content-visibility

### 使用方法
1. 打开任意斗鱼直播间
2. 将地址栏中的douyu改成douyuex即可
- 例如 www.douyu.com/288016 改成 www.douyuex.com/288016

### 注意
1. 房间号必须是真实房间号而不能是靓号


### 声明
1. 项目引用请注明出处
2. 作者: 小淳 Email: 189964430@qq.com


## 运行项目
1. git clone
2. `npm install`
3. `npm run dev`

## 发布
1. `npm build`
2. 在nginx配置中加入以下代码
```
location / {
    try_files $uri $uri/ /index.html;
}
```


## 如何修改消息的样式（提交PR）
项目提供了基础消息样式（斗鱼原版），如果想要定制比较好看的（例如气泡）的弹幕消息，参考如下：  

  
在每个模块的templates下新建一个文件(.vue)，然后接受指定的props即可进行样式的编写  
每一个文件代表着每一行所呈现的样式  
下面分别对每个模块参数详细说明：
### options（设置）
```js
export const defaultOptions = {
    // 日间day 夜间night模式
    mode: "day",
    // 纵向column 横向row
    direction: "column",
    // 左对齐left 右对齐right
    align: "left",
    // 每个模块的占比%
    size: {
        enter: 15,
        gift: 25,
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
    threshold: 100,
    // 字号
    fontSize: 14,
    // 背景透明
    transparent: false,
    // 开启动画
    animation: true,
    // 弹幕设置
    danmaku: {
        // 设置弹幕显示内容，如果在数组里就显示
        // level:等级  avatar:头像  fans:粉丝牌  noble:贵族  roomAdmin:房管  diamond:钻粉
        show: ["level", "avatar", "fans", "noble", "roomAdmin", "diamond"],
        // 屏蔽项
        ban: {
            level: 0, // 等级
            keywords: "", // 关键词
            nicknames: "", // 关键昵称
        }
    },
    // 入场设置
    enter: {
        // 设置入场显示内容，如果在数组里就显示
        // level:等级  avatar:头像   noble:贵族
        show: ["level", "avatar", "noble"],
        // 高亮关键昵称
        keywords: "",
    },
    // 礼物设置
    gift: {
        // 高亮价格
        totalPrice: 100,
        // 屏蔽项
        ban: {
            // 价格低于
            price: 0,
            // 礼物名称
            keywords: "",
        }
    }
}
```
### 弹幕样式
#### 路径
`src/packages/Monitor/components/Danmaku/templates/Default.vue`

#### props说明
```
data: 每条弹幕数据，格式如下
let obj = {
    nn: data.nn, // 昵称
    avatar: data.ic, // 头像地址 https://apic.douyucdn.cn/upload/ + avatar + _small.jpg
    lv: data.level, // 等级
    txt: data.txt, // 弹幕内容
    color: data.col, // 弹幕颜色 undefine就是普通弹幕 2蓝色 3绿色 6粉色 4橙色 5紫色 1红色
    fansName: data.bnn, // 粉丝牌名字
    fansLv: data.bl, // 粉丝牌等级
    diamond: data.diaf, // 是否是钻粉
    noble: data.nl, // 贵族等级
    nobleC: data.nc, // 贵族弹幕是否开启，1开
    roomAdmin: data.rg, // 房管，data.rg为4则是房管
    super: data.pg, // 超管，data.pg为5则为超管
    key: data.cid, // 时间戳
};

如果要控制是否显示头像、等级、粉丝牌等，可以在相应的标签中这么写（检查options中show里是否包含）
v-if="options.danmaku.show.includes('avatar')"
```

### 礼物样式
#### 路径
`src/packages/Monitor/components/Gift/templates/Default.vue`

#### props说明
```
data: 每条礼物数据，格式如下
普通礼物（dgb）：
let obj = {
    nn: data.nn, // 昵称
    lv: data.level, // 等级
    gfid: data.gfid, // 礼物id 获取名称：allGiftData[item.gfid].n
    gfcnt: data.gfcnt, // 礼物数量
    hits: data.hits, // 连击
    key: new Date().getTime() + Math.random(),
}
钻粉（会比普通礼物多一个type属性）：
let obj = {
    type: "开通钻粉", // 或者续费钻粉
    nn: data.nick,
    lv: data.level,
    gfid: "0",
    gfcnt: "1",
    hits: "1",
    key: new Date().getTime() + Math.random(),
}

------------------------------------------------------------------------

giftData（礼物信息）：{
    n: item.name, // 礼物名称
    pic: item.basicInfo.focusPic, // 礼物图片地址: allGiftData.prefix + allGiftData[id].pic
    pc: item.priceInfo.price, // 礼物价格（记得÷100）
}
```

### 入场样式
#### 路径
`src/packages/Monitor/components/Enter/templates/Default.vue`

#### props说明
```
data: 每条入场数据
let obj = {
    nn: data.nn, // 昵称
    avatar: data.ic, // 头像地址 https://apic.douyucdn.cn/upload/ + avatar + _small.jpg
    lv: data.level, // 等级
    noble: data.nl, // 贵族等级
    key: new Date().getTime() + Math.random(),
}

如果要控制是否显示头像、等级、粉丝牌等，可以在相应的标签中这么写（检查options中show里是否包含）
v-if="options.enter.show.includes('avatar')"
```
