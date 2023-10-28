import type { FC } from "react";
import { useEffect, useRef, memo, useCallback } from "react";
import { useScroll } from "~/hooks/useScroll";
import { GIFT_TYPE } from "~/hooks/useWebsocket";
import { nobleData } from "~/resources/nobleData";
import { getFlexStyle } from "~/utils";
import Default from "./templates/Default/Default";

interface IProps {
    options: IOptions;
    giftList: IGift[];
	reloadGiftData: () => void;
}

const FLAG = "gift";

// 钻粉图片
const DIAMOND_URL = "https://shark2.douyucdn.cn/front-publish/live-player-aside-master/assets/images/diamonds_banner_logo_c077d7b.gif";
// 粉丝牌升级图片
const FANS_LEVEL_UP = "https://shark2.douyucdn.cn/front-publish/live-anchor-title-master/assets/images/exp_ca09807.webp";

const Gift: FC<IProps> = ({options, giftList, reloadGiftData}) => {
	const { isLock, onScroll, onScrollUpdate, goToScrollBottom } = useScroll();
	const wrapRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		onScrollUpdate(wrapRef.current);
	}, [onScrollUpdate]);

	const onScrollEvent = useCallback(() => {
		onScroll(wrapRef.current);
	}, [onScroll]);

	useEffect(() => {
		if (!wrapRef.current) return
		const wrap = wrapRef.current;
		wrap.addEventListener("mousewheel", onScrollEvent);
		wrap.addEventListener("touchmove", onScrollEvent);
		return () => {
			wrap.removeEventListener("mousewheel", onScrollEvent);
			wrap.removeEventListener("touchmove", onScrollEvent);
		}
	}, [onScroll, onScrollEvent]);

	const checkHighlight = (data: IGift) => {
		// 判断是否需要高亮
		let giftData = window.allGift[data.gfid];
        switch (data.type) {
            case GIFT_TYPE.GIFT:
                // 高亮总价大于等于
                return giftData && giftData.pc * Number(data.gfcnt) >= options.gift.totalPrice * 100;
            case GIFT_TYPE.FANS:
				// 高亮粉丝牌升级大于
                return Number(data.bl) >= options.gift.fansLevel;
            default:
                return true;
        }
	}

	const getGiftData = (data: IGift) => {
		// 获取礼物的信息（图片 价格 名称）
		switch (data.type) {
			case GIFT_TYPE.GIFT:
				if (window.allGift[data.gfid]) {
					return window.allGift[data.gfid];
				} else {
					break;
				}
			case GIFT_TYPE.DIAMOND:
				return {n: "钻粉", pic: DIAMOND_URL, pc: 0, svga: ""};
			case GIFT_TYPE.NOBLE:
				return {n: "贵族", pic: nobleData.prefix + nobleData.data[data.nl].pic, pc: 0, svga: ""};
			case GIFT_TYPE.FANS:
				return {n: "粉丝牌升级", pic: FANS_LEVEL_UP, pc: 0, svga: ""};
			default:
				break;
		}
		return {n: "", pic: "", pc: -1, svga: ""};
	}

	return (
		<div ref={wrapRef} className={FLAG} style={getFlexStyle(options, FLAG)}>
			{giftList.map(item => {
				return <Default key={item.key}
				data={item}
				mode={options.mode}
				showAnimation={options.animation}
				giftData={getGiftData(item)}
				isHighlight={checkHighlight(item)}
				onClickReloadGiftData={reloadGiftData}
				></Default>
			})}
			{isLock && <div className="gobottom" onClick={(e) => {e.stopPropagation();goToScrollBottom(wrapRef.current)}}>回到底部</div>}
		</div>
	)
}

export default memo(Gift);