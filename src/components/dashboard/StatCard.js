import React from "react";
import Card from "../ui/Card";

function StatCard(props) {
  return (
    <Card className="p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/5">
      <div className="flex items-start justify-between gap-4">
        <div className={"flex h-12 w-12 items-center justify-center rounded-2xl " + props.iconBackground}>
          <span className="material-symbols-outlined">{props.icon}</span>
        </div>
        {props.trend ? (
          <div className="rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-on-secondary-container">
            {props.trend}
          </div>
        ) : null}
      </div>
      <div className="mt-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
          {props.label}
        </div>
        <div className="mt-3 font-headline text-4xl font-black tracking-tight text-on-surface">
          {props.value}
        </div>
        {props.caption ? <div className="mt-2 text-sm text-slate-500">{props.caption}</div> : null}
      </div>
    </Card>
  );
}

export default StatCard;
