import type { FC } from "react";
import { useEffect, useRef, memo, useCallback } from "react";
import { useScroll } from "~/hooks/useScroll";

interface IProps {
    options: IOptions;
    panelDataList: IPanelData[];
}

const FLAG = "panel";

const Panel: FC<IProps> = ({options, panelDataList}) => {
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
		<div ref={wrapRef} className={FLAG}>
			{isLock && <div className="gobottom" onClick={(e) => {e.stopPropagation();goToScrollBottom(wrapRef.current)}}>回到底部</div>}
		</div>
	)
}

export default memo(Panel);