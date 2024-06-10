import clsx from "clsx";
import type { FC } from "react";
import { memo, useMemo, useContext } from "react";
import { OPTIONS_ACTION, OptionsContext } from "~/hooks/options.reducer";
import React from "react";
import { Notify, Dialog,Button } from "react-vant";
import { nobleData } from "~/resources/nobleData";
import { copyTextEvent, formatTime } from "~/utils";

interface IProps {
    // 进场数据
    data: IEnter;
    // 日夜间模式
    mode?: IMode;
    // 是否显示动画
    showAnimation?: boolean;
    // 是否显示用户等级
    showLevel?: boolean;
    // 是否显示贵族
    showNoble?: boolean;
    // 是否显示用户头像
    showAvatar?: boolean;
    // 是否显示时间
    showTime?: boolean;
    // 是否高亮
    isHighlight?: boolean;
}

const Default: FC<IProps> = (props) => {
    const {data} = props;
    const itemClass = useMemo(() => {
        if (props.isHighlight) {
            return `highlight-${props.mode}`;
        }
        if (props.data.nobleLv) {
            return `noble-${props.mode}`;
        }
        return "";
    }, [props]);
    
    const { state, dispatch } = useContext(OptionsContext);

    function clickNickNameEvent(event: any, text: string) {
        event.stopPropagation && event.stopPropagation();
        event.preventDefault && event.preventDefault();

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
                        dispatch({ type: OPTIONS_ACTION.DANMAKU_BAN_NICKNAMES, payload: `${state.danmaku.ban.nicknames.join(" ")} ${text}` });
                        Notify.show({ type: "success", message: `添加屏蔽昵称成功`, duration: 2000 });
                        closeDialog();
                    }
                }, "屏蔽昵称"),

                React.createElement(Button, {
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
            {props.showNoble && !!data.nobleLv && <span className="item__noble"><img src={`${data.nobleLv in nobleData.data ? nobleData.prefix + nobleData.data[data.nobleLv].pic : ""}`} loading="lazy" alt=""/></span>}
            {/* 头像 */}
            {props.showAvatar && <span className="item__avatar"><img className="avatar" src={`https://apic.douyucdn.cn/upload/${data.avatar}_small.jpg`} loading="lazy" alt=""/></span>}
            {/* 昵称 */}
            <span className="item__name" onClick={(e) => clickNickNameEvent(e, data.nn)}><span>{data.nn}</span> 进入了直播间</span>
            {props.showTime && <><br/><span className="item__time">{formatTime(String(data.key).split(".")[0])}</span></>}
        </div>
    )
}

export default memo(Default);