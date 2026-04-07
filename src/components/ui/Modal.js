import React from "react";
import { cx } from "../../lib/format";

function Modal(props) {
  if (!props.open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal overlay"
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={props.onClose}
      />
      <div
        className={cx(
          "relative z-10 w-full max-w-xl rounded-[32px] border border-white/70 bg-surface-container-lowest p-8 shadow-2xl shadow-slate-900/15",
          props.className
        )}
      >
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
