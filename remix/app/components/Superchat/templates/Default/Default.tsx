import clsx from "clsx";
import type { FC } from "react";
import { memo } from "react";
import { nobleData } from "~/resources/nobleData";

interface IProps {
  // sc配置信息
  option: ISuperchatOption | null;
  // 数据
  data: ISuperchat;
  // 是否显示动画
  showAnimation?: boolean;
  // 是否显示贵族
  showNoble?: boolean;
  // 是否显示粉丝牌
  showFans?: boolean;
  // 是否显示钻粉
  showDiamond?: boolean; 
  // 是否显示房管图标
  showRoomAdmin?: boolean;
}

const Default: FC<IProps> = (props) => {
  const {data} = props;
  return (
    <div className={clsx("item", { fadeInLeft: props.showAnimation })}>
      <div className="item__wrap">
        <div style={props.option ? {backgroundColor: props.option.bgColor.header} : {}} className="item__header">
          <img className="item__avatar" src={`https://apic.douyucdn.cn/upload/${data.avatar}_small.jpg`} loading="lazy" alt="" />
          <div className="item__info">
            <div className="item__name">
              <span>{data.nn}</span>
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
            </div>
            <span>￥{data.price}</span>
          </div>
        </div>
        <div style={props.option ? {backgroundColor: props.option.bgColor.body} : {}} className="item__body">
          <span>{data.txt}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(Default);
