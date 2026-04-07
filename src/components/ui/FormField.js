import React from "react";
import { cx } from "../../lib/format";

function FieldFrame(props) {
  return (
    <label className={cx("block space-y-2", props.className)}>
      <span className="block px-1 text-sm font-semibold text-slate-700">{props.label}</span>
      {props.children}
      {props.hint ? <span className="block px-1 text-xs text-slate-500">{props.hint}</span> : null}
      {props.error ? <span className="block px-1 text-xs font-medium text-error">{props.error}</span> : null}
    </label>
  );
}

var CONTROL_CLASS_NAME =
  "w-full rounded-2xl border-none bg-surface-container-low px-4 py-3 text-sm text-on-surface shadow-inner shadow-white/40 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20";

export function InputField(props) {
  var label = props.label;
  var hint = props.hint;
  var error = props.error;
  var className = props.className;
  var inputProps = Object.assign({}, props);

  delete inputProps.label;
  delete inputProps.hint;
  delete inputProps.error;
  delete inputProps.className;

  return (
    <FieldFrame label={label} hint={hint} error={error} className={className}>
      <input {...inputProps} className={cx(CONTROL_CLASS_NAME, props.inputClassName)} />
    </FieldFrame>
  );
}

export function TextareaField(props) {
  var label = props.label;
  var hint = props.hint;
  var error = props.error;
  var className = props.className;
  var inputProps = Object.assign({}, props);

  delete inputProps.label;
  delete inputProps.hint;
  delete inputProps.error;
  delete inputProps.className;

  return (
    <FieldFrame label={label} hint={hint} error={error} className={className}>
      <textarea
        {...inputProps}
        className={cx(CONTROL_CLASS_NAME, "min-h-[120px] resize-y", props.inputClassName)}
      />
    </FieldFrame>
  );
}

export function SelectField(props) {
  var label = props.label;
  var hint = props.hint;
  var error = props.error;
  var options = props.options || [];
  var className = props.className;
  var inputProps = Object.assign({}, props);

  delete inputProps.label;
  delete inputProps.hint;
  delete inputProps.error;
  delete inputProps.options;
  delete inputProps.className;

  return (
    <FieldFrame label={label} hint={hint} error={error} className={className}>
      <select {...inputProps} className={cx(CONTROL_CLASS_NAME, props.inputClassName)}>
        {options.map(function mapOption(option) {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </FieldFrame>
  );
}
