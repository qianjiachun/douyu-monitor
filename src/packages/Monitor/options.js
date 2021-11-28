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