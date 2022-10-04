import clsx from "clsx";
import { memo, useMemo } from "react";
import type { FC } from "react";
import { danmakuColor } from "~/resources/danmakuColor";
import { nobleData } from "~/resources/nobleData";
import { formatTime } from "~/utils";

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
            <div className={clsx("item__fans", {"is-diamonds": data.isDiamond}, "FansMedal", `fansLevel-${data.fansLv}`)}>
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
            <span className={clsx("item__name", {"super-name": data.isSuper})}>
                {/* VIP */}
                {props.showVip && data.isVip && <span className="Barrage-roomVipIcon"></span>}
                {data.nn}：
            </span>
            {/* 弹幕 */}
            <span style={props.showColor ? {color: danmakuColor[data.color]} : {}} className="item__txt">{data.txt}</span>
            {props.showTime && <><br/><span className="item__time">{formatTime(String(data.key).split(".")[0])}</span></>}
        </div>
    )
}

export default memo(Default);