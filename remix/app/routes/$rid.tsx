import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { deepCopy, getBagGiftData, getLocalOptions, getRealRid, getRoomGiftData, getSuperchatOption, saveLocalOptions } from "~/utils";
import "@vant/touch-emulator";
// import styleVantBase from "react-vant/es/styles/base.css";
import stylesVant from "react-vant/lib/index.css";
import stylesGlobal from "~/styles/index.css";
import stylesFansLevel from "~/resources/fansLevel.css";
import stylesRoomAdmin from "~/resources/roomAdmin.css";
import stylesUserLevel from "~/resources/userLevel.css";
import stylesMonitor from "~/styles/monitor.css";

import { useEffect, useRef, useState } from "react";
import useWebsocket from "~/hooks/useWebsocket";
import Danmaku from "~/components/Danmaku/index";

import { Cell, Checkbox, Collapse, Dialog, Field, Image, Popup, Radio, Slider, Switch, Tabs, Toast } from "react-vant";
import { useImmerReducer } from "use-immer";
import { defaultOptions, optionsReducer, OPTIONS_ACTION } from "~/hooks/options.reducer";
import Enter from "~/components/Enter";
import Gift from "~/components/Gift";
import SplitLine from "~/components/SplitLine";
import copy from "copy-to-clipboard";
import Superchat from "~/components/Superchat";
import SuperchatItem from "~/components/Superchat/templates/Default/Default";


export const meta: MetaFunction = () => ({
	charset: "utf-8",
	title: "DouyuEX弹幕助手",
	viewport: "width=device-width,initial-scale=1",
    description: "斗鱼弹幕助手，用于查看、展示房间内弹幕、礼物、入场信息",
    keywords: "douyu, douyuex, 斗鱼, 斗鱼插件, 斗鱼弹幕助手, 斗鱼OBS",
    author: "小淳"
});

export const links: LinksFunction = () => {
	return [
		{rel: "stylesheet", href: stylesVant},
		{rel: "stylesheet", href: stylesGlobal},
		{rel: "stylesheet", href: stylesMonitor},
		{rel: "stylesheet", href: stylesFansLevel},
		{rel: "stylesheet", href: stylesRoomAdmin},
		{rel: "stylesheet", href: stylesUserLevel},
	]
}

export const loader: LoaderFunction = async ({params, request}) => {
	const { rid } = params;
	const url = new URL(request.url);
	const exoptions = url.searchParams.get("exoptions");
	let allGift: IGiftData = {};
	let roomId = "";
	if (rid) {
		roomId = (await getRealRid(rid)) || rid;
		let ret: any = await Promise.allSettled([getRoomGiftData(roomId), getBagGiftData()]);
		allGift = {...ret[0].value, ...ret[1].value};
	}
	return {
		rid: roomId || rid,
		allGift,
		exoptions,
	}
}

interface ILoaderProps {
	rid: string;
	allGift: IGiftData;
	exoptions: any;
}

type ISuperchatSettingDialogDataType = "bgColor.header" | "bgColor.body" | "minPrice" | "time";
interface ISuperchatSettingDialogData {
    index: number;
    type: ISuperchatSettingDialogDataType;
    title: string;
    value: string;
}

const Index = () => {
	const { rid, allGift, exoptions } = useLoaderData<ILoaderProps>();
	const [options, dispatchOptions] = useImmerReducer(optionsReducer, defaultOptions);
	const optionsRef = useRef(options);
	const { connectWs, closeWs, danmakuList, giftList, enterList, nobleNum, danmakuPerson, danmakuNum, giftStatus, superchatList, superchatPanelList } = useWebsocket(optionsRef, allGift);
	const [isShowOptions, setIsShowOptions] = useState(false);
    const [isShowSuperchatSettingDialog, setIsShowSuperchatSettingDialog] = useState(false);
    const [superchatSettingDialogData, setSuperchatSettingDialogData] = useState<ISuperchatSettingDialogData>({
        type: "minPrice",
        title: "",
        value: "",
        index: 0,
    });

    let effectTimer: NodeJS.Timeout;

    // 加载动画
    const loadEffect = (svga: string, stayTime: number) => {
        clearTimeout(effectTimer);
        if (!window.SVGA) return;
        let player = new window.SVGA.Player("#effect");
        let parser = new window.SVGA.Parser("#effect");
        parser.load(svga, (videoItem: any) => {
            player.setVideoItem(videoItem);
            player.startAnimation();
            effectTimer = setTimeout(() => {
                player.stopAnimation();
                player.clear();
            }, stayTime * 1000);
        });
    }

	useEffect(() => {
		logInfo();
		initOptions();
		window.rid = rid;
		connectWs(rid);
		return () => {
			closeWs();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		window.document.documentElement.setAttribute("data-theme", options.mode);
	}, [options.mode]);

	useEffect(() => {
		document.documentElement.style.setProperty('--avatarSize', String(options.fontSize * 2) + "px");
	}, [options.fontSize]);

    useEffect(() => {
		document.documentElement.style.setProperty('--scAvatarSize', String(options.fontSize * 3 - 2) + "px");
	}, [options.fontSize]);

	useEffect(() => {
		document.documentElement.style.setProperty('--justifyContent', options.align === "right" ? "flex-end" : "flex-start");
		document.documentElement.style.setProperty('--textAlign', options.align);
	}, [options.align]);

	useEffect(() => {
		optionsRef.current = options;
		saveLocalOptions(options);
	}, [options]);

    useEffect(() => {
        if (!options.gift.showEffect || options.showMode === "superchat") return;
        let giftMsgInfo = giftList[giftList.length - 1];
        if (!giftMsgInfo || giftMsgInfo.type !== "gift") return;
        let svga = allGift[giftMsgInfo.gfid]?.svga;
        if (!svga || svga === "") return;
        let giftInfo = allGift[giftMsgInfo.gfid];
        let giftPrice = Number(giftMsgInfo.gfcnt) * giftInfo.pc / 100;
        // 如果价格大于50元则显示特效
        if (giftPrice < 50) return;
        let stayTime = 0;
        if (giftPrice < 100) {
            stayTime = 7;
        } else if (giftPrice < 300) {
            stayTime = 10;
        } else if (giftPrice < 500) {
            stayTime = 15;
        } else if (giftPrice < 1000) {
            stayTime = 20;
        } else if (giftPrice < 2000) {
            stayTime = 30;
        } else {
            stayTime = 30;
        }
        loadEffect(svga, stayTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [giftList])

	const onClickRestOptions = () => {
		Dialog.confirm({
			title: '提示',
			message: '确认恢复默认设置？',
		})
		.then(() => {
			dispatchOptions({type: OPTIONS_ACTION.RESET})
		}).catch(() => {});
	}

	const initOptions = () => {
		// 这里用来恢复本地的options数据或者从url中解析出options，并加载
		let tmpOptions = {};
		if (exoptions) {
			try {
				tmpOptions = JSON.parse(decodeURIComponent(exoptions));
			} catch (error) {
				tmpOptions = {};
			}
		} else {
			tmpOptions = getLocalOptions();
		}
		if (Object.keys(tmpOptions).length === 0) return;
		dispatchOptions({type: OPTIONS_ACTION.SET, payload: tmpOptions});
	}

	const onClickShare = () => {
		let url = location.href;
		if (url.includes("?")) {
			url += "&exoptions=";
		} else {
			url += "?exoptions=";
		}
		url += encodeURIComponent(JSON.stringify(options));
		Dialog.confirm({
			title: '复制分享链接',
			message: '链接保存了当前设置，可粘贴至斗鱼直播伴侣浏览器源中，使设置与网页一致',
		})
		.then(() => {
			copy(url);
		}).catch(() => {});
	}

    const onClickSuperchatSetting = (index: number, type: ISuperchatSettingDialogDataType, title: string, value: string) => {
        setSuperchatSettingDialogData({index, title, value, type});
        setIsShowSuperchatSettingDialog(true);
    }

    const onConfirmSuperchatSetting = () => {
        let newSuperchatOptions = deepCopy(options.superchat.options);
        switch (superchatSettingDialogData.type) {
            case "bgColor.body":
                newSuperchatOptions[superchatSettingDialogData.index].bgColor.body = superchatSettingDialogData.value;
                break;
            case "bgColor.header":
                newSuperchatOptions[superchatSettingDialogData.index].bgColor.header = superchatSettingDialogData.value;
                break;
            case "minPrice":
                newSuperchatOptions[superchatSettingDialogData.index].minPrice = Number(superchatSettingDialogData.value);
                break;
            case "time":
                newSuperchatOptions[superchatSettingDialogData.index].time = Number( superchatSettingDialogData.value);
                break;
            default:
                break;
        }
        newSuperchatOptions = newSuperchatOptions.sort((a, b) => b.minPrice - a.minPrice);
        dispatchOptions({type: OPTIONS_ACTION.SUPERCHAT_OPTIONS, payload: newSuperchatOptions});
        setIsShowSuperchatSettingDialog(false);
    }

	const logInfo = () => {
		console.log(`%c
	______                    _____)
	(, /    )                /
	/    / ___             )__   __/
	_/___ /_(_)(_(_(_/_(_(_/        /(__
(_/___ /        .-/     (_____)  /
				(_/

%cContact: 小淳 189964430@qq.com`,'color:rgb(10,119,181);font-size:20px;font-weight:bold;', "color:rgb(10,119,181);font-size:16px;")
		return;
	}

    return <>
        {
            options.showMode === "default" &&
            <div className="noblenum"style={{left: options.align === "left" ? "auto" : "8px", right: options.align === "right" ? "auto" : "8px"}}>
                <span>{nobleNum}</span>
            </div>
        }
        {
            options.showMode === "default" ? 
            <div className="monitor" style={{flexDirection: options.direction, fontSize: options.fontSize, ...(options.transparent ? {backgroundColor: "transparent"} : {})}} onClick={() => setIsShowOptions(true)}>
                <div style={{width: "100%", height: "100%", background: "transparent", position: "absolute", zIndex: 10, pointerEvents: "none"}} id="effect"></div>
                {options.switch.includes("enter") && <Enter options={options} enterList={enterList}></Enter>}
                {options.switch.length > 1 && <SplitLine order={2} transparent={options.transparent} direction={options.direction}></SplitLine>}
                {options.switch.includes("gift") && <Gift options={options} giftList={giftList} allGiftData={allGift}></Gift>}
                {options.switch.length > 2 && <SplitLine order={4} transparent={options.transparent} direction={options.direction}></SplitLine>}
                {options.switch.includes("danmaku") && <Danmaku options={options} danmakuList={danmakuList}></Danmaku>}
                {options.switch.length > 2 && <SplitLine order={6} transparent={options.transparent} direction={options.direction}></SplitLine>}
                {options.switch.includes("superchat") && <Superchat options={options} superchatList={superchatList}></Superchat>}
            </div>
            :
            <div style={{width: "100%", height: "100%"}} onClick={() => setIsShowOptions(true)}>
                {superchatPanelList.length > 0 &&
                <div className="superchat superchat-panel">
                    {superchatPanelList.sort((a, b) => b.price - a.price).map(item => {
                        return <SuperchatItem
                        key={item.key}
                        option={getSuperchatOption(options.superchat.options, item.price)}
                        data={item}
                        showNoble={options.superchat.show.includes("noble")}
                        showFans={options.superchat.show.includes("fans")}
                        showDiamond={options.superchat.show.includes("diamond")}
                        showRoomAdmin={options.superchat.show.includes("roomAdmin")}
                        showAnimation={options.animation} />
                    })}
                </div>
                }
            </div>
        }
        <Dialog
            visible={isShowSuperchatSettingDialog}
            title={`修改${superchatSettingDialogData.title}`}
            showCancelButton
            onConfirm={onConfirmSuperchatSetting}
            onCancel={() => setIsShowSuperchatSettingDialog(false)}
        >
            <Field value={String(superchatSettingDialogData.value)} label={superchatSettingDialogData.title} onChange={(v) => setSuperchatSettingDialogData(data => {
                return {
                    ...data,
                    value: String(v)
                }
            })} placeholder="请输入" />
        </Dialog>
        <Popup className="popup" visible={isShowOptions} position="bottom" style={{height: "60%"}} onClose={() => setIsShowOptions(false)}>
            <div className="popup-top">
                <div className="douyuex">
                    <a href="https://xiaochunchun.gitee.io/douyuex/" target="_blank" rel="noreferrer">
                        <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2978" width="24" height="24"><path d="M1006.1 412.7l-187.5-141c0-0.2 0.1-0.3 0.1-0.4V121.4c0-2.3-1.9-4.2-4.2-4.2h-92.4c-2.3 0-4.2 1.9-4.2 4.2V196L535.3 58.8c-7.3-5.5-16-8.4-25.1-8.4-9.2 0-17.9 2.9-25.2 8.5L16.7 412.5C7.8 419.2 2.1 429 0.5 440.1c-2.1 14.8 3.8 29.5 16.2 39.3 4.3 3.3 9.2 5.7 14.5 7 13 3.2 25.8 0.6 36-7.1L505 148.6c3.1-2.3 7.4-2.3 10.4 0l441.8 332c7.3 5.5 16 8.4 25.1 8.4 13.7 0 26.3-6.5 34.2-17.7 13.3-18.8 7.9-44.9-10.4-58.6z" p-id="2979" fill="#8a8a8a"></path><path d="M906.7 499.4l-193.2-140-196.7-142.5c-3.4-2.5-8.1-2.5-11.5 0L308.7 359.4l-193.2 140c-5.6 4.1-9 10.6-9 17.6v392.1c0 35.5 29 64.5 64.5 64.5h246.7V716.2c0-30 24.6-54.6 54.6-54.6h77.5c30 0 54.6 24.6 54.6 54.6v257.4h246.7c35.5 0 64.5-29 64.5-64.5V517c0.1-6.9-3.3-13.5-8.9-17.6z" p-id="2980" fill="#8a8a8a"></path></svg>
                    </a>
                </div>
                <div className="github">
                    <a href="https://github.com/qianjiachun/douyu-monitor/tree/main/remix" target="_blank" rel="noreferrer"><svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7184" width="24" height="24"><path d="M511.957333 21.333333C241.024 21.333333 21.333333 240.981333 21.333333 512c0 216.832 140.544 400.725333 335.573334 465.664 24.490667 4.394667 32.256-10.069333 32.256-23.082667 0-11.690667 0.256-44.245333 0-85.205333-136.448 29.610667-164.736-64.64-164.736-64.64-22.314667-56.704-54.4-71.765333-54.4-71.765333-44.586667-30.464 3.285333-29.824 3.285333-29.824 49.194667 3.413333 75.178667 50.517333 75.178667 50.517333 43.776 75.008 114.816 53.333333 142.762666 40.789333 4.522667-31.658667 17.152-53.376 31.189334-65.536-108.970667-12.458667-223.488-54.485333-223.488-242.602666 0-53.546667 19.114667-97.322667 50.517333-131.669334-5.034667-12.330667-21.930667-62.293333 4.778667-129.834666 0 0 41.258667-13.184 134.912 50.346666a469.802667 469.802667 0 0 1 122.88-16.554666c41.642667 0.213333 83.626667 5.632 122.88 16.554666 93.653333-63.488 134.784-50.346667 134.784-50.346666 26.752 67.541333 9.898667 117.504 4.864 129.834666 31.402667 34.346667 50.474667 78.122667 50.474666 131.669334 0 188.586667-114.730667 230.016-224.042666 242.090666 17.578667 15.232 33.578667 44.672 33.578666 90.453334v135.850666c0 13.141333 7.936 27.605333 32.853334 22.869334C862.250667 912.597333 1002.666667 728.746667 1002.666667 512 1002.666667 240.981333 783.018667 21.333333 511.957333 21.333333z" p-id="7185" fill="#8a8a8a"></path></svg></a>
                </div>
                <div onClick={() => dispatchOptions({type: OPTIONS_ACTION.MODE, payload: options.mode === "night" ? "day" : "night"})}>
                    {options.mode === "night" ? 
                    <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17884" width="24" height="24"><path d="M487.204571 67.474286A444.525714 444.525714 0 1 1 92.16 715.373714a357.778286 357.778286 0 1 0 296.96-636.708571c32.182857-7.350857 65.097143-11.081143 98.084571-11.190857z" p-id="17885" fill="#8a8a8a"></path></svg>
                    :
                    <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20823" width="24" height="24"><path d="M438.857 73.143c0-40.396 32.466-73.143 73.143-73.143 40.396 0 73.143 32.466 73.143 73.143v73.143h-146.286v-73.143zM438.857 877.714h146.286v73.143c0 40.396-32.466 73.143-73.143 73.143-40.396 0-73.143-32.466-73.143-73.143v-73.143zM73.143 585.143c-40.396 0-73.143-32.466-73.143-73.143 0-40.396 32.466-73.143 73.143-73.143h73.143v146.286h-73.143zM877.714 585.143v-146.286h73.143c40.396 0 73.143 32.466 73.143 73.143 0 40.396-32.466 73.143-73.143 73.143h-73.143zM149.961 253.401c-28.564-28.564-28.763-74.676 0-103.44 28.564-28.564 74.676-28.763 103.44 0l51.719 51.719-103.44 103.44-51.722-51.719zM718.879 822.319l103.44-103.44 51.719 51.722c28.564 28.564 28.763 74.676 0 103.44-28.564 28.564-74.676 28.763-103.44 0l-51.719-51.719zM253.401 874.039c-28.564 28.564-74.676 28.763-103.44 0-28.564-28.564-28.763-74.676 0-103.44l51.719-51.719 103.44 103.44-51.719 51.722zM822.319 305.121l-103.44-103.44 51.722-51.719c28.564-28.564 74.676-28.763 103.44 0 28.564 28.564 28.763 74.676 0 103.44l-51.719 51.719zM512 804.571c161.583 0 292.571-130.989 292.571-292.571 0-161.583-130.989-292.571-292.571-292.571-161.583 0-292.571 130.989-292.571 292.571 0 161.583 130.989 292.571 292.571 292.571z" p-id="20824" fill="#8a8a8a"></path></svg>
                    }
                </div>
                <div onClick={onClickShare}>
                    <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2733" width="24" height="24"><path d="M380.36396 566.298587l300.553318 205.558677a149.295574 149.295574 0 1 1-38.731537 76.865893L338.262608 640.818406a149.295574 149.295574 0 1 1-13.180667-226.374746l318.938002-230.299087a149.295574 149.295574 0 1 1 43.082437 74.093261L375.501189 483.418215a149.039639 149.039639 0 0 1 4.905426 82.923028zM789.263209 213.406506a63.983817 63.983817 0 1 0 0-127.967635 63.983817 63.983817 0 0 0 0 127.967635z m0 725.149931a63.983817 63.983817 0 1 0 0-127.967635 63.983817 63.983817 0 0 0 0 127.967635z m-554.526418-341.247027a63.983817 63.983817 0 1 0 0-127.967634 63.983817 63.983817 0 0 0 0 127.967634z" fill="#8A8A8A" p-id="2734"></path></svg>
                </div>
                <div onClick={onClickRestOptions}>
                    <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14990" width="24" height="24"><path d="M890.092308 988.002462a37.257846 37.257846 0 0 1-25.67877-27.72677c-53.326769-236.937846-209.526154-305.467077-408.576-368.64l-55.847384 182.744616a37.415385 37.415385 0 0 1-67.741539 8.428307L65.851077 353.516308a37.257846 37.257846 0 0 1 15.281231-53.090462L549.021538 70.656a37.257846 37.257846 0 0 1 40.96 5.198769 37.651692 37.651692 0 0 1 11.500308 39.384616l-47.261538 154.702769c92.317538 34.264615 169.905231 87.985231 230.636307 159.901538 54.429538 64.275692 95.310769 142.966154 121.619693 233.787077 42.771692 147.692308 33.004308 277.897846 31.744 292.312616v0.157538a37.336615 37.336615 0 0 1-34.816 33.634462 40.329846 40.329846 0 0 1-13.39077-1.732923zM352.492308 673.476923l42.692923-139.657846a37.494154 37.494154 0 0 1 46.710154-24.733539c129.969231 39.778462 233.314462 78.769231 314.998153 140.288 35.052308 26.151385 65.851077 56.871385 91.766154 91.608616a733.026462 733.026462 0 0 0-14.493538-58.683077c-53.563077-182.114462-166.990769-300.819692-337.289846-352.886154a38.281846 38.281846 0 0 1-22.291693-18.432 36.312615 36.312615 0 0 1-2.599384-28.356923l32.610461-106.653538-353.28 173.292307L352.492308 673.476923z" fill="#8a8a8a" p-id="14991"></path></svg>
                </div>
                {/* // <div @click="onClickSaveData">
                // 	<svg t="1641663017225" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3820" width="24" height="24"><path d="M941.248 352L672 82.752A64 64 0 0 0 626.752 64H128a64 64 0 0 0-64 64v768a64 64 0 0 0 64 64h768a64 64 0 0 0 64-64V397.248A64 64 0 0 0 941.248 352zM256 128h48v160H256V128z m112 0H512v160h-144V128zM256 896v-192h512v192H256z m640 0h-64v-224a32 32 0 0 0-32-32H224a32 32 0 0 0-32 32v224H128V128h64v192a32 32 0 0 0 32 32h320a32 32 0 0 0 32-32V128h50.752L896 397.248V896z" p-id="3821" fill="#8a8a8a"></path></svg>
                // </div> */}
            </div>
            <Tabs>
                <Tabs.TabPane title="通用">
                    <Field label="模式">
                        <Radio.Group value={options.showMode} defaultValue="column" direction="horizontal" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.SHOW_MODE, payload: v})}>
                            <Radio name="default">默认</Radio>
                            <Radio name="superchat">SuperChat插件</Radio>
                            {/* <Radio name="panel">面板</Radio> */}
                        </Radio.Group>
                    </Field>
                    <Field label="布局">
                        <Checkbox.Group value={options.switch} direction="horizontal" onChange={(v) => {
                            if (v.includes("superchat") && !(v.includes("gift") && v.includes("danmaku"))) {
                                Toast.fail("开启sc需要同时开启礼物和弹幕");
                                return;
                            }
                            dispatchOptions({type: OPTIONS_ACTION.SWITCH, payload: v})
                        }}>
                            <Checkbox shape="square" name="enter">进场</Checkbox>
                            <Checkbox shape="square" name="gift">礼物</Checkbox>
                            <Checkbox shape="square" name="danmaku">弹幕</Checkbox>
                            <Checkbox shape="square" name="superchat">Superchat</Checkbox>
                        </Checkbox.Group>
                    </Field>
                    <Field label="方向">
                        <Radio.Group value={options.direction} defaultValue="column" direction="horizontal" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.DIRECTION, payload: v})}>
                            <Radio name="column">纵向</Radio>
                            <Radio name="row">横向</Radio>
                        </Radio.Group>
                        <Radio.Group value={options.align} defaultValue="column" direction="horizontal" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.ALIGN, payload: v})}>
                            <Radio name="left">左对齐</Radio>
                            <Radio name="right">右对齐</Radio>
                        </Radio.Group>
                    </Field>
                    <Field label="字号">
                        <Slider value={options.fontSize} min={12} max={30} onChange={(v: number) => dispatchOptions({type: OPTIONS_ACTION.FONTSIZE, payload: v})}/>
                    </Field>
                    <Field label="背景透明">
                        <Switch size={20} checked={options.transparent} onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.TRANSPARENT, payload: v})} />
                    </Field>
                    <Field label="动画">
                        <Switch size={20} checked={options.animation} onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.ANIMATION, payload: v})} />
                    </Field>
                    <Field value={String(options.threshold)} type="digit" label="数据上限" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.THRESHOLD, payload: Number(v)})} placeholder="当超过上限 旧数据会被删除" />
                </Tabs.TabPane>
                <Tabs.TabPane title="弹幕">
                    <Field label="占比">
                        <Slider disabled={options.switch[options.switch.length-1] === "danmaku"} value={options.size.danmaku} onChange={(v: number) => dispatchOptions({type: OPTIONS_ACTION.SIZE, payload: {danmaku: v}})}/>
                    </Field>
                    <Field label="显示">
                        <Checkbox.Group value={options.danmaku.show} direction="horizontal" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.DANMAKU_SHOW, payload: v})}>
                            <Checkbox name="level" shape="square">等级</Checkbox>
                            <Checkbox name="noble" shape="square">贵族</Checkbox>
                            <Checkbox name="fans" shape="square">粉丝牌</Checkbox>
                            <Checkbox name="avatar" shape="square">头像</Checkbox>
                            <Checkbox name="roomAdmin" shape="square">房管</Checkbox>
                            <Checkbox name="diamond" shape="square">钻粉</Checkbox>
                            <Checkbox name="color" shape="square">颜色</Checkbox>
                            <Checkbox name="vip" shape="square">VIP</Checkbox>
                            <Checkbox name="time" shape="square">时间</Checkbox>
                        </Checkbox.Group>
                    </Field>
                    <Field value={String(options.danmaku.ban.level)} type="digit" label="屏蔽等级≤" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.DANMAKU_BAN_LEVEL, payload: Number(v)})} placeholder="请输入屏蔽的等级" />
                    <Field value={options.danmaku.ban.keywords.join(" ")} label="屏蔽关键词" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.DANMAKU_BAN_KEYWORDS, payload: v})} placeholder="空格隔开 例如:弹幕1 弹幕2" />
                    <Field value={options.danmaku.ban.nicknames.join(" ")} label="屏蔽昵称" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.DANMAKU_BAN_NICKNAMES, payload: v})} placeholder="模糊匹配 空格隔开 例如:昵称1 昵称2" />
                    <Field value={options.danmaku.keyNicknames.join(" ")} label="高亮昵称" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.DANMAKU_KEYNICKNAMES, payload: v})} placeholder="模糊匹配 空格隔开 例如:昵称1 昵称2" />
                    <Field label="过滤机器人">
                        <Switch size={20} checked={options.danmaku.ban.isFilterRobot} onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.DANMAKU_BAN_ISFILTEROBOT, payload: v})} />
                    </Field>
                    <Field label="过滤重复">
                        <Switch size={20} checked={options.danmaku.ban.isFilterRepeat} onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.DANMAKU_BAN_ISFILTERREPEAT, payload: v})} />
                    </Field>
                </Tabs.TabPane> 
                <Tabs.TabPane title="礼物">
                    <Field label="占比">
                        <Slider disabled={options.switch[options.switch.length-1] === "gift"} value={options.size.gift} onChange={(v: number) => dispatchOptions({type: OPTIONS_ACTION.SIZE, payload: {gift: v}})}/>
                    </Field>
                    <Field value={String(options.gift.ban.price)} label="屏蔽单价<" type="number" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.GIFT_BAN_PRICE, payload: Number(v)})} placeholder="请输入单价" />
                    <Field value={String(options.gift.totalPrice)} label="高亮总价≥" type="number" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.GIFT_TOTALPRICE, payload: Number(v)})} placeholder="请输入总价" />
                    <Field value={options.gift.ban.keywords.join(" ")} label="屏蔽关键词" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.GIFT_BAN_KEYWORDS, payload: v})} placeholder="空格隔开 例如:荧光棒 鱼丸" />
                    <Field value={String(options.gift.ban.fansLevel)} label="粉丝牌等级≥" type="number" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.GIFT_BAN_FANSLEVEL, payload: Number(v)})} placeholder="屏蔽粉丝牌等级" />
                    <Field value={String(options.gift.fansLevel)} label="高亮升级≥" type="number" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.GIFT_FANSLEVEL, payload: Number(v)})} placeholder="高亮粉丝牌升级" />
                    <Field label="特效">
                        <Switch size={20} checked={options.gift.showEffect} onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.GIFT_SHOWEFFECT, payload: v})} />
                    </Field>
                </Tabs.TabPane>
                <Tabs.TabPane title="进场">
                    <Field label="占比">
                        <Slider disabled={options.switch[options.switch.length-1] === "enter"} value={options.size.enter} onChange={(v: number) => dispatchOptions({type: OPTIONS_ACTION.SIZE, payload: {enter: v}})}/>
                    </Field>
                    <Field label="显示">
                        <Checkbox.Group value={options.enter.show} direction="horizontal" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.ENTER_SHOW, payload: v})}>
                            <Checkbox name="level" shape="square">等级</Checkbox>
                            <Checkbox name="noble" shape="square">贵族</Checkbox>
                            <Checkbox name="avatar" shape="square">头像</Checkbox>
                            <Checkbox name="time" shape="square">时间</Checkbox>
                        </Checkbox.Group>
                    </Field>
                    <Field value={options.enter.keywords.join(" ")} label="关键昵称" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.ENTER_KEYWORDS, payload: v})} placeholder="空格隔开 例如:昵称1 昵称2" />
                    <Field value={String(options.enter.ban.level)} type="digit" label="屏蔽等级≤" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.ENTER_BAN_LEVEL, payload: Number(v)})} placeholder="请输入屏蔽的等级" />
                </Tabs.TabPane>
                <Tabs.TabPane title="SC">
                    <Field label="占比">
                        <Slider disabled={options.switch[options.switch.length-1] === "superchat"} value={options.size.superchat} onChange={(v: number) => dispatchOptions({type: OPTIONS_ACTION.SIZE, payload: {superchat: v}})}/>
                    </Field>
                    <Field label="显示">
                        <Checkbox.Group value={options.superchat.show} direction="horizontal" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.SUPERCHAT_SHOW, payload: v})}>
                            <Checkbox name="noble" shape="square">贵族</Checkbox>
                            <Checkbox name="fans" shape="square">粉丝牌</Checkbox>
                            <Checkbox name="roomAdmin" shape="square">房管</Checkbox>
                            <Checkbox name="diamond" shape="square">钻粉</Checkbox>
                        </Checkbox.Group>
                    </Field>
                    <Field value={options.superchat.keyword} label="触发关键词" onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.SUPERCHAT_KEYWORD, payload: v})} placeholder="请输入触发sc的关键词" />
                    <Collapse initExpanded={["1"]}>
                        <Collapse.Item title={`配置（${options.superchat.options.length}） 点击颜色或文字可修改`} name="1">
                            {options.superchat.options.map((item, index) => {
                                return <Cell icon={
                                    <div style={{cursor: "pointer", borderRadius: "4px", overflow: "hidden", display: "flex", flexDirection: "column", width: "24px", height: "24px"}}>
                                        <div style={{backgroundColor: item.bgColor.header, height: "50%", width: "100%"}} onClick={() => onClickSuperchatSetting(index, "bgColor.header", "标题背景色", item.bgColor.header)}></div>
                                        <div style={{backgroundColor: item.bgColor.body, height: "50%", width: "100%"}} onClick={() => onClickSuperchatSetting(index, "bgColor.body", "内容背景色", item.bgColor.body)}></div>
                                    </div>
                                } style={{display: "flex", alignItems: "center"}} key={item.minPrice + index}>
                                    <span style={{cursor: "pointer", marginRight: "4px"}} onClick={() => onClickSuperchatSetting(index, "minPrice", "价值≥￥", String(item.minPrice))}>价值≥￥{item.minPrice}</span>
                                    <span style={{cursor: "pointer", marginRight: "4px"}} onClick={() => onClickSuperchatSetting(index, "time", "停留时间(秒)", String(item.time))}>停留{item.time}秒</span>
                                </Cell>
                            })}
                        </Collapse.Item>
                    </Collapse>
                    <Field
                    tooltip="minPrice: 高于这个价格则执行这个配置；time: 停留时间"
                    value={JSON.stringify(options.superchat.options,null,"\t")}
                    onChange={(v) => dispatchOptions({
                        type: OPTIONS_ACTION.SUPERCHAT_OPTIONS,
                        payload: JSON.parse(v)
                    })}
                    label="配置"
                    type="textarea"
                    placeholder="请输入json配置" />
                </Tabs.TabPane>
                <Tabs.TabPane title="数据">
                    <Field label="开启统计">
                        <Switch size={20} checked={options.showStatus} onChange={(v) => dispatchOptions({type: OPTIONS_ACTION.SHOW_STATUS, payload: v})} />
                    </Field>
                    <Field label="贵宾数" value={String(nobleNum)} readOnly/>
                    <Field label="弹幕人数" value={String(danmakuPerson.num) + " / " + String(danmakuNum)} readOnly/>
                    {Object.keys(giftStatus).map(key => {
                        let item = giftStatus[key];
                        return <Cell key={item.gfid} icon={
                            <Image src={item.img} width={44} height={44} radius={6}></Image>
                        }
                        title={item.name}
                        label={item.count}></Cell>
                    })}
                </Tabs.TabPane>
            </Tabs>
        </Popup>
    </>;
}

export default Index;