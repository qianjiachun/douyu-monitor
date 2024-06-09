import clsx from "clsx";
import type { FC } from "react";
import { memo, useMemo, useContext } from "react";
import { OptionsContext } from "~/hooks/options.reducer";
import { Button } from "react-vant";
import { GIFT_TYPE } from "~/hooks/useWebsocket";
import { clickTextEvent, clickGiftEvent, formatTime } from "~/utils";

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
    const optionsContext = useContext(OptionsContext);
    const handleClickTextEvent = (event: any, text: string, type: string) => {
        clickTextEvent(optionsContext, event, text, type);
    };
    const handleClickGiftEvent = (event: any, name: string) => {
        clickGiftEvent(optionsContext, event, name);
    };
    return (
        <div className={clsx("item", {"fadeInLeft": props.showAnimation}, itemClass)}>
            <span className="item__gift">
                <img className="avatar" src={giftData.pic} loading="lazy" alt=""/>
            </span>
            <span className="item__cnt" onClick={(e) => handleClickGiftEvent(e, data.name)}>{Number(data.gfcnt) !== 0 ? `${data.name}*${data.gfcnt}` : data.name}</span>
            <span className="item__name" onClick={(e) => handleClickTextEvent(e, data.nn, "nn")}>{data.nn}</span>
            {Number(data.hits) >= 5 && <span className="item__hits">累计x{data.hits}</span>}
            {data.type === GIFT_TYPE.UNKNOWN ? <Button type="primary" size="mini" onClick={onClickReloadGiftData}>刷新礼物</Button> : <></>}
            <br/>
            <span className="item__time">{formatTime(String(data.key).split(".")[0])}</span>
        </div>
    )
}

export default memo(Default);