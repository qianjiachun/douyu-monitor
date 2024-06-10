import React, { useState, useCallback, useContext, memo } from "react";
import { OPTIONS_ACTION, OptionsContext } from "~/hooks/options.reducer";

interface IProps {
  order: number;
  transparent: boolean;
  direction: "row" | "column";
}

const SplitLine: React.FC<IProps> = ({ order, transparent, direction }) => {

  const [isDragging, setIsDragging] = useState(false);
  const { state, dispatch } = useContext(OptionsContext);

  const onMouseDown = useCallback((event: any) => {
    event.stopPropagation && event.stopPropagation();
    event.preventDefault && event.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = direction === "row" ? "col-resize" : "row-resize";

    const boxSizes = JSON.parse(JSON.stringify(state.size));
    const windowLength: number = direction === "row" ? document.documentElement.clientWidth : document.documentElement.clientHeight;
    const boxName: IOptionsSwitch = order === 2 ? state.switch[0] : order === 4 ? state.switch[1] : order === 6 ? state.switch[2] : state.switch[3];
    const boxIndex: number = state.switch.indexOf(boxName);

    const onMouseMove = (event: MouseEvent) => {
      let _boxLength: number = direction === "row" ? event.clientX : event.clientY;
      if (boxIndex === 1) {
        _boxLength -= boxSizes[state.switch[0]] / 100 * windowLength + 12;
      }
      if (boxIndex === 2) {
        _boxLength -= boxSizes[state.switch[0]] / 100 * windowLength + boxSizes[state.switch[1]] / 100 * windowLength + 24;
      }
      setOption(boxName, Math.floor(_boxLength / windowLength * 100));
    };

    const onMouseUp = () => {
      event.stopPropagation && event.stopPropagation();
      event.preventDefault && event.preventDefault();
      setIsDragging(false);
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };


    const setOption = (name: string, size: number) => {
      switch (name) {
        case "enter": dispatch({ type: OPTIONS_ACTION.SIZE, payload: { enter: size } }); break;
        case "gift": dispatch({ type: OPTIONS_ACTION.SIZE, payload: { gift: size } }); break;
        case "danmaku": dispatch({ type: OPTIONS_ACTION.SIZE, payload: { danmaku: size } }); break;
        default: dispatch({ type: OPTIONS_ACTION.SIZE, payload: { superchat: size } });
      }
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

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
    }} onMouseDown={(e) => onMouseDown(e)} onClick={(e) => onClick(e)}>
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