import React from "react";
import { cx } from "../../lib/format";

var VARIANT_CLASS_MAP = {
  primary:
    "bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-lg shadow-primary/20 hover:-translate-y-0.5",
  secondary:
    "bg-surface-container-lowest text-on-surface shadow-sm ring-1 ring-black/5 hover:-translate-y-0.5",
  ghost:
    "bg-transparent text-on-surface hover:bg-surface-container-highest",
  subtle: "bg-surface-container text-on-surface hover:bg-surface-container-high",
  danger: "bg-error text-on-error shadow-lg shadow-error/20 hover:-translate-y-0.5",
};

var SIZE_CLASS_MAP = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-4 text-base",
};

function Button(props) {
  var children = props.children;
  var className = props.className;
  var disabled = props.disabled;
  var fullWidth = props.fullWidth;
  var iconLeft = props.iconLeft;
  var iconRight = props.iconRight;
  var size = props.size || "md";
  var type = props.type || "button";
  var variant = props.variant || "primary";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={props.onClick}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50",
        VARIANT_CLASS_MAP[variant],
        SIZE_CLASS_MAP[size],
        fullWidth ? "w-full" : "",
        className
      )}
    >
      {iconLeft ? <span className="material-symbols-outlined text-[1.1em]">{iconLeft}</span> : null}
      <span>{children}</span>
      {iconRight ? <span className="material-symbols-outlined text-[1.1em]">{iconRight}</span> : null}
    </button>
  );
}

export default Button;
