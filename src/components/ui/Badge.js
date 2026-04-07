import React from "react";
import { cx } from "../../lib/format";

var TONE_CLASS_MAP = {
  primary: "bg-primary-fixed text-primary",
  secondary: "bg-secondary-container text-on-secondary-container",
  danger: "bg-error-container text-error",
  neutral: "bg-surface-container-highest text-on-surface-variant",
  dark: "bg-slate-900 text-white",
};

function Badge(props) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em]",
        TONE_CLASS_MAP[props.tone || "neutral"],
        props.className
      )}
    >
      {props.children}
    </span>
  );
}

export default Badge;
