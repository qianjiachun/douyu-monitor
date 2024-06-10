import copy from "copy-to-clipboard";
import React from 'react';
import { Notify, Dialog, Button } from "react-vant";
import { OPTIONS_ACTION, IOptionsContext } from "~/hooks/options.reducer";
const LOCAL_NAME = "monitor_options";

export function redirectUrl(url: string): void {
  const HOSTS = [
    "https://www.douyuex.com",
    "http://www.douyuex.com",
    "https://www.douyuex.com/",
    "http://www.douyuex.com/",
    "https://douyuex.com/",
    "http://douyuex.com/",
    "http://new.douyuex.com/",
    "http://new.douyuex.com",
    "https://www.douyuex.com/introduction/",
    "https://www.douyuex.com/introduction",
    "https://www.douyuex.com/install/web.html",
    "https://www.douyuex.com/update/",
    "https://www.douyuex.com/update",
    // "http://localhost:3000",
    // "http://localhost:3000/",
  ];
  if (HOSTS.includes(url)) {
    location.href = "https://html.douyuex.com/";
  }
}

export function apiGetGiftPreInfo(rid: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(`https://gift.douyucdn.cn/japi/reward/giftv2/preInfo/pc/v2?rid=${rid}&userLevel=135&version=8.6.2.2`, { method: "GET" })
      .then(res => res.json())
      .then(ret => {
        if (!ret?.data || ret?.error !== 0) {
          resolve("");
        }
        let giftPreInfo = ret?.data?.giftPreInfo;
        let giftIdsExpand = ["22484", "22483"]; // 高等级专属礼物
        let giftId = 22484;
        for (let i = 0; i < 1000; i++) {
          giftId++;
          giftIdsExpand.push(String(giftId));
        }
        giftPreInfo = giftPreInfo.replace(/-{2}$/, "-" + giftIdsExpand.join("_") + "-");
        resolve(giftPreInfo);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getRoomGiftDataV2(preInfo: string): Promise<IGiftData> {
  return new Promise((resolve, reject) => {
    fetch(`https://gift.douyucdn.cn/japi/reward/giftv2/list/details/pc/v2?giftPreInfo=${preInfo}&userLevel=150`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((ret) => {
        let roomGiftData: IGiftData = {};
        if ("giftList" in ret.data) {
          for (let i = 0; i < ret.data.giftList.length; i++) {
            let item = ret.data.giftList[i];
            let svga = "";
            for (const key in item.effectInfo) {
              if (item.effectInfo[key]?.animation?.svga && item.effectInfo[key]?.animation?.svga !== "") {
                svga = item.effectInfo[key].animation.svga;
                break;
              }
            }
            roomGiftData[item.id] = {
              n: item.name,
              pic: "https://gfs-op.douyucdn.cn/dygift" + item.basicInfo.focusPic,
              pc: item.priceInfo.price,
              svga: "https://gfs-op.douyucdn.cn/dygift" + svga,
            };
          }
        }
        resolve(roomGiftData);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getRoomGiftData(rid: string): Promise<IGiftData> {
  return new Promise((resolve, reject) => {
    fetch("https://gift.douyucdn.cn/api/gift/v2/web/list?rid=" + rid, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((ret) => {
        let roomGiftData: IGiftData = {};
        if ("giftList" in ret.data) {
          for (let i = 0; i < ret.data.giftList.length; i++) {
            let item = ret.data.giftList[i];
            let svga = "";
            for (const key in item.effectInfo) {
              if (item.effectInfo[key]?.animation?.svga && item.effectInfo[key]?.animation?.svga !== "") {
                svga = item.effectInfo[key].animation.svga;
                break;
              }
            }
            roomGiftData[item.id] = {
              n: item.name,
              pic: "https://gfs-op.douyucdn.cn/dygift" + item.basicInfo.focusPic,
              pc: item.priceInfo.price,
              svga: "https://gfs-op.douyucdn.cn/dygift" + svga,
            };
          }
        }
        resolve(roomGiftData);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getBagGiftData(): Promise<IGiftData> {
  return new Promise((resolve, reject) => {
    fetch(
      "http://webconf.douyucdn.cn/resource/common/prop_gift_list/prop_gift_config.json",
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((res) => {
        return res.text();
      })
      .then((ret) => {
        let json: any = ret.substring(
          String("DYConfigCallback(").length,
          ret.length
        );
        json = json.substring(0, json.lastIndexOf(")"));
        json = JSON.parse(json);
        let obj: IGiftData = {};
        for (const key in json.data) {
          let item = json.data[key];
          obj[key] = {
            n: item.name,
            pic: item.himg,
            pc: item.pc,
            svga: item.effect_icon,
          };
        }
        resolve(obj);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getNowActGiftData(): Promise<IGiftData> {
  const dateStr = formatTime(new Date().getTime(), "yyyyMM");
  return new Promise((resolve, reject) => {
    fetch(
      `https://webconf.douyucdn.cn/resource/common/activity/actqzs${dateStr}_w.json`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((res) => {
        return res.text();
      })
      .then((ret) => {
        let json: any = ret.substring(
          String("DYConfigCallback(").length,
          ret.length
        );
        json = json.substring(0, json.lastIndexOf(")"));
        try {
          json = JSON.parse(json);
          let obj: IGiftData = {};
          for (const item of json.data.exchangeList) {
            const awardInfo = item.awardInfo;
            if (!awardInfo || awardInfo.awardType == 96 || awardInfo.awardType == 103) continue;
            obj[awardInfo.cardId] = {
              n: awardInfo.name,
              pic: awardInfo.pic,
              pc: 1,
              svga: "",
            };
          }
          resolve(obj);
        } catch (err) {
          reject(err);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getRealRid(rid: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(
      "https://wxapp.douyucdn.cn/Live/Room/info/" + rid,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((ret) => {
        resolve(ret.data.room_id);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getRandom(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min) + min);
}

export function getStrMiddle(str: string, before: string, after: string): string {
	let m = str.match(new RegExp(before + '(.*?)' + after));
	return m ? m[1] : "";
}

export function getFlexStyle (options: IOptions, flag: IOptionsSwitch) {
	return {
		flex: options.switch[options.switch.length - 1] === flag ? "1" : `0 0 ${options.size[flag]}%`,
		order: options.switch.indexOf(flag) * 2 + 1
	}
}

export function isArrayInText(arr: string[], text: string) {
  if (text !== "") {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== "" && text.indexOf(arr[i]) !== -1) {
          return true;
      }
    }
  }
  return false;
}

export function saveLocalOptions(options: IOptions) {
	localStorage.setItem(LOCAL_NAME, JSON.stringify(options));
}

export function getLocalOptions(): any {
	return JSON.parse(localStorage.getItem(LOCAL_NAME) || "{}");
}

export function formatObj(obj: any, objTemplate: any) {
	let ret: any = {};
	// 将obj格式化成objTemplate的属性格式，而obj的值不变，缺少的属性会增加上去
	for (const key in objTemplate) {
		if (key in obj) {
			if (Object.prototype.toString.call(objTemplate[key]) === "[object Object]") {
				let childRet = formatObj(obj[key], objTemplate[key]);
				ret[key] = childRet;
			} else {
				ret[key] = obj[key];
			}
		} else {
			ret[key] = objTemplate[key];
		}
	}
	return ret;
}

// format timestamp
export function formatTime(timestamp: number | string, format: string = "yyyy-MM-dd hh:mm:ss") {
  let date = new Date(Number(timestamp));
  let o: any = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    "S": date.getMilliseconds()
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}

export function getSuperchatOption(options: ISuperchatOption[], price: number): ISuperchatOption | null {
  // 请确保options里的minPrice是从大到小排列
  let ret: ISuperchatOption | null = null;
  if (price >= 0) {
    for (let i = 0; i < options.length; i++) {
      const item = options[i];
      if (price >= item.minPrice) {
        ret = item;
        break;
      }
    }
    if (!ret) ret = options[options.length - 1];
  } else {
    let index = Math.abs(price) - 1;
    if (index < options.length) {
      return [...options].reverse()[index];
    }
  }
  return ret;
}

export function deepCopy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function speakText(text: string, rate = 1) {
  const speech = new SpeechSynthesisUtterance()
  // 设置播放内容
  speech.text = text
  // 设置话语的音调(0-2 默认1，值越大越尖锐,越低越低沉)
  speech.pitch = 0.8 
  // 设置说话的速度(0.1-10 默认1，值越大语速越快,越小语速越慢)
  speech.rate = rate 
  // 设置说话的音量
  speech.volume = 10 
  // 设置播放语言
  speech.lang = 'zh-CN' 
  // 播放结束后调用
  speech.onend = (event)=>{
    
  }
  // 加入播放队列
  window.speechSynthesis.speak(speech)
}

export function clickTextEvent(optionsContext: IOptionsContext, event: any, text: string, type: string) {
  event.stopPropagation && event.stopPropagation();
  event.preventDefault && event.preventDefault();
  const { state, dispatch } = optionsContext;

  const banText = (type === "nn" ? "屏蔽昵称" : type === "txt" ? "屏蔽关键词" : "");

  // 创建footer按钮组控件
  const footerContent = React.createElement("div", { className: "clickText-button", style: { width: "100%" } },
    React.createElement(Button.Group, { block: true, round: false, style: { width: "100%" } },

      React.createElement(Button, {
        onClick: () => {
          copyTextEvent(event, text);
          closeDialog();
        }
      }, "复制文本"),

      React.createElement(Button, {
        onClick: () => {
          if (type == "nn") {
            dispatch({ type: OPTIONS_ACTION.DANMAKU_BAN_NICKNAMES, payload: `${state.danmaku.ban.nicknames.join(" ")} ${text}` });
          }
          if (type == "txt") {
            dispatch({ type: OPTIONS_ACTION.DANMAKU_BAN_KEYWORDS, payload: `${state.danmaku.ban.keywords.join(" ")} ${text}` });
          }
          Notify.show({ type: "success", message: `添加${banText}成功`, duration: 2000 });
          closeDialog();
        }
      }, banText),

      type == "nn" && React.createElement(Button, {
        onClick: () => {
          dispatch({ type: OPTIONS_ACTION.DANMAKU_KEYNICKNAMES, payload: `${state.danmaku.keyNicknames.join(" ")} ${text}` });
          Notify.show({ type: "success", message: "添加高亮昵称成功", duration: 2000 });
          closeDialog();
        }
      }, "高亮昵称")

    )
  );

  Dialog.confirm({
    message: text,
    closeOnClickOverlay: true,
    footer: footerContent
  }).then(() => { }).catch(() => { });

  const closeDialog = () => {
    const _dialog = document.querySelector(".rv-overlay") as HTMLElement;
    _dialog.dispatchEvent(new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
    }));
  }
}

export function clickGiftEvent(optionsContext: IOptionsContext, event: any, name: string) {
  event.stopPropagation && event.stopPropagation();
  event.preventDefault && event.preventDefault();
  const { state, dispatch } = optionsContext;
  
  Dialog.confirm({
    title: "是否屏蔽该礼物",
    message: name,
    closeOnClickOverlay: true,
    onCancel: () => { },
    onConfirm: () => {
      dispatch({ type: OPTIONS_ACTION.GIFT_BAN_KEYWORDS, payload: `${state.gift.ban.keywords.join(" ")} ${name}` });
      Notify.show({ type: "success", message: "添加屏蔽礼物成功", duration: 2000 });
    },
  })
}


export function copyTextEvent(event: any, text: string) {
  event.stopPropagation && event.stopPropagation();
  event.preventDefault && event.preventDefault();
  copy(text);
  Notify.show({type: "success", message: "复制成功", duration: 2000});
}

export function decompressDouyuExImageUrl(base36Str: string) {
  const base36Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let decimal: any = 0n;
  let multiplier: any = 1n;

  for (let i = base36Str.length - 1; i >= 0; i--) {
    const char = base36Str[i].toUpperCase();
    const charIndex = base36Chars.indexOf(char);
    if (charIndex === -1) return "";
    decimal += BigInt(charIndex) * multiplier;
    multiplier *= 36n;
  }

  return decimal.toString();
}

export function isValidImageFile(filename: string) {
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico", ".tiff", ".tif"];
  const ext = filename.substring(filename.lastIndexOf(".")).toLowerCase();
  return validExtensions.includes(ext);
}