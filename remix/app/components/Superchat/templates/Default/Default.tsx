import clsx from "clsx";
import type { FC } from "react";
import { memo } from "react";
import { formatTime } from "~/utils";

interface IProps {
  // sc配置信息
  option: ISuperchatOption | null;
  // 价格
  price: number;
  // 昵称
  nickname: string;
  // 头像地址
  avatar: string;
  // 弹幕内容
  txt: string;
  // 是否显示动画
  showAnimation?: boolean;
}

const Default: FC<IProps> = (props) => {

  return (
    <div className={clsx("item", { fadeInLeft: props.showAnimation })}>
      <div className="item__wrap">
        <div style={props.option ? {backgroundColor: props.option.bgColor.header} : {}} className="item__header">
          <img className="item__avatar" src={`https://apic.douyucdn.cn/upload/${props.avatar}_small.jpg`} loading="lazy" alt="" />
          <div className="item__info">
            <div className="item__name">
              <div>{props.nickname}</div>
              {/* <div>{data.isNoble}</div> */}
            </div>
            <span>￥{props.price}</span>
          </div>
        </div>
        <div style={props.option ? {backgroundColor: props.option.bgColor.body} : {}} className="item__body">
          <span>{props.txt}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(Default);
