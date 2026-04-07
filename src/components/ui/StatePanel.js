import React from "react";
import Card from "./Card";
import Button from "./Button";

export function LoadingPanel(props) {
  return (
    <Card className="overflow-hidden p-8">
      <div className="space-y-4">
        <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
        <div className="h-8 w-2/3 animate-pulse rounded-full bg-slate-200" />
        <div className="h-28 animate-pulse rounded-[24px] bg-slate-100" />
      </div>
      {props.label ? <p className="mt-6 text-sm text-slate-500">{props.label}</p> : null}
    </Card>
  );
}

export function EmptyPanel(props) {
  return (
    <Card className="p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-fixed text-primary">
        <span className="material-symbols-outlined text-3xl">{props.icon || "inbox"}</span>
      </div>
      <h3 className="text-xl font-bold text-on-surface">{props.title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{props.description}</p>
      {props.actionLabel && props.onAction ? (
        <div className="mt-6">
          <Button onClick={props.onAction}>{props.actionLabel}</Button>
        </div>
      ) : null}
    </Card>
  );
}

export function ErrorPanel(props) {
  return (
    <Card className="p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-error-container text-error">
          <span className="material-symbols-outlined">error</span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-on-surface">{props.title || "Unable to load data"}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {props.message || "The request did not complete successfully."}
          </p>
          {props.retry ? (
            <div className="mt-5">
              <Button variant="secondary" onClick={props.retry}>
                Retry
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
