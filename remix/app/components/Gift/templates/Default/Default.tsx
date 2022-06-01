import clsx from "clsx";
import type { FC } from "react";

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
}

const Default: FC<IProps> = (props) => {
    const {data, giftData} = props;
    const getItemClass = (): string => {
        return props.isHighlight ? `highlight-${props.mode}` : "";
    }
    return (
        <div className={clsx("item", {"fadeInLeft": props.showAnimation}, getItemClass())}>
            <span className="item__gift">
                <img className="avatar" src={giftData.pic} loading="lazy" alt=""/>
            </span>
            <span className="item__cnt">{Number(data.gfcnt) !== 0 ? `${data.name}*${data.gfcnt}` : data.name}</span>
            <span className="item__name">{data.nn}</span>
            {Number(data.hits) >= 5 && <span className="item__hits">累计x{data.hits}</span>}
        </div>
    )
}

export default Default;