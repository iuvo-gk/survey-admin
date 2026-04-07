import React, { useEffect, useMemo, useState } from "react";
import { TEXT } from "../../constants";
import { cx } from "../../lib/format";
import {
  createConditionalRule,
  createOption,
  createQuestion,
  getQuestionTypeOptions,
  isOptionQuestion,
  QUESTION_TYPE_META,
} from "../../lib/survey";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { InputField, SelectField, TextareaField } from "../ui/FormField";
import ConditionalRuleEditor from "./ConditionalRuleEditor";

function ToggleRow(props) {
  return (
    <button
      type="button"
      onClick={props.onToggle}
      className="flex w-full items-center justify-between rounded-2xl bg-surface-container-low px-4 py-3 text-left transition hover:bg-surface-container"
    >
      <div>
        <div className="text-sm font-semibold text-on-surface">{props.label}</div>
        {props.description ? (
          <div className="mt-1 text-xs leading-5 text-slate-500">{props.description}</div>
        ) : null}
      </div>
      <div
        className={cx(
          "relative h-6 w-11 rounded-full transition",
          props.active ? "bg-primary" : "bg-slate-200"
        )}
      >
        <div
          className={cx(
            "absolute top-1 h-4 w-4 rounded-full bg-white transition",
            props.active ? "right-1" : "left-1"
          )}
        />
      </div>
    </button>
  );
}

function QuestionTypeTile(props) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="group rounded-[26px] border border-white/70 bg-surface-container-lowest p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-fixed text-primary transition group-hover:bg-primary group-hover:text-white">
          <span className="material-symbols-outlined">{props.icon}</span>
        </div>
        <div>
          <div className="text-sm font-bold text-on-surface">{props.label}</div>
          <div className="mt-1 text-xs text-slate-500">{props.description}</div>
        </div>
      </div>
    </button>
  );
}

function OptionEditor(props) {
  var option = props.option;

  return (
    <div className="space-y-3 rounded-[24px] bg-surface-container-low p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
          <span className="material-symbols-outlined text-[18px]">
            {props.questionType === "OPTIONS_MULTI" ? "check_box_outline_blank" : "radio_button_unchecked"}
          </span>
        </div>
        <input
          type="text"
          value={option.value}
          onChange={function onChange(event) {
            props.onChange({ value: event.target.value });
          }}
          className="flex-1 rounded-2xl border-none bg-white/80 px-4 py-3 text-sm font-medium text-on-surface shadow-inner shadow-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Option label"
        />
        <button
          type="button"
          onClick={props.onRemove}
          className="text-slate-400 transition hover:text-error"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>

      <ToggleRow
        active={option.conditional_logic}
        onToggle={function onToggle() {
          props.onChange({
            conditional_logic: !option.conditional_logic,
            conditionals: option.conditional_logic
              ? []
              : option.conditionals.length
              ? option.conditionals
              : [createConditionalRule(props.questions, props.currentQuestionCustomId)],
          });
        }}
        label="Show this option conditionally"
        description="Use resolver-compatible logic so options appear only for relevant answers."
      />

      {option.conditional_logic ? (
        <ConditionalRuleEditor
          rules={option.conditionals}
          questions={props.questions}
          currentQuestionCustomId={props.currentQuestionCustomId}
          onAddRule={props.onAddRule}
          onRemoveRule={props.onRemoveRule}
          onUpdateRule={props.onUpdateRule}
        />
      ) : null}
    </div>
  );
}

function QuestionCard(props) {
  var question = props.question;

  return (
    <Card
      className={cx(
        "p-6 transition duration-200",
        props.selected ? "ring-2 ring-primary/30 shadow-xl shadow-primary/10" : "hover:shadow-lg"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <button type="button" className="min-w-0 text-left" onClick={props.onSelect}>
          <Badge tone="primary">
            Question {props.index + 1} - {QUESTION_TYPE_META[question.type].shortLabel}
          </Badge>
          <div className="mt-3 font-headline text-2xl font-bold text-on-surface">
            {question.value || "Untitled question"}
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={props.onMoveUp}
            disabled={props.index === 0}
            className="rounded-2xl bg-surface-container px-3 py-2 text-slate-500 transition hover:bg-surface-container-high disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
          </button>
          <button
            type="button"
            onClick={props.onMoveDown}
            disabled={props.index === props.totalQuestions - 1}
            className="rounded-2xl bg-surface-container px-3 py-2 text-slate-500 transition hover:bg-surface-container-high disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
          </button>
          <button
            type="button"
            onClick={props.onDelete}
            className="rounded-2xl bg-error-container px-3 py-2 text-error transition hover:bg-error hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <TextareaField
          label="Prompt"
          rows={3}
          value={question.value}
          onChange={function onChange(event) {
            props.onQuestionChange({ value: event.target.value });
          }}
          placeholder="Ask a clear, direct question that maps to your schema."
          inputClassName="min-h-[110px]"
        />

        {isOptionQuestion(question.type) ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-on-surface">Options</div>
                <div className="text-xs text-slate-500">
                  Option `custom_id` values are preserved for conditional logic.
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={props.onAddOption} iconLeft="add">
                Add option
              </Button>
            </div>

            <div className="space-y-3">
              {question.options.map(function mapOption(option) {
                return (
                  <OptionEditor
                    key={option.custom_id}
                    option={option}
                    questionType={question.type}
                    questions={props.questions}
                    currentQuestionCustomId={question.custom_id}
                    onChange={function onChange(nextUpdates) {
                      props.onOptionChange(option.custom_id, nextUpdates);
                    }}
                    onRemove={function onRemove() {
                      props.onRemoveOption(option.custom_id);
                    }}
                    onAddRule={function onAddRule() {
                      props.onOptionChange(option.custom_id, {
                        conditionals: option.conditionals.concat(
                          createConditionalRule(props.questions, question.custom_id)
                        ),
                      });
                    }}
                    onRemoveRule={function onRemoveRule(ruleId) {
                      props.onOptionChange(option.custom_id, {
                        conditionals: option.conditionals.filter(function filterRule(rule) {
                          return rule.id !== ruleId;
                        }),
                      });
                    }}
                    onUpdateRule={function onUpdateRule(ruleId, updates) {
                      props.onOptionChange(option.custom_id, {
                        conditionals: option.conditionals.map(function mapRule(rule) {
                          return rule.id === ruleId ? Object.assign({}, rule, updates) : rule;
                        }),
                      });
                    }}
                  />
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

function SurveyBuilderWorkspace(props) {
  var builderState = props.builderState;
  var setBuilderState = props.setBuilderState;
  var [selectedQuestionCustomId, setSelectedQuestionCustomId] = useState(
    builderState.questions[0] ? builderState.questions[0].custom_id : null
  );
  var questionTypeOptions = useMemo(function memoizeTypes() {
    return getQuestionTypeOptions().map(function mapType(typeOption) {
      return { value: typeOption.value, label: typeOption.label };
    });
  }, []);

  useEffect(
    function syncSelection() {
      if (!builderState.questions.length) {
        setSelectedQuestionCustomId(null);
        return;
      }

      var stillExists = builderState.questions.some(function hasQuestion(question) {
        return question.custom_id === selectedQuestionCustomId;
      });

      if (!stillExists) {
        setSelectedQuestionCustomId(builderState.questions[0].custom_id);
      }
    },
    [builderState.questions, selectedQuestionCustomId]
  );

  function updateBuilder(updater) {
    setBuilderState(function setNextState(previousState) {
      return updater(previousState);
    });
  }

  function updateSurveyMeta(key, value) {
    updateBuilder(function updateMeta(previousState) {
      return {
        name: key === "name" ? value : previousState.name,
        surveyEditorState:
          key === "name"
            ? previousState.surveyEditorState
            : Object.assign({}, previousState.surveyEditorState, { [key]: value }),
        questions: previousState.questions,
        id: previousState.id,
      };
    });
  }

  function updateQuestion(questionCustomId, updater) {
    updateBuilder(function updateQuestions(previousState) {
      return Object.assign({}, previousState, {
        questions: previousState.questions.map(function mapQuestion(question) {
          return question.custom_id === questionCustomId ? updater(question) : question;
        }),
      });
    });
  }

  function addQuestion(type) {
    var nextQuestion = createQuestion(type);
    updateBuilder(function appendQuestion(previousState) {
      return Object.assign({}, previousState, {
        questions: previousState.questions.concat(nextQuestion),
      });
    });
    setSelectedQuestionCustomId(nextQuestion.custom_id);
  }

  function removeQuestion(questionCustomId) {
    updateBuilder(function removeFromState(previousState) {
      var remainingQuestions = previousState.questions.filter(function filterQuestion(question) {
        return question.custom_id !== questionCustomId;
      });

      var sanitizedQuestions = remainingQuestions.map(function sanitizeQuestion(question) {
        return Object.assign({}, question, {
          conditionals: (question.conditionals || []).filter(function filterRule(rule) {
            return rule.field !== questionCustomId;
          }),
          options: (question.options || []).map(function sanitizeOption(option) {
            return Object.assign({}, option, {
              conditionals: (option.conditionals || []).filter(function filterRule(rule) {
                return rule.field !== questionCustomId;
              }),
            });
          }),
        });
      });

      return Object.assign({}, previousState, {
        questions: sanitizedQuestions.length ? sanitizedQuestions : [createQuestion(TEXT)],
      });
    });
  }

  function reorderQuestion(questionCustomId, direction) {
    updateBuilder(function reorder(previousState) {
      var nextQuestions = previousState.questions.slice();
      var currentIndex = nextQuestions.findIndex(function findQuestion(question) {
        return question.custom_id === questionCustomId;
      });
      var targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= nextQuestions.length) {
        return previousState;
      }

      var currentQuestion = nextQuestions[currentIndex];
      nextQuestions[currentIndex] = nextQuestions[targetIndex];
      nextQuestions[targetIndex] = currentQuestion;

      return Object.assign({}, previousState, { questions: nextQuestions });
    });
  }

  function selectedQuestion() {
    return builderState.questions.find(function findQuestion(question) {
      return question.custom_id === selectedQuestionCustomId;
    });
  }

  var activeQuestion = selectedQuestion();

  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <div className="space-y-6 xl:col-span-3">
        <Card className="p-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
            Question types
          </div>
          <div className="mt-5 space-y-3">
            {getQuestionTypeOptions().map(function mapType(typeOption) {
              return (
                <QuestionTypeTile
                  key={typeOption.value}
                  label={typeOption.label}
                  description={typeOption.description}
                  icon={typeOption.icon}
                  onClick={function onClick() {
                    addQuestion(typeOption.value);
                  }}
                />
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
            Survey shell
          </div>
          <div className="mt-4 space-y-3">
            <InputField
              label="Survey name"
              value={builderState.name}
              onChange={function onChange(event) {
                updateSurveyMeta("name", event.target.value);
              }}
              placeholder="Customer satisfaction Q4"
            />
            <InputField
              label="Audience label"
              value={builderState.surveyEditorState.audienceLabel}
              onChange={function onChange(event) {
                updateSurveyMeta("audienceLabel", event.target.value);
              }}
              placeholder="Student Assessment Portal"
            />
            <InputField
              label="Hero image URL"
              value={builderState.surveyEditorState.heroImage}
              onChange={function onChange(event) {
                updateSurveyMeta("heroImage", event.target.value);
              }}
              placeholder="https://..."
            />
          </div>
        </Card>
      </div>

      <div className="space-y-6 xl:col-span-6">
        <Card className="overflow-hidden">
          <div className="relative">
            {builderState.surveyEditorState.heroImage ? (
              <img
                src={builderState.surveyEditorState.heroImage}
                alt={builderState.name || "Survey hero"}
                className="h-56 w-full object-cover"
              />
            ) : (
              <div className="h-56 bg-gradient-to-br from-primary-fixed to-secondary-container" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <Badge tone="dark">{builderState.surveyEditorState.status || "Draft"}</Badge>
              <div className="mt-3 font-headline text-4xl font-black tracking-tight">
                {builderState.name || "Untitled survey"}
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
                {builderState.surveyEditorState.description}
              </p>
            </div>
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-2">
            <InputField
              label="Eyebrow"
              value={builderState.surveyEditorState.eyebrow}
              onChange={function onChange(event) {
                updateSurveyMeta("eyebrow", event.target.value);
              }}
            />
            <InputField
              label="Status"
              value={builderState.surveyEditorState.status}
              onChange={function onChange(event) {
                updateSurveyMeta("status", event.target.value);
              }}
            />
            <TextareaField
              className="md:col-span-2"
              label="Description"
              value={builderState.surveyEditorState.description}
              onChange={function onChange(event) {
                updateSurveyMeta("description", event.target.value);
              }}
              rows={4}
            />
          </div>
        </Card>

        {builderState.questions.map(function mapQuestion(question, index) {
          return (
            <QuestionCard
              key={question.custom_id}
              selected={question.custom_id === selectedQuestionCustomId}
              question={question}
              index={index}
              totalQuestions={builderState.questions.length}
              questions={builderState.questions}
              onSelect={function onSelect() {
                setSelectedQuestionCustomId(question.custom_id);
              }}
              onQuestionChange={function onQuestionChange(nextUpdates) {
                updateQuestion(question.custom_id, function patchQuestion(currentQuestion) {
                  return Object.assign({}, currentQuestion, nextUpdates);
                });
              }}
              onAddOption={function onAddOption() {
                updateQuestion(question.custom_id, function appendOption(currentQuestion) {
                  return Object.assign({}, currentQuestion, {
                    options: currentQuestion.options.concat(createOption("")),
                  });
                });
              }}
              onOptionChange={function onOptionChange(optionCustomId, nextUpdates) {
                updateQuestion(question.custom_id, function patchOption(currentQuestion) {
                  return Object.assign({}, currentQuestion, {
                    options: currentQuestion.options.map(function mapOption(option) {
                      return option.custom_id === optionCustomId
                        ? Object.assign({}, option, nextUpdates)
                        : option;
                    }),
                  });
                });
              }}
              onRemoveOption={function onRemoveOption(optionCustomId) {
                updateQuestion(question.custom_id, function removeOption(currentQuestion) {
                  return Object.assign({}, currentQuestion, {
                    options: currentQuestion.options.filter(function filterOption(option) {
                      return option.custom_id !== optionCustomId;
                    }),
                  });
                });
              }}
              onMoveUp={function onMoveUp() {
                reorderQuestion(question.custom_id, "up");
              }}
              onMoveDown={function onMoveDown() {
                reorderQuestion(question.custom_id, "down");
              }}
              onDelete={function onDelete() {
                removeQuestion(question.custom_id);
              }}
            />
          );
        })}

        <button
          type="button"
          onClick={function onClick() {
            addQuestion(TEXT);
          }}
          className="flex w-full flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-200 bg-white/50 px-6 py-10 text-center transition hover:border-primary hover:bg-white"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-primary">
            <span className="material-symbols-outlined">add</span>
          </div>
          <div className="mt-4 text-lg font-bold text-on-surface">Add another question</div>
          <div className="mt-1 text-sm text-slate-500">
            Start with text and change the type later in the inspector.
          </div>
        </button>
      </div>

      <div className="space-y-6 xl:col-span-3">
        <Card className="sticky top-28 p-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
            Inspector
          </div>

          {activeQuestion ? (
            <div className="mt-5 space-y-5">
              <SelectField
                label="Question type"
                value={activeQuestion.type}
                options={questionTypeOptions}
                onChange={function onChange(event) {
                  var nextType = event.target.value;
                  updateQuestion(activeQuestion.custom_id, function updateType(question) {
                    return Object.assign({}, question, {
                      type: nextType,
                      allowOther: nextType === TEXT ? false : question.allowOther,
                      options:
                        nextType === TEXT
                          ? []
                          : question.options.length
                          ? question.options
                          : [createOption("First option"), createOption("Second option")],
                    });
                  });
                }}
              />

              {isOptionQuestion(activeQuestion.type) ? (
                <ToggleRow
                  active={activeQuestion.allowOther}
                  onToggle={function onToggle() {
                    updateQuestion(activeQuestion.custom_id, function toggleAllowOther(question) {
                      return Object.assign({}, question, { allowOther: !question.allowOther });
                    });
                  }}
                  label='Allow "Other" free-text answer'
                  description="Maps extra respondent input into the `value` field on AnswerInput."
                />
              ) : null}

              <ToggleRow
                active={activeQuestion.conditional_logic}
                onToggle={function onToggle() {
                  updateQuestion(activeQuestion.custom_id, function toggleLogic(question) {
                    return Object.assign({}, question, {
                      conditional_logic: !question.conditional_logic,
                      conditionals: question.conditional_logic
                        ? []
                        : question.conditionals.length
                        ? question.conditionals
                        : [createConditionalRule(builderState.questions, question.custom_id)],
                    });
                  });
                }}
                label="Display question conditionally"
                description="Serializes into `conditional_logic` and `conditionals` for the resolver."
              />

              {activeQuestion.conditional_logic ? (
                <ConditionalRuleEditor
                  rules={activeQuestion.conditionals}
                  questions={builderState.questions}
                  currentQuestionCustomId={activeQuestion.custom_id}
                  onAddRule={function onAddRule() {
                    updateQuestion(activeQuestion.custom_id, function appendRule(question) {
                      return Object.assign({}, question, {
                        conditionals: question.conditionals.concat(
                          createConditionalRule(builderState.questions, question.custom_id)
                        ),
                      });
                    });
                  }}
                  onRemoveRule={function onRemoveRule(ruleId) {
                    updateQuestion(activeQuestion.custom_id, function removeRule(question) {
                      return Object.assign({}, question, {
                        conditionals: question.conditionals.filter(function filterRule(rule) {
                          return rule.id !== ruleId;
                        }),
                      });
                    });
                  }}
                  onUpdateRule={function onUpdateRule(ruleId, updates) {
                    updateQuestion(activeQuestion.custom_id, function patchRule(question) {
                      return Object.assign({}, question, {
                        conditionals: question.conditionals.map(function mapRule(rule) {
                          return rule.id === ruleId ? Object.assign({}, rule, updates) : rule;
                        }),
                      });
                    });
                  }}
                />
              ) : null}

              <Card className="p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Public response UX
                </div>
                <div className="mt-3 text-sm leading-6 text-slate-500">
                  {isOptionQuestion(activeQuestion.type)
                    ? "Options will render as large, selectable cards in the public survey flow."
                    : "Open-text answers render in a large editorial textarea for longer responses."}
                </div>
              </Card>
            </div>
          ) : null}

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-6">
            <InputField
              label="Submission button label"
              value={builderState.surveyEditorState.submitLabel}
              onChange={function onChange(event) {
                updateSurveyMeta("submitLabel", event.target.value);
              }}
            />
            <InputField
              label="Thank-you title"
              value={builderState.surveyEditorState.thankYouTitle}
              onChange={function onChange(event) {
                updateSurveyMeta("thankYouTitle", event.target.value);
              }}
            />
            <TextareaField
              label="Thank-you message"
              rows={4}
              value={builderState.surveyEditorState.thankYouMessage}
              onChange={function onChange(event) {
                updateSurveyMeta("thankYouMessage", event.target.value);
              }}
            />
            <Button
              fullWidth
              size="lg"
              onClick={props.onSubmit}
              disabled={props.submitting || !builderState.name.trim() || !builderState.questions.length}
              iconLeft={props.submitting ? "hourglass_top" : "save"}
            >
              {props.submitting
                ? props.mode === "edit"
                  ? "Saving survey..."
                  : "Creating survey..."
                : props.mode === "edit"
                ? "Save survey"
                : "Create survey"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default SurveyBuilderWorkspace;
