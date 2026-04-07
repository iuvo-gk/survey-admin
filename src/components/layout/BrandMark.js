import React from "react";
import { Link } from "react-router-dom";
import { cx } from "../../lib/format";

function BrandMark(props) {
  var content = (
    <div className={cx("flex items-center gap-3", props.className)}>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25">
        <span className="material-symbols-outlined">insights</span>
      </div>
      <div>
        <div className="font-headline text-xl font-black tracking-tight text-slate-900">
          InsightFlow
        </div>
        {props.subLabel ? (
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            {props.subLabel}
          </div>
        ) : null}
      </div>
    </div>
  );

  if (props.disableLink) {
    return content;
  }

  return (
    <Link to={props.to || "/"} className="inline-flex">
      {content}
    </Link>
  );
}

export default BrandMark;
