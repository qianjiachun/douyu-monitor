import type { Dispatch } from "react";
import { createContext } from "react";
import { formatObj } from "~/utils";

enum OPTIONS_ACTION {
    RESET = "reset", // 恢复默认设置
    SET = "set", // 设置options的值，用于初始化options
    SHOW_MODE = "showMode",
    MODE = "mode",
    SWITCH = "switch",
    DIRECTION = "direction",
    FONTSIZE = "fontSize",
    SIZE = "size",
    ALIGN = "align",
    THRESHOLD = "threshold",
    TRANSPARENT = "transparent",
    ANIMATION = "animation",
    DANMAKU_SHOW = "danmaku_show",
    DANMAKU_KEYNICKNAMES = "danmaku_keyNicknames",
    DANMAKU_FANSKEYWORDS = "danmaku_fansKeywords",
    DANMAKU_BAN_LEVEL = "danmaku_ban_level",
    DANMAKU_BAN_KEYWORDS = "danmaku_ban_keywords",
    DANMAKU_BAN_NICKNAMES = "danmaku_ban_nicknames",
    DANMAKU_BAN_ISFILTERREPEAT = "danmaku_ban_isFilterRepeat",
    DANMAKU_BAN_ISFILTEROBOT = "danmaku_ban_isFilterRobot",
    DANMAKU_BAN_FANSLEVEL = "danmaku_ban_fansLevel",
    ENTER_SHOW = "enter_show",
    ENTER_KEYWORDS = "enter_keywords",
    ENTER_BAN_LEVEL = "enter_ban_level",
    GIFT_TOTALPRICE = "gift_totalPrice",
    GIFT_BAN_PRICE = "gift_ban_price",
    GIFT_BAN_KEYWORDS = "gift_ban_keywords",
    GIFT_BAN_FANSLEVEL = "gift_ban_fansLevel",
    GIFT_FANSLEVEL = "gift_fansLevel",
    GIFT_SHOWEFFECT = "gift_showEffect",
    GIFT_AUDIO = "gift_audio",
    SHOW_STATUS = "show_status",
    SUPERCHAT_SHOW = "superchat_show",
    SUPERCHAT_KEYWORD = "superchat_keyword",
    SUPERCHAT_OPTIONS = "superchat_options",
    SUPERCHAT_SPEAK = "superchat_speak",
    SHOW_AUDIENCE = "show_audience"
}

interface IOptionsAction {
    type: OPTIONS_ACTION;
    payload?: any;
}

export interface IOptionContext {
    state: IOptions;
    dispatch: Dispatch<IOptionsAction>;
}

// 默认配置，遵循数据驱动视图
const defaultOptions: IOptions = {
    showMode: "default",
    mode: "day",
    switch: ["enter", "gift", "danmaku", "superchat"],
    direction: "column",
    fontSize: 14,
    size: {
        enter: 15,
        gift: 25,
        danmaku: 30,
        superchat: 30,
    },
    align: "left",
    threshold: 200,
    transparent: false,
    animation: true,
    showStatus: true,
    showNobleNum: true,
    danmaku: {
        show: ["level", "avatar", "fans", "noble", "roomAdmin", "diamond", "vip", "color"],
        keyNicknames: [],
        fansKeywords: [],
        ban: {
            level: 0,
            keywords: [],
            nicknames: [],
            isFilterRepeat: false,
            isFilterRobot: true,
            fansLevel: 0
        }
    },
    enter: {
        show: ["level", "avatar", "noble"],
        keywords: [],
        ban: {
            level: 0,
        }
    },
    gift: {
        totalPrice: 100,
        fansLevel: 11,
        showEffect: true,
        audio: false,
        ban: {
            price: 0,
            keywords: [],
            fansLevel: 6,
        }
    },
    superchat: {
        keyword: "#sc",
        show: ["fans", "noble", "roomAdmin", "diamond", "time"],
        speak: false,
        options: [
            {
                minPrice: 1000,
                time: 200,
                bgColor: {
                    header: "rgb(208,0,0)",
                    body: "rgb(230,33,23)"
                }
            },
            {
                minPrice: 500,
                time: 100,
                bgColor: {
                    header: "rgb(194,24,91)",
                    body: "rgb(233,30,99)"
                }
            },
            {
                minPrice: 300,
                time: 30,
                bgColor: {
                    header: "rgb(230,81,0)",
                    body: "rgb(245,124,0)"
                }
            },
            {
                minPrice: 100,
                time: 20,
                bgColor: {
                    header: "rgb(0,191,165)",
                    body: "rgb(29,233,182)"
                }
            },
            {
                minPrice: 50,
                time: 10,
                bgColor: {
                    header: "rgb(21,101,192)",
                    body: "rgb(30,136,229)"
                }
            },
        ]
    }
};


const optionsReducer = (state: IOptions, action: IOptionsAction) => {
    let { type, payload } = action;
    switch (type) {
        case OPTIONS_ACTION.RESET:
            return defaultOptions;
        case OPTIONS_ACTION.SET:
            return formatObj(payload, defaultOptions);
        case OPTIONS_ACTION.SHOW_MODE:
            state.showMode = payload;
            break;
        case OPTIONS_ACTION.MODE:
            state.mode = payload;
            break;
        case OPTIONS_ACTION.SWITCH:
            state.switch = payload;
            break;
        case OPTIONS_ACTION.DIRECTION:
            state.direction = payload;
            break;
        case OPTIONS_ACTION.FONTSIZE:
            state.fontSize = Number(payload);
            break;
        case OPTIONS_ACTION.SIZE:
            state.size = {...state.size, ...payload};
            break;
        case OPTIONS_ACTION.ALIGN:
            state.align = payload;
            break;
        case OPTIONS_ACTION.ANIMATION:
            state.animation = payload;
            break;
        case OPTIONS_ACTION.TRANSPARENT:
            state.transparent = payload;
            break;
        case OPTIONS_ACTION.THRESHOLD:
            state.threshold = Number(payload);
            break;
        case OPTIONS_ACTION.DANMAKU_SHOW:
            state.danmaku.show = [...payload as IOptionsDanmakuShow[]];
            break;
        case OPTIONS_ACTION.DANMAKU_KEYNICKNAMES:
            state.danmaku.keyNicknames = String(payload).split(" ") || [];
            break;
        case OPTIONS_ACTION.DANMAKU_FANSKEYWORDS:
            state.danmaku.fansKeywords = payload !== "" ? String(payload).split(" ") || [] : [];
            break;
        case OPTIONS_ACTION.DANMAKU_BAN_LEVEL:
            state.danmaku.ban.level = Number(payload);
            break;
        case OPTIONS_ACTION.DANMAKU_BAN_FANSLEVEL:
            state.danmaku.ban.fansLevel = Number(payload);
            break;
        case OPTIONS_ACTION.DANMAKU_BAN_KEYWORDS:
            state.danmaku.ban.keywords = String(payload).split(" ") || [];
            break;
        case OPTIONS_ACTION.DANMAKU_BAN_NICKNAMES:
            state.danmaku.ban.nicknames = String(payload).split(" ") || [];
            break;
        case OPTIONS_ACTION.DANMAKU_BAN_ISFILTERREPEAT:
            state.danmaku.ban.isFilterRepeat = payload;
            break;
        case OPTIONS_ACTION.DANMAKU_BAN_ISFILTEROBOT:
            state.danmaku.ban.isFilterRobot = payload;
            break;
        case OPTIONS_ACTION.ENTER_SHOW:
            state.enter.show = [...payload as IOptionsEnterShow[]];
            break;
        case OPTIONS_ACTION.ENTER_KEYWORDS:
            state.enter.keywords = String(payload).split(" ") || [];
            break;
        case OPTIONS_ACTION.ENTER_BAN_LEVEL:
            state.enter.ban.level = Number(payload);
            break;
        case OPTIONS_ACTION.GIFT_TOTALPRICE:
            state.gift.totalPrice = payload;
            break;
        case OPTIONS_ACTION.GIFT_BAN_PRICE:
            state.gift.ban.price = payload;
            break;
        case OPTIONS_ACTION.GIFT_BAN_KEYWORDS:
            state.gift.ban.keywords = String(payload).split(" ") || [];
            break;
        case OPTIONS_ACTION.GIFT_BAN_FANSLEVEL:
            state.gift.ban.fansLevel = Number(payload);
            break;
        case OPTIONS_ACTION.GIFT_FANSLEVEL:
            state.gift.fansLevel = Number(payload);
            break;
        case OPTIONS_ACTION.GIFT_SHOWEFFECT:
            state.gift.showEffect = payload;
            break;
        case OPTIONS_ACTION.GIFT_AUDIO:
            state.gift.audio = payload;
            break;
        case OPTIONS_ACTION.SHOW_STATUS:
            state.showStatus = payload;
            break;
        case OPTIONS_ACTION.SUPERCHAT_KEYWORD:
            state.superchat.keyword = payload;
            break;
        case OPTIONS_ACTION.SUPERCHAT_OPTIONS:
            state.superchat.options = payload;
            break;
        case OPTIONS_ACTION.SUPERCHAT_SHOW:
            state.superchat.show = [...payload as IOptionsSuperchatShow[]];
            break;
        case OPTIONS_ACTION.SUPERCHAT_SPEAK:
            state.superchat.speak = payload;
            break;
        case OPTIONS_ACTION.SHOW_AUDIENCE:
            state.showNobleNum = payload;
            break;
        default:
            break;
    }
}

const OptionContext = createContext<IOptionContext>({
    state: defaultOptions,
    dispatch: () => {}
});
  
export {
    OPTIONS_ACTION,
    defaultOptions,
    optionsReducer,
    OptionContext
};