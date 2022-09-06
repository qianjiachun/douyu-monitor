import clsx from "clsx";
import type { FC } from "react";
import { memo, useMemo } from "react";
import { nobleData } from "~/resources/nobleData";

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
    return (
        <div className={clsx("item", {"fadeInLeft": props.showAnimation}, itemClass)}>
            {/* 等级 */}
            {props.showLevel && <span className={clsx("item__level", {"fansLevelNight": props.mode==="night" && Number(data.lv) < 70}, "UserLevel", `UserLevel--${data.lv}`)}></span>}
            {/* 贵族 */}
            {props.showNoble && !!data.nobleLv && <span className="item__noble"><img src={`${data.nobleLv in nobleData.data ? nobleData.prefix + nobleData.data[data.nobleLv].pic : ""}`} loading="lazy" alt=""/></span>}
            {/* 头像 */}
            {props.showAvatar && <span className="item__avatar"><img className="avatar" src={`https://apic.douyucdn.cn/upload/${data.avatar}_small.jpg`} loading="lazy" alt=""/></span>}
            {/* 昵称 */}
            <span className="item__name"><span>{data.nn}</span> 进入了直播间</span>
        </div>
    )
}

export default memo(Default);