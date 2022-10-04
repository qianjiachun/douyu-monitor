import type { FC } from "react";
import { useEffect, useRef, memo, useCallback } from "react";
import { useScroll } from "~/hooks/useScroll";
import { getFlexStyle, isArrayInText } from "~/utils";
import Default from "./templates/Default/Default";

interface IProps {
    options: IOptions;
    danmakuList: IDanmaku[];
}

const FLAG = "danmaku";

const Danmaku: FC<IProps> = ({options, danmakuList}) => {
	const { isLock, onScroll, onScrollUpdate, goToScrollBottom } = useScroll();
	const wrapRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		onScrollUpdate(wrapRef.current)
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
	
	return (
		<div ref={wrapRef} className={FLAG} style={getFlexStyle(options, FLAG)}>
			{danmakuList.map(item => {
				return <Default key={item.key}
				data={item}
				mode={options.mode}
				showAnimation={options.animation}
				showLevel={options.danmaku.show.includes("level")}
				showNoble={options.danmaku.show.includes("noble")}
				showFans={options.danmaku.show.includes("fans")}
				showDiamond={options.danmaku.show.includes("diamond")}
				showRoomAdmin={options.danmaku.show.includes("roomAdmin")}
				showAvatar={options.danmaku.show.includes("avatar")}
				showVip={options.danmaku.show.includes("vip")}
				showColor={options.danmaku.show.includes("color")}
				showTime={options.danmaku.show.includes("time")}
				isHighlight={isArrayInText(options.danmaku.keyNicknames, item.nn)}
				></Default>
			})}
			{isLock && <div className="gobottom" onClick={(e) => {e.stopPropagation();goToScrollBottom(wrapRef.current)}}>回到底部</div>}
		</div>
	)
}

export default memo(Danmaku);