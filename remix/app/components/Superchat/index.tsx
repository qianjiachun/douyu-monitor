import type { FC } from "react";
import { useEffect, useRef, memo, useCallback, useMemo } from "react";
import { useScroll } from "~/hooks/useScroll";
import { getFlexStyle, getSuperchatOption } from "~/utils";
import Default from "./templates/Default/Default";

interface IProps {
  options: IOptions;
  superchatList: ISuperchat[];
}

const FLAG = "superchat";

const Superchat: FC<IProps> = ({options, superchatList}) => {
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

	const superchatOptions = useMemo(() => {
		return [...options.superchat.options].sort((a, b) => b.minPrice - a.minPrice);
	}, [options.superchat.options]);

	return (
		<div ref={wrapRef} className={FLAG} style={getFlexStyle(options, FLAG)}>
      {
        superchatList.map(item => {
          return <Default key={item.key}
					option={getSuperchatOption(superchatOptions, item.price)}
					data={item}
					showNoble={options.superchat.show.includes("noble")}
					showFans={options.superchat.show.includes("fans")}
					showDiamond={options.superchat.show.includes("diamond")}
					showRoomAdmin={options.superchat.show.includes("roomAdmin")}
          showAnimation={options.animation}></Default>
        })
      }
			{isLock && <div className="gobottom" onClick={(e) => {e.stopPropagation();goToScrollBottom(wrapRef.current)}}>回到底部</div>}
		</div>
	)
}

export default memo(Superchat);