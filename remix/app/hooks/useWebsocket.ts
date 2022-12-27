import { getStrMiddle, getSuperchatOption, isArrayInText, speakText } from "~/utils";
import { Ex_WebSocket_UnLogin } from "~/utils/libs/websocket";
import { STT } from "~/utils/libs/stt";
import type { MutableRefObject} from "react";
import { useEffect } from "react";
import { useState } from "react";
import { nobleData } from "~/resources/nobleData";

const MSG_TYPE: any = {
    danmaku: ["chatmsg"],
    gift: ["dgb", "odfbc", "rndfbc", "anbc", "rnewbc", "blab", "fansupgradebroadcast"],
    enter: ["uenter"],
    data: ["noble_num_info"],
    fansPaper: ["fansPaper"],
    professgiftsrc: ["professgiftsrc"]
};
export enum GIFT_TYPE {
    GIFT = "gift", // 普通礼物
    DIAMOND = "diamond", // 钻粉
    NOBLE = "noble", // 贵族
    FANS = "fans", // 粉丝牌
}

interface IDanmakuPerson {
    num: number; // 总数
    uid: any; //
}

interface ISuperchatMapItem {
    count: number;
    price: number;
}

let superchatMap: Record<string, ISuperchatMapItem> = {};
const stt = new STT();

const selectMsgType = (msgType: string): IMsgType => {
    if (msgType === "") return "";
    for (const key in MSG_TYPE) {
        if (MSG_TYPE[key].includes(msgType)) {
            return key as IMsgType;
        }
    }
    return "";
}

const useWebsocket = (options: MutableRefObject<IOptions>, allGiftData: IGiftData) => {
    let ws: Ex_WebSocket_UnLogin | null = null;
    const [danmakuList, setDanmakuList] = useState<IDanmaku[]>([]);
    const [giftList, setGiftList] = useState<IGift[]>([]);
    const [enterList, setEnterList] = useState<IEnter[]>([]);
    const [nobleNum, setNobleNum] = useState<number>(0);
    const [danmakuNum, setDanmakuNum] = useState<number>(0);
    const [danmakuPerson, setDanmakuPerson] = useState<IDanmakuPerson>({num: 0, uid: {}});
    const [giftStatus, setGiftStatus] = useState<IGiftStatistics>({});
    // const [panelDataList, setPanelDataList] = useState<IPanelData[]>([]);
    const [superchatList, setSuperchatList] = useState<ISuperchat[]>([]);
    const [superchatPanelList, setSuperchatPanelList] = useState<ISuperchat[]>([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setSuperchatPanelList(list => {
                return list.filter(item => {
                    let now = new Date().getTime();
                    let superchatOption = getSuperchatOption(options.current.superchat.options, item.price);
                    if (superchatOption) {
                        return (item.time + superchatOption.time * 1000) >= now
                    } else {
                        return false;
                    }
                })
            })
        }, 1000);
        return () => {
            clearInterval(timer);
        }
    }, [options]);

    const connectWs = (rid: string): void => {
        if (rid === "") return;
        ws = new Ex_WebSocket_UnLogin(rid, (msg: string) => {
            msgHandler(msg);
        }, () => {
            closeWs();
            connectWs(rid);
        });
    }
    const closeWs = (): void => {
        ws?.close();
        ws = null;
    }

    // const addPanelData = useCallback((type: IMsgType, data: IGift | IDanmaku | IEnter | ISuperchat) => {
    //     setPanelDataList(list => {
    //         if (list.length > 0 && type === "danmaku") {
    //             // 过滤重复弹幕
    //             if (list[list.length - 1].type === "danmaku" && options.current.danmaku.ban.isFilterRepeat && (list[list.length - 1].data as IDanmaku).txt === (data as IDanmaku).txt) {
    //                 return list;
    //             }
    //         }
    //         const obj = {type, data};
    //         if (list.length >= options.current.threshold) {
    //             return [...list.splice(1), obj];
    //         } else {
    //             return [...list, obj];
    //         }
    //     });
    // }, [options]);

    const msgHandler = (msg: string) => {
        let typeStr = getStrMiddle(msg, "type@=", "/");
        let msgType = selectMsgType(typeStr);
        if (msgType === "") return;
        //  获得socekt序列化数据
        let data = stt.deserialize(msg);
        switch (msgType) {
            case "danmaku":
                handleDanmaku(data)
                break;
            case "gift":
                handleGift(data)
                break;
            case "enter":
                handleEnter(data)
                break;
            case "data":
                handleData(data);
                break;
            case "fansPaper":
                handleFansPaper(data);
            case "professgiftsrc":
                handleProfessGiftSrc(data);
            default:
                break;
        }
    }

    const handleDanmaku = (data: any) => {
        if (options.current.showStatus) {
            if (!danmakuPerson.uid?.dmuid) {
                setDanmakuPerson(prev => {
                    return !prev.uid[data.uid] ? {
                        num: prev.num + 1,
                        uid: {
                            ...prev.uid,
                            [data.uid]: true,
                        }
                    } : prev
                })
            }
            setDanmakuNum(prev => prev + 1);
        }
        if (!isDanmakuValid(data)) return;
        let obj: IDanmaku = {
            nn: data.nn,
            avatar: data.ic,
            lv: data.level,
            txt: data.txt,
            color: data.col,
            fansName: data.bnn,
            fansLv: data.bl,
            isDiamond: !!data.diaf,
            nobleLv: data.nl,
            isNoble: !!data.nc,
            isRoomAdmin: data.rg == "4",
            isSuper: data.pg == "5",
            isVip: data.ail == "453/" || data.ail == "454/",
            key: new Date().getTime() + Math.random(),
        };
        // 过滤机器人弹幕
        if (options.current.danmaku.ban.isFilterRobot && !data.dms) return;
        // #region superchat
        const superchatData = superchatMap[data.uid];
        if (superchatData && superchatData.count >= 1 && obj.txt.includes(options.current.superchat.keyword)) {
            delete superchatMap[data.uid];
            const scObj: ISuperchat = {
                ...obj,
                txt: obj.txt.replace(new RegExp(options.current.superchat.keyword, "g"), "").trim(),
                price: superchatData.price,
                time: new Date().getTime()
            };
            setSuperchatList(list => {
                if (options.current.superchat.speak) {
                    speakText(`${scObj.nn}说：${scObj.txt}`);
                }
                if (list.length >= options.current.threshold) {
                    return [...list.splice(1), scObj];
                } else {
                    return [...list, scObj];
                }
            });
            setSuperchatPanelList(list => {
                if (list.length >= options.current.threshold) {
                    return [...list.splice(1), scObj];
                } else {
                    return [...list, scObj];
                }
            });
        }
        //#endregion
        setDanmakuList(list => {
            // 过滤重复弹幕
            if (options.current.danmaku.ban.isFilterRepeat && list.length > 0 && list[list.length - 1].txt === data.txt) return list;
            if (list.length >= options.current.threshold) {
                return [...list.splice(1), obj];
            } else {
                return [...list, obj];
            }
        });
    }

    const handleFansPaper = (data: any) => {
        if (data.chatmsg.length === 0) return;
        let chatmsg = data.chatmsg[0];
        let textLevel = 0;
        for (let i = 1; i <= 5; i++) {
            if (data[`txt${i}`]) {
                textLevel = -i;
            }
        }
        if (textLevel === 0) {
            textLevel = -1;
        }
        let scObj: ISuperchat = {
            txt: chatmsg.txt,
            price: textLevel,
            time: new Date().getTime(),
            nn: chatmsg.nn,
            avatar: "",
            lv: chatmsg.level,
            color: "",
            fansName: chatmsg.bnn,
            fansLv: chatmsg.bl,
            isDiamond: false,
            nobleLv: "0",
            isNoble: !!chatmsg.nc,
            isRoomAdmin: false,
            isSuper: false,
            isVip: false,
            key: new Date().getTime() + Math.random(),
        };
        setSuperchatList(list => {
            if (options.current.superchat.speak) {
                speakText(`${scObj.nn}说：${scObj.txt}`);
            }
            if (list.length >= options.current.threshold) {
                return [...list.splice(1), scObj];
            } else {
                return [...list, scObj];
            }
        });
        setSuperchatPanelList(list => {
            if (list.length >= options.current.threshold) {
                return [...list.splice(1), scObj];
            } else {
                return [...list, scObj];
            }
        });
    }
    
    const handleProfessGiftSrc = (data: any) => {
        let textLevel = -3;
        let txt = "";
        if (data.txt1) {
            txt += data.txt1 + " ";
        }
        if (data.otherContent) {
            txt += data.otherContent;
        }
        let avatar = data.avatar.length >= 2 ? `${data.avatar[0]}//${data.avatar[1]}` : "";
        let scObj: ISuperchat = {
            txt: txt,
            price: textLevel,
            time: new Date().getTime(),
            nn: data.userName,
            avatar: avatar,
            lv: "",
            color: "",
            fansName: "",
            fansLv: "",
            isDiamond: false,
            nobleLv: "0",
            isNoble: false,
            isRoomAdmin: false,
            isSuper: false,
            isVip: false,
            key: new Date().getTime() + Math.random(),
        };
        setSuperchatList(list => {
            if (options.current.superchat.speak) {
                speakText(`${scObj.nn}说：${scObj.txt}`);
            }
            if (list.length >= options.current.threshold) {
                return [...list.splice(1), scObj];
            } else {
                return [...list, scObj];
            }
        });
        setSuperchatPanelList(list => {
            if (list.length >= options.current.threshold) {
                return [...list.splice(1), scObj];
            } else {
                return [...list, scObj];
            }
        });
    }

    const handleEnter = (data: any) => {
        if (!isEnterValid(data)) return;
        let obj: IEnter = {
            nn: data.nn,
            avatar: data.ic,
            lv: data.level,
            nobleLv: data.nl,
            key: new Date().getTime() + Math.random(),
        }
        setEnterList(list => {
            if (list.length >= options.current.threshold) {
                return [...list.splice(1), obj];
            } else {
                return [...list, obj];
            }
        });
    }

    const handleGift = (data: any) => {
        let obj: IGift = {
            type: GIFT_TYPE.GIFT,
            name: "",
            nn: data.nn,
            lv: data.level,
            nl: data.nl,
            bl: data.bl,
            gfid: data.gfid,
            gfcnt: data.gfcnt,
            hits: data.hits,
            key: new Date().getTime() + Math.random(),
        };
        let tmp: any = {};
        switch (data.type) {
            case "dgb":
                if (!isGiftValid(data)) return;
                tmp = {
                    type: GIFT_TYPE.GIFT,
                    name: allGiftData[data.gfid].n,
                };

                // #region superchat
                if (options.current.switch.includes("superchat")) {
                    const totalGiftPrice = Number(obj.gfcnt) * Number(allGiftData[data.gfid].pc) / 100;
                    const uid = data.uid;
                    const superchatMinPrice = options.current.superchat.options[options.current.superchat.options.length - 1]?.minPrice;
                    if (totalGiftPrice >= superchatMinPrice) {
                        superchatMap[uid] = {count: 1, price: totalGiftPrice};
                    }
                }
                // #endregion
                if (options.current.showStatus) {
                    setGiftStatus(prev => {
                        let key = allGiftData[data.gfid].n + "|" + obj.gfid;
                        if (key in prev) {
                            return {
                                ...prev,
                                [key]: {
                                    ...prev[key],
                                    count: prev[key].count + Number(obj.gfcnt),
                                }
                            }
                        } else {
                            return {
                                ...prev,
                                [key]: {
                                    name: allGiftData[data.gfid].n,
                                    count: Number(obj.gfcnt),
                                    gfid: data.gfid,
                                    price: Number(allGiftData[data.gfid].pc),
                                    img: allGiftData[data.gfid].pic,
                                }
                            }
                        }
                    });
                }
                break;
            case "odfbc":
                // 开通钻粉
                tmp = {
                    type: GIFT_TYPE.DIAMOND,
                    name: "开通钻粉",
                    nn: data.nick,
                    gfid: "0",
                    gfcnt: "0",
                    hits: "0",
                }
                break;
            case "rndfbc": 
                // 续费钻粉
                tmp = {
                    type: GIFT_TYPE.DIAMOND,
                    name: "续费钻粉",
                    nn: data.nick,
                    gfid: "0",
                    gfcnt: "0",
                    hits: "0",
                }
                break;
            case "anbc":
                // 开通贵族
                if (data.drid !== window.rid) return; // 不在本房间开通则丢弃
                tmp = {
                    type: GIFT_TYPE.NOBLE,
                    name: "开通" + nobleData.data[data.nl].name,
                    nn: data.unk,
                    nl: data.nl, // 贵族等级
                    gfid: "0",
                    gfcnt: "0",
                    hits: "0",
                }
                break;
            case "rnewbc":
                // 续费贵族
                if (data.drid !== window.rid) return; // 不在本房间开通则丢弃
                tmp = {
                    type: GIFT_TYPE.NOBLE,
                    name: "续费" + nobleData.data[data.nl].name,
                    nn: data.unk,
                    nl: data.nl, // 贵族等级
                    gfid: "0",
                    gfcnt: "0",
                    hits: "0",
                }
                break;
            case "blab":
                // 30级以下粉丝牌升级
                if (data.rid !== window.rid) return; // 不在本房间开通则丢弃
                if (!isFansLevelValid(data.bl)) return;
                tmp = {
                    type: GIFT_TYPE.FANS,
                    name: `粉丝牌升到${data.bl}级`,
                    gfid: "0",
                    gfcnt: "0",
                    hits: "0",
                }
                break;
            case "fansupgradebroadcast":
                // 30以上粉丝牌升级
                if (data.rid !== window.rid) return; // 不在本房间开通则丢弃
                if (!isFansLevelValid(data.otherContent)) return;
                tmp = {
                    type: GIFT_TYPE.FANS,
                    name: `粉丝牌升到${data.otherContent}级`,
                    nn: data.userName,
                    bl: data.otherContent,
                    gfid: "0",
                    gfcnt: "0",
                    hits: "0",
                }
                break;
            default:
                return;
        }
        obj = {...obj, ...tmp};
        setGiftList(list => {
            if (list.length >= options.current.threshold) {
                return [...list.splice(1), obj];
            } else {
                return [...list, obj];
            }
        });
    }

    const handleData = (data: any) => {
        if (data.rid !== window.rid) return;
        setNobleNum(num => {
            return Number(data.vn);
        });
    }

    const isDanmakuValid = (data: any): boolean => {
        // 判断屏蔽等级
        if (Number(data.level) <= options.current.danmaku.ban.level) return false;
        // 判断关键词
        if (isArrayInText(options.current.danmaku.ban.keywords, data.txt)) return false;
        // 判断关键昵称
        if (isArrayInText(options.current.danmaku.ban.nicknames, data.nn)) return false;
        return true;
    }

    const isEnterValid = (data: any): boolean => {
        // 判断屏蔽等级
        return Number(data.level) > Number(options.current.enter.ban.level);
    }

    const isGiftValid = (data: any): boolean => {
        let giftData = allGiftData[data.gfid];
        if (giftData) {
            // 屏蔽单价
            if (giftData.pc < Number(options.current.gift.ban.price) * 100) return false;
            // 屏蔽关键词
            if (isArrayInText(options.current.gift.ban.keywords, giftData.n)) return false;
        }
        return true;
    }

    const isFansLevelValid = (level: number) => {
        // 判断屏蔽粉丝牌升级等级
        return Number(options.current.gift.ban.fansLevel) <= level;
    }

    return {
        connectWs, closeWs, danmakuList, giftList, enterList, nobleNum, danmakuPerson, danmakuNum, giftStatus, superchatList, superchatPanelList
    }
}

export default useWebsocket;