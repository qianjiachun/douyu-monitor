import type { FC } from "react";
import { useEffect, useState } from "react";
import useVirtual from "react-cool-virtual";
import { getFlexStyle, isArrayInText } from "~/utils";
import Default from "./templates/Default/Default";

interface IProps {
  options: IOptions;
  danmakuList: IDanmaku[];
}

let isScrolling = false;
const FLAG = "danmaku";

const Danmaku: FC<IProps> = ({ options, danmakuList }) => {
  const [shouldSticky, setShouldSticky] = useState(true);
  const { outerRef, innerRef, items, scrollToItem } = useVirtual<HTMLDivElement>({
    itemCount: danmakuList.length,
    onScroll: ({ userScroll }) => {
      if (userScroll && !isScrolling) setShouldSticky(false);
    },
  });
  useEffect(() => {
    if (shouldSticky) {
      isScrolling = true;
      if (outerRef.current) {
        scrollToItem({index: danmakuList.length - 1, smooth: false});
        requestAnimationFrame(() => {
          scrollToItem({index: danmakuList.length - 1, smooth: false});
        });
        setTimeout(() => {
          scrollToItem({index: danmakuList.length - 1, smooth: false});
          requestAnimationFrame(() => {
            scrollToItem({index: danmakuList.length - 1, smooth: false});
          });
        }, 0);
      }
    }
  }, [danmakuList.length, shouldSticky, outerRef, scrollToItem]);

  return (
    <div ref={outerRef} className={FLAG} style={getFlexStyle(options, FLAG)}>
      <div ref={innerRef}>
        {items.map(({ index, measureRef }) => {
          let item = danmakuList[index];
          return (
            <div key={item.key} ref={measureRef}>
              <Default
                key={item.key}
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
                isHighlight={isArrayInText(
                  options.danmaku.keyNicknames,
                  item.nn
                )}
              ></Default>
            </div>
          );
        })}
        {!shouldSticky && (
          <div
            className="gobottom"
            onClick={(e) => {
              e.stopPropagation();
              setShouldSticky(true);
            }}
          >
            回到底部
          </div>
        )}
      </div>
    </div>
  );
};

export default Danmaku;
