<p align="center">
    <a href="https://github.com/qianjiachun/douyu-monitor">
        <img src="https://s4.ax1x.com/2021/12/23/TGQyAf.png" width="150" height="150"/>
    </a>
    <h3 align="center">Douyu-Monitor-Remix</h3>
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

> `Douyu-Monitor-Remix` 是基于 `Remix`+`React-TypeScript`+`React-Vant` 开发的 **SSR服务端渲染** 斗鱼弹幕助手，用于查看、展示房间内弹幕/礼物/入场信息等。在性能上，页面无论在任何情况都能**丝滑**展示与操作；在项目结构上，**底层与业务解耦**，**样式与业务解耦**，**具有完备的类型系统**，可以方便地定制各式各样的弹幕样式；在场景上，**支持所有设备**并且**显示/操作一致**，具有灵活和高扩展的特性。
## 斗鱼跨平台弹幕助手

### 预览（Demo）
[http://new.douyuex.com/288016](http://new.douyuex.com/288016)

### 特性
1. Remix-SSR
2. 全响应式
3. lazy-load
4. content-visibility
5. brotli
6. 代码健壮，类型完善

### 使用方法
1. 打开任意斗鱼直播间
2. 将地址栏中的douyu改成douyuex即可
- 例如 www.douyu.com/288016 改成 www.douyuex.com/288016

### 声明
1. 项目引用请注明出处
2. 作者: 小淳 Email: 189964430@qq.com

## 运行项目
1. git clone
2. `npm install`
3. `npm run dev`

## 发布
1. `npm run build`
2. 将整个项目或将`public`和`build`文件夹放到**具有node环境**的服务器上
3. `npm install`
4. 在`packages.json`中，修改`export PORT=自定义端口`
5. `npm run start`
6. nginx设置反向代理，将域名访问代理至指定port
```
location / {
    proxy_pass http://localhost:7001;
}
```

## 如何修改消息的样式（提交PR）
> 项目拥有健壮的代码与完善的类型系统，遵循类型编写即可
项目提供了基础消息样式（斗鱼原版），如果想要定制比较好看的（例如气泡）的弹幕消息，参考如下：  

  
在每个模块的templates下新建一个文件(.tsx)，然后接受指定的props即可进行样式的编写  
每一个文件代表着每一行所呈现的样式  
下面分别对每个模块参数详细说明：
### options（设置）
```js
interface IOptions {
    mode: IMode; // 日间模式还是夜间模式。值：day/night
    switch: string[]; // 每个模块开关，同时指定了顺序。值：["enter"; "gift"; "danmaku"]
    direction: "column" | "row"; // 纵向还是横向排列。值：row/column
    fontSize: number; // 字号大小
    size: Size; // 每个模块的占比%
    align: "left" | "right"; // 设置左右对齐。值：left/right
    animation: boolean; // 是否开启动画
    threshold: number; // 数据上限，超过上限的数据会被删除
    transparent: boolean; // 是否背景透明
    danmaku: IOptionsDanmaku; // 弹幕设置
    gift: IOptionsGift;
    enter: IOptionsEnter; // 入场设置
}
```
### 弹幕样式
#### 路径
`app\components\Danmaku\templates\Default\Default.tsx`

#### props说明
```
data: 每条弹幕数据，格式如下
interface IDanmaku {
    nn: string; // 昵称
    avatar: string; // 头像地址 https://apic.douyucdn.cn/upload/ + avatar + _small.jpg
    lv: string; // 等级
    txt: string; // 弹幕内容
    color: string; // 弹幕颜色 undefine就是普通弹幕 2蓝色 3绿色 6粉色 4橙色 5紫色 1红色
    fansName: string; // 粉丝牌名字
    fansLv: string; // 粉丝牌等级
    isDiamond: boolean; // 是否是钻粉
    nobleLv: string; // 贵族等级
    isNoble: boolean; // 贵族弹幕是否开启，1开
    isRoomAdmin: boolean; // 房管，data.rg为4则是房管
    isSuper: boolean; // 超管，data.pg为5则为超管
    isVip: boolean; // vip，如果是 453/则为vip  454/则为超级vip
    key: string | number; // 唯一标识
}
```

### 礼物样式
#### 路径
`app\components\Gift\templates\Default\Default.tsx`

#### props说明
```
data: 每条礼物数据，格式如下
interface IGift {
    type: "gift" | "diamond" | "noble" | "fans"; // 礼物类型
    name: string; // 礼物名称
    nn: string; // 昵称
    lv: string; // 等级
    nl: string; // 贵族等级
    bl: string; // 粉丝牌等级
    gfid: string; // 礼物ID
    gfcnt: string; // 礼物数量
    hits: string; // 连击
    key: string | number; // 唯一标识
}
------------------------------------------------------------------------
礼物信息
interface IGiftItem {
    n: string; // 礼物名称
    pic: string; // 礼物图片
    pc: number; // 礼物价格
}
```

### 入场样式
#### 路径
`app\components\Enter\templates\Default\Default.tsx`

#### props说明
```
data: 每条入场数据
interface IEnter {
    nn: string; // 昵称
    avatar: string; // 头像地址 https://apic.douyucdn.cn/upload/ + avatar + _small.jpg
    lv: string; // 等级
    nobleLv: string; // 贵族等级
    key: string | number; // 唯一标识
}
```
