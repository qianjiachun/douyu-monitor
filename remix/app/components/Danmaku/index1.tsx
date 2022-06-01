import type { FC} from "react";
import { useEffect, useState } from "react";
import useVirtual from "react-cool-virtual";
import { isArrayInText } from "~/utils";
import Default from "./templates/Default/Default";

interface IProps {
    options: IOptions,
    danmakuList: IDanmaku[],
}

let isScrolling = false;

const Danmaku: FC<IProps> = ({options, danmakuList}) => {
    const [shouldSticky, setShouldSticky] = useState(true);
    const { outerRef, innerRef, items, scrollTo } = useVirtual<HTMLDivElement>({
        itemCount: danmakuList.length,
        onScroll: ({ userScroll }) => {
          if (userScroll && !isScrolling) setShouldSticky(false);
        }
    });
    useEffect(() => {
        if (shouldSticky) {
          isScrolling = true;
		  if (outerRef.current) {
			scrollTo({offset: outerRef.current.scrollHeight + 99999999});
		  }
        }
      }, [danmakuList.length, shouldSticky, outerRef, scrollTo]);
    return (
        <div ref={outerRef} className="danmaku" style={{
			flex: options.switch[options.switch.length - 1] === "danmaku" ? "1" : `0 0 ${options.size.danmaku}%`,
			order: options.switch.indexOf("danmaku") * 2 + 1
		}}>
            <div ref={innerRef}>
                {items.map(({index, measureRef}) => {
					let item = danmakuList[index];
                    return (
						<div key={item.key} ref={measureRef}>
							<Default key={item.key}
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
              isHighlight={isArrayInText(options.danmaku.keyNicknames, item.nn)}
              ></Default>
						</div>
					)
                })}
                {!shouldSticky && <div className="gobottom" onClick={(e) => {e.stopPropagation();setShouldSticky(true);}}>回到底部</div>}
            </div>
            
        </div>
    )
}

export default Danmaku;