import clsx from "clsx";
import { memo, useMemo, useContext } from "react";
import { OPTIONS_ACTION, OptionsContext } from "~/hooks/options.reducer";
import type { FC } from "react";
import React from "react";
import { Notify, Dialog,Button } from "react-vant";
import { danmakuColor } from "~/resources/danmakuColor";
import { nobleData } from "~/resources/nobleData";
import { copyTextEvent, decompressDouyuExImageUrl, formatTime, isValidImageFile } from "~/utils";
import { YUBA_IMAGE_HOST } from "~/resources/yubaCDN";

interface IProps {
    // 弹幕数据
    data: IDanmaku;
    // 日夜间模式
    mode?: IMode;
    // 是否显示动画
    showAnimation?: boolean;
    // 是否显示用户等级
    showLevel?: boolean;
    // 是否显示贵族
    showNoble?: boolean;
    // 是否显示粉丝牌
    showFans?: boolean;
    // 是否显示钻粉
    showDiamond?: boolean; 
    // 是否显示房管图标
    showRoomAdmin?: boolean;
    // 是否显示用户头像
    showAvatar?: boolean;
    // 是否显示VIP图标
    showVip?: boolean;
    // 是否显示弹幕颜色
    showColor?: boolean;
    // 是否显示时间
    showTime?: boolean;
    // 是否高亮
    isHighlight?: boolean;
}

const Default: FC<IProps> = (props) => {
    const {data} = props;
    const itemClass = useMemo(() => {
        if (props.data.isSuper) {
            return props.mode === "night" ? "super-night" : "super-day";
        } else if (props.data.isNoble || props.data.isVip || props.isHighlight) {
            return props.mode === "night" ? "noble-night" : "noble-day";
        } else {
            return "";
        }
    }, [props]);
    
    const danmakuText = useMemo(() => {
        if (data.txt.includes(`[DouyuEx图片`)) {
            return data.txt.replace(/\[DouyuEx图片(.*?)\]/g, (match, str: string) => {
                if (!isValidImageFile(str)) return "";
                const split = str.split(".");
                const url = decompressDouyuExImageUrl(split[0]);
                const realImageUrl = `${YUBA_IMAGE_HOST}${url.slice(0, 4) + "/" + url.slice(4, 6) + "/" + url.slice(6, 8) + "/" + url}.200x0.${split[1]}`;
                const imgHtml = `<a href="${realImageUrl.replace("200x0.", "")}" target="_blank"><img class="ex-image-danmaku" src="${realImageUrl}" alt=""></a>`;
                return imgHtml;
            });
        } else {
            return data.txt;
        }
    }, [data.txt]);

    const { state, dispatch } = useContext(OptionsContext);
    
    function clickTextEvent(event: any, text: string, type: string) {
        event.stopPropagation && event.stopPropagation();
        event.preventDefault && event.preventDefault();

        const banText = (type === "nn" ? "屏蔽昵称" : type === "txt" ? "屏蔽关键词" : "");

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

    return (
        <div className={clsx("item", {"fadeInLeft": props.showAnimation}, itemClass)}>
            {/* 等级 */}
            {props.showLevel && <span className={clsx("item__level", {"fansLevelNight": props.mode==="night" && Number(data.lv) < 70}, "UserLevel", `UserLevel--${data.lv}`)}></span>}
            {/* 贵族 */}
            {props.showNoble && !!props.data.nobleLv &&
            <span className="item__noble Barrage-icon Barrage-noble">
                <img src={`${data.nobleLv in nobleData.data ? nobleData.prefix + nobleData.data[data.nobleLv].pic : ""}`} alt="" loading="lazy"/>
            </span>}
            {/* 粉丝牌 */}
            {props.showFans && !!data.fansName &&
            <div className={clsx("item__fans", {"is-diamonds": data.isDiamond}, "FansMedal", `fansLevel-${Number(data.fansLv) <= 50 ? data.fansLv : `50`}`)}>
                <span className="FansMedal-name">{data.fansName}</span>
                {/* 钻粉 */}
                {data.isDiamond && props.showDiamond && <img className="FansMedalBox-diamondsIcon" src="https://sta-op.douyucdn.cn/douyu/2021/08/05/02304a1c04587e43ac626ce5ce07d935.png" alt="" loading="lazy"/>}
            </div>}
            {/* 房管 */}
            {props.showRoomAdmin && data.isRoomAdmin &&
            <span className="item__roomAdmin">
                <span className="Barrage-icon Barrage-icon--roomAdmin"></span>
            </span>}
            {/* 头像 */}
            {props.showAvatar && <span className="item__avatar"><img className="avatar" src={`https://apic.douyucdn.cn/upload/${data.avatar}_small.jpg`} alt="" loading="lazy" /></span>}
            {/* 昵称 */}
            <span className={clsx("item__name", {"super-name": data.isSuper})} onClick={(e) => clickTextEvent(e, data.nn, "nn")}>
                {/* VIP */}
                {props.showVip && data.isVip && <span className="Barrage-roomVipIcon"></span>}
                {data.nn}：
            </span>
            {/* 弹幕 */}
            <span style={props.showColor ? {color: danmakuColor[data.color]} : {}} className="item__txt">
                {data.txt.includes(`[DouyuEx图片`) ? <span className="item__imgtxt" dangerouslySetInnerHTML={{ __html: danmakuText }}></span> : <span onClick={(e) => clickTextEvent(e, data.txt, "txt")}>{data.txt}</span>}
                {data.repeatCount > 1 && <span className="item__repeat">x{data.repeatCount}</span>}
            </span>
            
            {props.showTime && <><br/><span className="item__time">{formatTime(String(data.key).split("_")[1])}</span></>}
        </div>
    )
}

export default memo(Default);