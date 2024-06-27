import clsx from "clsx";
import type { FC } from "react";
import { memo, useMemo, useContext } from "react";
import React from "react";
import { OPTIONS_ACTION, OptionsContext } from "~/hooks/options.reducer";
import { Notify, Dialog,Button } from "react-vant";
import { GIFT_TYPE } from "~/hooks/useWebsocket";
import { copyTextEvent, formatTime } from "~/utils";

interface IProps {
    // 礼物数据
    data: IGift;
    // 日夜间模式
    mode?: IMode;
    // 是否显示动画
    showAnimation?: boolean;
    // 礼物信息（名称，图片地址，价格[非正常礼物为0]）
    giftData: IGiftItem;
    // 是否高亮
    isHighlight?: boolean;
    // 点击刷新礼物
    onClickReloadGiftData?: () => void;
}

const Default: FC<IProps> = (props) => {
    const {data, giftData} = props;
    const itemClass = useMemo(() => {
        return props.isHighlight ? `highlight-${props.mode}` : "";
    }, [props]);
    const onClickReloadGiftData = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        props.onClickReloadGiftData && props.onClickReloadGiftData();
    };

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
    
    function clickGiftEvent(event: any, name: string) {
        event.stopPropagation && event.stopPropagation();
        event.preventDefault && event.preventDefault();

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

    return (
        <div className={clsx("item", {"fadeInLeft": props.showAnimation}, itemClass)}>
            <span className="item__gift">
                <img className="avatar" src={giftData.pic} loading="lazy" alt=""/>
            </span>
            <span className="item__cnt" onClick={(e) => clickGiftEvent(e, data.name)}>{Number(data.gfcnt) !== 0 ? `${data.name}${data.type === GIFT_TYPE.UNKNOWN ? `（id: ${data.gfid}）未知价格，请到斗鱼查看` : ``}*${data.gfcnt}` : data.name}</span>
            <span className="item__name" onClick={(e) => clickNickNameEvent(e, data.nn)}>{data.nn}</span>
            {Number(data.hits) >= 5 && <span className="item__hits">累计x{data.hits}</span>}
            {data.type === GIFT_TYPE.UNKNOWN ? <Button type="primary" size="mini" onClick={onClickReloadGiftData}>刷新礼物</Button> : <></>}
            <br/>
            <span className="item__time">{formatTime(String(data.key).split(".")[0])}</span>
        </div>
    )
}

export default memo(Default);