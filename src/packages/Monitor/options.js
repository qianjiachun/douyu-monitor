export const defaultOptions = {
    // 日间day 夜间night模式
    mode: "day",
    // 纵向column 横向row
    direction: "column",
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
    // 锁屏
    lock: false, 
    // 字号
    fontSize: 14,
    // 弹幕设置
    danmaku: {
        show: ["level", "avatar", "fans", "noble", "roomAdmin", "diamond"],
        ban: {
            level: 0,
            keywords: "",
            nicknames: "",
        }
    },
    // 入场设置
    enter: {
        show: ["level", "avatar", "noble"],
        keywords: "",
    },
    // 礼物设置
    gift: {
        totalPrice: 100,
        ban: {
            price: 0,
        }
    }
}