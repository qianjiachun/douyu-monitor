import type { FC } from "react";
import { useEffect, useRef, memo, useCallback } from "react";
import { useScroll } from "~/hooks/useScroll";
import { getFlexStyle, isArrayInText } from "~/utils";
import Default from "./templates/Default/Default";

interface IProps {
    options: IOptions;
    enterList: IEnter[];
}

const FLAG = "enter";

const Enter: FC<IProps> = ({options, enterList}) => {
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
			{enterList.map(item => {
				return <Default key={item.key}
				data={item}
				mode={options.mode}
				isHighlight={isArrayInText(options.enter.keywords, item.nn)}
				showAnimation={options.animation}
				showLevel={options.enter.show.includes("level")}
				showNoble={options.enter.show.includes("noble")}
				showAvatar={options.enter.show.includes("avatar")}
				></Default>
			})}
			{isLock && <div className="gobottom" onClick={(e) => {e.stopPropagation();goToScrollBottom(wrapRef.current)}}>回到底部</div>}
		</div>
	)
}

export default memo(Enter);