import React from "react";
import {
  getEligibleConditionalQuestions,
  getOperatorOptions,
  getQuestionByCustomId,
  OPERATOR_META,
} from "../../lib/survey";
import { OPTIONS_MULTI, TEXT } from "../../constants";
import Button from "../ui/Button";

function buildRuleDefaults(question) {
  var nextRule = {
    field: question.custom_id,
    operator: getOperatorOptions(question.type)[0],
    value: "",
    values: [],
  };

  if (question.type !== TEXT && question.options && question.options.length) {
    nextRule.value = question.options[0].custom_id;
  }

  if (question.type === OPTIONS_MULTI && question.options && question.options.length) {
    nextRule.value = "";
    nextRule.values = [question.options[0].custom_id];
  }

  return nextRule;
}

function MultiValuePicker(props) {
  return (
    <div className="space-y-2 rounded-2xl bg-surface-container-low p-4">
      {(props.options || []).map(function mapOption(option) {
        var checked = (props.values || []).indexOf(option.custom_id) !== -1;

        return (
          <label
            key={option.custom_id}
            className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-3 py-2 text-sm font-medium text-on-surface"
          >
            <span>{option.value || "Untitled option"}</span>
            <input
              type="checkbox"
              checked={checked}
              onChange={function onChange() {
                var nextValues = checked
                  ? props.values.filter(function removeValue(value) {
                      return value !== option.custom_id;
                    })
                  : props.values.concat(option.custom_id);

                props.onChange(nextValues);
              }}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/30"
            />
          </label>
        );
      })}
    </div>
  );
}

function ConditionalRuleEditor(props) {
  var eligibleQuestions = getEligibleConditionalQuestions(
    props.questions,
    props.currentQuestionCustomId
  );

  if (!eligibleQuestions.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
        Add a question above this one to unlock conditional logic.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(props.rules || []).map(function mapRule(rule, index) {
        var fieldQuestion =
          getQuestionByCustomId(eligibleQuestions, rule.field) || eligibleQuestions[0];
        var operatorOptions = getOperatorOptions(fieldQuestion.type);

        return (
          <div key={rule.id} className="rounded-[24px] bg-surface-container-low p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                Rule {index + 1}
              </div>
              <button
                type="button"
                onClick={function onClick() {
                  props.onRemoveRule(rule.id);
                }}
                className="text-slate-400 transition hover:text-error"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="mt-4 grid gap-4">
              <label className="space-y-2">
                <span className="block px-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  When question
                </span>
                <select
                  value={fieldQuestion.custom_id}
                  onChange={function onChange(event) {
                    var nextFieldQuestion = getQuestionByCustomId(
                      eligibleQuestions,
                      event.target.value
                    );
                    var defaults = buildRuleDefaults(nextFieldQuestion);
                    props.onUpdateRule(rule.id, defaults);
                  }}
                  className="w-full rounded-2xl border-none bg-white/80 px-4 py-3 text-sm shadow-inner shadow-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {eligibleQuestions.map(function mapQuestion(question) {
                    return (
                      <option key={question.custom_id} value={question.custom_id}>
                        {question.value || "Untitled question"}
                      </option>
                    );
                  })}
                </select>
              </label>

              <label className="space-y-2">
                <span className="block px-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Operator
                </span>
                <select
                  value={rule.operator}
                  onChange={function onChange(event) {
                    props.onUpdateRule(rule.id, { operator: event.target.value });
                  }}
                  className="w-full rounded-2xl border-none bg-white/80 px-4 py-3 text-sm shadow-inner shadow-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {operatorOptions.map(function mapOperator(operator) {
                    return (
                      <option key={operator} value={operator}>
                        {OPERATOR_META[operator].label}
                      </option>
                    );
                  })}
                </select>
              </label>

              {fieldQuestion.type === TEXT ? (
                <label className="space-y-2">
                  <span className="block px-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Match text
                  </span>
                  <input
                    type="text"
                    value={rule.value || ""}
                    onChange={function onChange(event) {
                      props.onUpdateRule(rule.id, { value: event.target.value });
                    }}
                    className="w-full rounded-2xl border-none bg-white/80 px-4 py-3 text-sm shadow-inner shadow-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Type the expected text"
                  />
                </label>
              ) : null}

              {fieldQuestion.type !== TEXT && fieldQuestion.type !== OPTIONS_MULTI ? (
                <label className="space-y-2">
                  <span className="block px-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Match option
                  </span>
                  <select
                    value={rule.value || ""}
                    onChange={function onChange(event) {
                      props.onUpdateRule(rule.id, { value: event.target.value });
                    }}
                    className="w-full rounded-2xl border-none bg-white/80 px-4 py-3 text-sm shadow-inner shadow-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {(fieldQuestion.options || []).map(function mapOption(option) {
                      return (
                        <option key={option.custom_id} value={option.custom_id}>
                          {option.value || "Untitled option"}
                        </option>
                      );
                    })}
                  </select>
                </label>
              ) : null}

              {fieldQuestion.type === OPTIONS_MULTI ? (
                <div className="space-y-2">
                  <span className="block px-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Match any selected options
                  </span>
                  <MultiValuePicker
                    options={fieldQuestion.options || []}
                    values={rule.values || []}
                    onChange={function onChange(nextValues) {
                      props.onUpdateRule(rule.id, { values: nextValues });
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        );
      })}

      <Button variant="secondary" size="sm" onClick={props.onAddRule} iconLeft="alt_route">
        Add logic rule
      </Button>
    </div>
  );
}

export default ConditionalRuleEditor;
