import React, { useCallback, useContext, memo } from "react";
import { OPTIONS_ACTION, OptionsContext } from "~/hooks/options.reducer";

interface IProps {
  order: number;
  transparent: boolean;
  direction: "row" | "column";
}

const SplitLine: React.FC<IProps> = ({ order, transparent, direction }) => {

  const { state, dispatch } = useContext(OptionsContext);

  const handleStart = useCallback((event: any) => {
    // 判断用户点击事件判断访问端类型（mouse\touch）
    const moveEvent = event.type === "mousedown" ? "mousemove" : "touchmove";
    const endEvent = event.type === "mousedown" ? "mouseup" : "touchend";

    document.body.style.cursor = direction === "row" ? "col-resize" : "row-resize";

    const boxSizes = JSON.parse(JSON.stringify(state.size));
    const windowLength: number = direction === "row" ? document.documentElement.clientWidth : document.documentElement.clientHeight;
    const boxName: IOptionsSwitch = state.switch[order / 2 - 1];
    const boxIndex: number = state.switch.indexOf(boxName);

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      let _boxLength: number = 0;

      if ("touches" in e && e.touches.length > 0) {
        _boxLength = direction === "row" ? e.touches[0].clientX : e.touches[0].clientY;
      } else {
        _boxLength = direction === "row" ? (e as MouseEvent).clientX : (e as MouseEvent).clientY;
      }


      const borderWidthHeight = 12;
      if (boxIndex === 1) {
        _boxLength -= boxSizes[state.switch[0]] / 100 * windowLength + borderWidthHeight;
      }
      if (boxIndex === 2) {
        _boxLength -= boxSizes[state.switch[0]] / 100 * windowLength + boxSizes[state.switch[1]] / 100 * windowLength + borderWidthHeight * 2;
      }
      _boxLength -= borderWidthHeight / 2;
      setOption(boxName, _boxLength / windowLength * 100);
    };

    const onMouseUp = () => {
      document.body.style.cursor = "";
      document.removeEventListener(moveEvent, onMouseMove);
      document.removeEventListener(endEvent, onMouseUp);
    };


    const setOption = (name: string, size: number) => {
      switch (name) {
        case "enter": dispatch({ type: OPTIONS_ACTION.SIZE, payload: { enter: size } }); break;
        case "gift": dispatch({ type: OPTIONS_ACTION.SIZE, payload: { gift: size } }); break;
        case "danmaku": dispatch({ type: OPTIONS_ACTION.SIZE, payload: { danmaku: size } }); break;
        default: dispatch({ type: OPTIONS_ACTION.SIZE, payload: { superchat: size } });
      }
    }

    document.addEventListener(moveEvent, onMouseMove);
    document.addEventListener(endEvent, onMouseUp);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, state]);


  const onClick = (event: any) => {
    event.stopPropagation && event.stopPropagation();
    event.preventDefault && event.preventDefault();
  };

  return (
    // 嵌套一层实现鼠标移入选取范围变大
    <div style={{
      order,
      width: direction === "row" ? "12px" : "100%",
      minWidth: direction === "row" ? "12px" : "100%",
      height: direction === "row" ? "100%" : "12px",
      minHeight: direction === "row" ? "100%" : "12px",
      cursor: direction === "row" ? "col-resize" : "row-resize",
      display: "flex"
    }} onMouseDown={(e) => handleStart(e)} onTouchStart={(e) => handleStart(e)} onClick={(e) => onClick(e)}>
      <div
        className="splitline"
        style={{
          order,
          width: direction === "row" ? "3px" : "100%",
          height: direction === "row" ? "100%" : "3px",
          margin: direction === "row" ? "0 auto" : "auto 0",
          ...transparent ? { backgroundColor: "transparent" } : {}
        }}></div>
    </div>
  );
};

export default memo(SplitLine);