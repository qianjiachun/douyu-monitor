import { memo } from "react";
import type { FC } from "react";

interface IProps {
    order: number;
    transparent: boolean;
    direction: "row" | "column";
}

const SplitLine: FC<IProps> = (props) => {
  return (
    <div
      className="splitline"
      style={{
        order: props.order,
        width: props.direction === "row" ? "3px" : "100%",
        height: props.direction === "row" ? "100%" : "3px",
        ...props.transparent ? {backgroundColor: "transparent"} : {}
      }}
    ></div>
  );
};


export default memo(SplitLine);