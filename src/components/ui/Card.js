import React from "react";
import { cx } from "../../lib/format";

function Card(props) {
  return (
    <div
      className={cx(
        "rounded-[28px] border border-white/60 bg-surface-container-lowest shadow-sm shadow-slate-900/5",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

export default Card;
